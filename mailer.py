import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sqlite3
from dotenv import load_dotenv
import os

load_dotenv()
SMTP_SERVER = "smtp.gmail.com"  # For Gmail
SMTP_PORT = 587
EMAIL_ADDRESS = "singhanushka1603@gmail.com"  
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')

def compose_email(github_data, leetcode_data):
    """Compose the email with top performers."""
    subject = "Weekly Top Performers"
    body = "<h1>Weekly Top Performers</h1>"
    body += "<h2>GitHub</h2><ol>"
    for user in github_data:
        body += f"<li>{user[0]}: {user[1]} contributions</li>"
    body += "</ol><h2>LeetCode</h2><ol>"
    for user in leetcode_data:
        body += f"<li>{user[0]}: {user[1]} submissions</li>"
    body += "</ol>"
    
    return subject, body

def send_email(subject, body, recipient_list):
    """Send an email with the provided subject and body to the recipient list."""
    msg = MIMEMultipart("alternative")
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = ", ".join(recipient_list)
    msg["Subject"] = subject

    # Attach the email body
    msg.attach(MIMEText(body, "html"))

    # Send the email
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # Secure the connection
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, recipient_list, msg.as_string())
            print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")

db_path = "../outputs/stats.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
# github data
query1 = f"SELECT username, contributions FROM github_stats ORDER BY contributions DESC"
# leetcode data
query2 = f"SELECT username, submissions FROM leetcode_stats ORDER BY submissions DESC"

cursor.execute(query1)
results_github = cursor.fetchall()

cursor.execute(query2)
results_leetcode = cursor.fetchall()

conn.close()

# compose email
subject, body = compose_email(results_github, results_leetcode)
# Recipient list
recipients = ["b22ai008@iitj.ac.in"]
# Send email
send_email(subject, body, recipients)