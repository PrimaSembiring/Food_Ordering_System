import os
from pyramid_jwt import JWTAuthenticationPolicy

def includeme(config):
    config.set_authentication_policy(
        JWTAuthenticationPolicy(
            secret=os.getenv("JWT_SECRET"),
            algorithm="HS256"
        )
    )
