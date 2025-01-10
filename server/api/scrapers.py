import requests
import json
import datetime
import os
from dotenv import load_dotenv


# scraper for leetcode
def scrape_leetcode(handlerid):
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
        "variables": {"username": handlerid}
    }

    response = requests.post(url, headers=headers, json=query)
    
    if response.status_code != 200:
        print("Failed to fetch data. Response Code:", response.status_code)
        print("Response Text:", response.text)
        return []
    
    data = response.json()
    # get submissions made in the last week
    submissionCalendar = data.get('data', {}).get('matchedUser', {}).get('submissionCalendar', {})
    recentSubmissions = json.loads(submissionCalendar)
    week_ago = datetime.datetime.now() - datetime.timedelta(days=7)
    
    tot_submissions = 0
    for timestamp, count in recentSubmissions.items():
        if datetime.datetime.fromtimestamp(int(timestamp)) >= week_ago:
            tot_submissions += int(count) 
    
    return tot_submissions

# scraper for github
def scrape_github(handlerid):
    load_dotenv()
    PAT = os.getenv('PAT')
    url = "https://api.github.com/graphql" # graphQL api endpoint
    headers = {"Authorization": f"Bearer {PAT}"}
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
    
    week_ago = datetime.datetime.now() - datetime.timedelta(days=7)
    contributions = 0

    weeks = data.get('data', {}).get('user', {}).get('contributionsCollection', {}).get('contributionCalendar', {}).get('weeks', [])
    for week in weeks:
        for day in week['contributionDays']:
            day_date = datetime.datetime.strptime(day['date'], "%Y-%m-%d")
            if day_date >= week_ago:
                contributions += day['contributionCount']

    return contributions