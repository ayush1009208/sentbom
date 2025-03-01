import sqlite3
import pickle
import yaml
import os

# Insecure: SQL Injection vulnerability
def get_user(username):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM users WHERE username = '{username}'")
    return cursor.fetchone()

# Insecure: Unsafe deserialization
def load_user_preferences(data):
    return pickle.loads(data)

# Insecure: Unsafe yaml loading
def parse_config(config_str):
    return yaml.load(config_str)

# Insecure: Command injection
def backup_data(filename):
    os.system(f"tar -czf backup.tar.gz {filename}")

# Insecure: Hardcoded credentials
API_KEY = "1234-abcd-5678-efgh"
SECRET_KEY = "super_secret_key_123"
