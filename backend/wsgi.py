import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(__file__))

from waitress import serve
from app import main

if __name__ == '__main__':
    # Create the WSGI app
    settings = {
        'sqlalchemy.url': 'sqlite:///./test.db'
    }
    app = main({}, **settings)
    
    # Serve the app
    print("Starting server on http://0.0.0.0:8000")
    serve(app, host='0.0.0.0', port=8000)
