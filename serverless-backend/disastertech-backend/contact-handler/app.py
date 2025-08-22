import json
import os
import urllib.parse
import urllib.request
import boto3
import traceback

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
	# Debug: log full incoming event (may include headers/context)
	try:
		print("Event received:", json.dumps(event))
	except Exception:
		print("Event received (non-serializable)")
	if event.get("httpMethod") == "OPTIONS":
		return _resp(200, {"ok": True})

	try:
		body = json.loads(event.get("body") or "{}")
	except Exception:
		print("Invalid JSON body:", event.get("body"))
		return _resp(400, {"error": "Invalid JSON"})

	name = (body.get("name") or "").strip()
	email = (body.get("email") or "").strip()
	message = (body.get("message") or "").strip()
	token = body.get("recaptcha_token") or body.get("token") or body.get("g-recaptcha-response")
	print("Parsed body:", json.dumps({"name": name, "email": email, "has_message": bool(message), "has_token": bool(token)}))
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
		print("reCAPTCHA verification result:", json.dumps(verification))
	except Exception as e:
		print("reCAPTCHA verification exception:\n", traceback.format_exc())
		return _resp(502, {"error": "recaptcha verification failed", "details": str(e)})

	if not verification.get("success"):
		print("reCAPTCHA failed:", json.dumps(verification))
		return _resp(403, {"error": "recaptcha failed", "verification": verification})

	# Optional scoring check for v3
	score = verification.get("score")
	if score is not None and float(score) < 0.3:
		return _resp(403, {"error": "low recaptcha score", "score": score})

	from_email = os.environ.get("FROM_EMAIL") or os.environ.get("SES_FROM_ADDRESS")
	to_email = os.environ.get("TO_EMAIL") or os.environ.get("SES_TO_ADDRESS") or from_email
	if not from_email:
		return _resp(500, {"error": "FROM_EMAIL not configured"})
	print("Preparing SES send", json.dumps({"from": from_email, "to": to_email}))

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
		print(f"Attempting SES send from {from_email} to {to_email}")
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
		error_msg = str(e)
		print(f"SES error: {error_msg}")
		print("SES send exception:\n", traceback.format_exc())
		print(str(e))  # Additional error logging
		
		# Check for common SES issues
		if "not verified" in error_msg.lower():
			return _resp(502, {"error": "Email address not verified in SES. Please verify the sender email in AWS SES console."})
		elif "sandbox" in error_msg.lower():
			return _resp(502, {"error": "SES is in sandbox mode. Please request production access or verify recipient email."})
		elif "quota" in error_msg.lower():
			return _resp(502, {"error": "SES sending quota exceeded. Please check your AWS SES limits."})
		else:
			return _resp(502, {"error": "ses send failed", "details": error_msg})

	print("SES send successful")
	return _resp(200, {"ok": True}) 