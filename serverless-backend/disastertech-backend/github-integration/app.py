import json
import urllib.request

def lambda_handler(event, context):
    # Handle CORS preflight requests
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            }
        }
    
    try:
        # Example: Fetch latest commits from your GitHub repo (replace with your repo)
        repo_url = "https://api.github.com/repos/azaynul10/disastertech-dev/commits"  # Replace 'yourusername' with your GitHub username
        with urllib.request.urlopen(repo_url) as response:
            data = json.loads(response.read().decode())
            commits = [commit['commit']['message'] for commit in data[:5]]  # Get last 5 commit messages

        return {
            'statusCode': 200,
            'body': json.dumps({'commits': commits}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            }
        }