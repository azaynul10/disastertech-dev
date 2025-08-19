import json
import os
import urllib.parse
import urllib.request
import boto3

SES = boto3.client("ses")

DEFAULT_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "Content-Type,Authorization",
	"Access-Control-Allow-Methods": "POST,OPTIONS",
}


def _resp(status: int, body: dict):
	return {
		"statusCode": status,
		"headers": DEFAULT_HEADERS,
		"body": json.dumps(body),
	}


def verify_recaptcha(token: str, remote_ip: str | None = None) -> dict:
	secret = os.environ.get("RECAPTCHA_SECRET")
	if not secret:
		raise RuntimeError("RECAPTCHA_SECRET not configured")
	data = {
		"secret": secret,
		"response": token,
	}
	if remote_ip:
		data["remoteip"] = remote_ip
	params = urllib.parse.urlencode(data).encode()
	req = urllib.request.Request(
		"https://www.google.com/recaptcha/api/siteverify", data=params
	)
	with urllib.request.urlopen(req, timeout=10) as f:
		return json.loads(f.read().decode())


def handler(event, context):
	if event.get("httpMethod") == "OPTIONS":
		return _resp(200, {"ok": True})

	try:
		body = json.loads(event.get("body") or "{}")
	except Exception:
		return _resp(400, {"error": "Invalid JSON"})

	name = (body.get("name") or "").strip()
	email = (body.get("email") or "").strip()
	message = (body.get("message") or "").strip()
	token = body.get("recaptcha_token") or body.get("token") or body.get("g-recaptcha-response")
	if not all([name, email, message, token]):
		return _resp(400, {"error": "Missing required fields"})

	remote_ip = (
		event.get("requestContext", {})
		.get("identity", {})
		.get("sourceIp")
	)

	# Verify reCAPTCHA v3/enterprise
	try:
		verification = verify_recaptcha(token, remote_ip)
	except Exception as e:
		return _resp(502, {"error": "recaptcha verification failed", "details": str(e)})

	if not verification.get("success"):
		return _resp(403, {"error": "recaptcha failed", "verification": verification})

	# Optional scoring check for v3
	score = verification.get("score")
	if score is not None and float(score) < 0.3:
		return _resp(403, {"error": "low recaptcha score", "score": score})

	from_email = os.environ.get("FROM_EMAIL") or os.environ.get("SES_FROM_ADDRESS")
	to_email = os.environ.get("TO_EMAIL") or os.environ.get("SES_TO_ADDRESS") or from_email
	if not from_email:
		return _resp(500, {"error": "FROM_EMAIL not configured"})

	subject = "New Contact Form Submission"
	text_body = (
		f"Name: {name}\n"
		f"Email: {email}\n\n"
		f"Message:\n{message}\n"
	)
	html_body = f"""
		<h3>New Contact Form Submission</h3>
		<p><strong>Name:</strong> {name}</p>
		<p><strong>Email:</strong> {email}</p>
		<p><strong>Message:</strong><br/>{urllib.parse.quote_plus(message).replace('+', ' ')}</p>
	"""

	try:
		SES.send_email(
			Source=from_email,
			Destination={"ToAddresses": [to_email]},
			Message={
				"Subject": {"Data": subject, "Charset": "UTF-8"},
				"Body": {
					"Text": {"Data": text_body, "Charset": "UTF-8"},
					"Html": {"Data": html_body, "Charset": "UTF-8"},
				},
			},
		)
	except Exception as e:
		return _resp(502, {"error": "ses send failed", "details": str(e)})

	return _resp(200, {"ok": True}) 