import requests
import datetime
import json
import os
import sqlite3

# Loading usernames
def load_usernames(input_file):
    with open(input_file, 'r') as file:
        return [line.strip() for line in file.readlines()]

# Fetching number of contributions of the user
def fetch_contributions(username):
    pat = "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"   # Personal access token
    url = "https://api.github.com/graphql" # graphQL api endpoint
    headers = {"Authorization": f"Bearer {pat}"}
    query = {
        "query": """
        query ($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
          }
        }
        """,
        "variables": {"username": username}
    }
    
    response = requests.post(url, json=query, headers=headers)
    
    if response.status_code != 200:
        print("Failed to fetch data. Response Code:", response.status_code)
        print("Response Text:", response.text)
        return []
    
    data = response.json()
    return data

# Calculate number of contributions from whenever this script is run to a week back
def calculate_weekly_contributions(data):
    week_ago = datetime.datetime.now() - datetime.timedelta(days=7)
    contributions = 0

    weeks = data.get('data', {}).get('user', {}).get('contributionsCollection', {}).get('contributionCalendar', {}).get('weeks', [])
    for week in weeks:
        for day in week['contributionDays']:
            day_date = datetime.datetime.strptime(day['date'], "%Y-%m-%d")
            if day_date >= week_ago:
                contributions += day['contributionCount']

    return contributions

# Get top performers
def get_top_performers(usernames):
    performers = []

    for username in usernames:
        data = fetch_contributions(username)
        weekly_contributions = calculate_weekly_contributions(data)
        performers.append({"username": username, "contributions": weekly_contributions})

    # Sort by contributions and get the top 3
    performers.sort(key=lambda x: x['contributions'], reverse=True)
    return performers[:3]

# Save results to SQLite database
def save_to_database(performers, db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS github_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        contributions INTEGER NOT NULL
    )
    ''')

    # Clear old data
    cursor.execute('DELETE FROM github_stats')

    # Insert new data
    for performer in performers:
        cursor.execute('INSERT INTO github_stats (username, contributions) VALUES (?, ?)', 
                       (performer['username'], performer['contributions']))

    conn.commit()
    conn.close()
    
input_file = '../inputs/githubinp.txt'
db_path = '../outputs/stats.db'

usernames = load_usernames(input_file)
top_coders = get_top_performers(usernames)

# Save the results to the SQLite database
os.makedirs(os.path.dirname(db_path), exist_ok=True)
save_to_database(top_coders, db_path)

print("Top performers:")
for coder in top_coders:
    print(f"{coder['username']}: {coder['contributions']} contributions")