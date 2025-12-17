from pyramid.view import view_config
from pyramid.response import Response
from datetime import datetime, timedelta
import jwt
import os

from app.database import get_session
from app.models.user import User

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")

@view_config(route_name="login", request_method="POST", renderer="json")
def login(request):
    db = get_session()
    data = request.json_body

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return Response(
            json_body={"error": "Email and password required"},
            status=400
        )

    user = db.query(User).filter(User.email == email).first()

    if not user or user.password != password:
        return Response(
            json_body={"error": "Invalid credentials"},
            status=401
        )

    payload = {
        "user_id": user.id,
        "email": user.email,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(hours=6)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }
