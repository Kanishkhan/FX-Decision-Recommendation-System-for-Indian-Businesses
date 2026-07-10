import os
import sys

# Add the project root and backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from backend.api_bridge import app

# Vercel needs the 'app' variable to be the Flask instance
# We already have 'app' defined in api_bridge.py
# If you need to handle serverless specific logic, do it here.
