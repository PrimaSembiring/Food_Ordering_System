import os
import jwt
from datetime import datetime, timedelta
from pyramid_jwt import JWTAuthenticationPolicy

JWT_SECRET = os.getenv("JWT_SECRET", "secret-key")
JWT_ALGORITHM = "HS256"

def create_jwt(data):
    """Create a JWT token with the given data"""
    payload = {
        **data,
        "exp": datetime.utcnow() + timedelta(hours=24),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def includeme(config):
    config.set_authentication_policy(
        JWTAuthenticationPolicy(
            private_key=JWT_SECRET,
            algorithm=JWT_ALGORITHM
        )
    )
