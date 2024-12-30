import requests
import json
import datetime
import os
import sqlite3

# Loading usernames
def load_usernames(input_file):
    with open(input_file, 'r') as file:
        return [line.strip() for line in file.readlines()]
    
# Fetching number of submissions of the user
def fetch_submissions(username):
    url = 'https://leetcode.com/graphql'
    headers = {"Content-Type": "application/json"}
    query = {
        "query": """
        query recentSubmissions($username: String!) {
            matchedUser(username: $username) {
                submissionCalendar
            }
        }
        """,
        "variables": {"username": username}
    }

    response = requests.post(url, headers=headers, json=query)
    
    if response.status_code != 200:
        print("Failed to fetch data. Response Code:", response.status_code)
        print("Response Text:", response.text)
        return []
    
    data = response.json()
    return data

# Calculate number of submissions from whenever this script is run to a week back
def calculate_weekly_submissions(data):
    submissionCalendar = data.get('data', {}).get('matchedUser', {}).get('submissionCalendar', {})
    recentSubmissions = json.loads(submissionCalendar)
    week_ago = datetime.datetime.now() - datetime.timedelta(days=7)
    
    tot_submissions = 0
    for timestamp, count in recentSubmissions.items():
        if datetime.datetime.fromtimestamp(int(timestamp)) >= week_ago:
            tot_submissions += int(count) 
    
    return tot_submissions

# Get top performers
def get_top_performers(usernames):
    performers = []
    for username in usernames:
        data = fetch_submissions(username)
        weekly_submissions = calculate_weekly_submissions(data)
        performers.append({'username': username , 'submissions': weekly_submissions})
    
    performers.sort(key=lambda x : x['submissions'], reverse=True)
    return performers[:3]


# Save results to SQLite database
def save_to_database(performers, db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS leetcode_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        submissions INTEGER NOT NULL
    )
    ''')

    # Clear old data
    cursor.execute('DELETE FROM leetcode_stats')

    # Insert new data
    for performer in performers:
        cursor.execute('INSERT INTO leetcode_stats (username, submissions) VALUES (?, ?)', 
                       (performer['username'], performer['submissions']))

    conn.commit()
    conn.close()
    
input_file = '/Users/anushkasingh/Desktop/Code/webD/repos/Skill-Peak/inputs/leetcodeinp.txt'
db_path = '../outputs/stats.db'

usernames = load_usernames(input_file)
top_performers = get_top_performers(usernames)

# Save the results to the SQLite database
os.makedirs(os.path.dirname(db_path), exist_ok=True)
save_to_database(top_performers, db_path)

print("Top performers:")
for performer in top_performers:
    print(f"{performer['username']}: {performer['submissions']} submissions")