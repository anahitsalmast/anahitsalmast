#!/usr/bin/env python3
"""
Fixed web application with security vulnerabilities addressed
"""
import sqlite3
import hashlib
import secrets
import os
import time
from pathlib import Path
from werkzeug.utils import secure_filename
from flask import Flask, request, render_template_string, session, redirect, url_for, abort
from functools import wraps
import bcrypt
import threading

app = Flask(__name__)
# Fix: Use environment variable or generate secure random key
app.secret_key = os.environ.get('SECRET_KEY', secrets.token_hex(32))

# Fix: Rate limiting implementation
request_counts = {}
request_lock = threading.Lock()

def rate_limit(max_requests=10, window=60):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            client_ip = request.remote_addr
            current_time = time.time()
            
            with request_lock:
                if client_ip not in request_counts:
                    request_counts[client_ip] = []
                
                # Remove old requests outside the window
                request_counts[client_ip] = [
                    req_time for req_time in request_counts[client_ip]
                    if current_time - req_time < window
                ]
                
                if len(request_counts[client_ip]) >= max_requests:
                    abort(429)  # Too Many Requests
                
                request_counts[client_ip].append(current_time)
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Fix: Use parameterized queries to prevent SQL injection
def authenticate_user(username, password):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # Fixed: Parameterized query prevents SQL injection
    query = "SELECT * FROM users WHERE username = ? AND password_hash = ?"
    cursor.execute(query, (username, hash_password(password)))
    result = cursor.fetchone()
    conn.close()
    return result

# Fix: Use bcrypt for secure password hashing
def hash_password(password):
    # Fixed: Use bcrypt with salt for secure password hashing
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# Fix: Input validation and escape HTML to prevent XSS
@app.route('/profile/<username>')
def profile(username):
    # Fixed: Validate and sanitize input
    if not username or len(username) > 50 or not username.isalnum():
        abort(400)
    
    # Fixed: Use safe template rendering with escaping
    from markupsafe import escape
    safe_username = escape(username)
    template = "<h1>Welcome {{ username }}!</h1>"
    return render_template_string(template, username=safe_username)

# Fix: Atomic file operations and proper error handling
def save_user_data(user_id, data):
    # Fixed: Input validation
    if not isinstance(user_id, (int, str)) or not data:
        raise ValueError("Invalid user_id or data")
    
    filename = f"user_{secure_filename(str(user_id))}.txt"
    temp_filename = f"{filename}.tmp"
    
    # Fixed: Atomic write operation using temporary file
    try:
        with open(temp_filename, 'w') as f:
            f.write(data)
        
        # Atomic rename operation
        os.rename(temp_filename, filename)
    except Exception as e:
        # Clean up temporary file on error
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        raise e

# Fix: Avoid modifying list during iteration
def process_data(items):
    # Fixed: Create a copy to avoid modifying during iteration
    items_copy = items.copy()
    result = []
    negative_items = []
    
    for item in items_copy:
        if item > 0:
            result.append(item * 2)
        else:
            negative_items.append(abs(item))
    
    # Process negative items separately
    result.extend(negative_items)
    return result

# Fix: Path validation to prevent directory traversal
@app.route('/download/<filename>')
def download_file(filename):
    # Fixed: Validate filename and prevent directory traversal
    safe_filename = secure_filename(filename)
    if not safe_filename or safe_filename != filename:
        abort(400)
    
    # Ensure file is within uploads directory
    upload_dir = Path("uploads").resolve()
    file_path = (upload_dir / safe_filename).resolve()
    
    # Check if file is within allowed directory
    if not str(file_path).startswith(str(upload_dir)):
        abort(403)
    
    try:
        with open(file_path, 'r') as f:
            return f.read()
    except FileNotFoundError:
        abort(404)
    except PermissionError:
        abort(403)

# Fix: Remove debug endpoint or add proper authentication
@app.route('/debug')
def debug_info():
    # Fixed: Only available in development and with authentication
    if not app.debug or not session.get('is_admin'):
        abort(403)
    
    # Fixed: Limited, safe information disclosure
    return {
        'app_mode': 'debug' if app.debug else 'production',
        'python_version': os.sys.version.split()[0],
        'timestamp': time.time()
    }

# Fix: Add rate limiting and input validation
@app.route('/heavy_computation')
@rate_limit(max_requests=5, window=60)
def heavy_computation():
    try:
        n = int(request.args.get('n', 1000))
        # Fixed: Set reasonable upper limit to prevent DoS
        max_n = 1000000
        if n > max_n or n < 0:
            abort(400, f"Parameter 'n' must be between 0 and {max_n}")
        
        result = sum(i ** 2 for i in range(n))
        return str(result)
    except ValueError:
        abort(400, "Parameter 'n' must be a valid integer")

# Fix: Specific exception handling and input validation
@app.route('/divide')
def divide():
    try:
        a = int(request.args.get('a'))
        b = int(request.args.get('b'))
        
        # Fixed: Check for division by zero
        if b == 0:
            return "Error: Division by zero is not allowed", 400
        
        result = a / b
        return str(result)
    except (ValueError, TypeError):
        return "Error: Both parameters must be valid integers", 400
    except Exception as e:
        # Log the error for debugging but don't expose details
        app.logger.error(f"Unexpected error in divide: {e}")
        return "Internal server error", 500

if __name__ == '__main__':
    # Fixed: Secure configuration for production
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    host = '127.0.0.1' if debug_mode else '0.0.0.0'
    
    app.run(debug=debug_mode, host=host, port=5000)