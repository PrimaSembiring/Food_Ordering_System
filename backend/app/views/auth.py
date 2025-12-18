from pyramid.view import view_config
from pyramid.response import Response
from app.database import SessionLocal
from app.models.user import User
import jwt
import os
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")


@view_config(route_name="login", request_method="POST", renderer="json")
def login(request):
    db = SessionLocal()
    data = request.json_body

    try:
        user = db.query(User).filter(User.email == data["email"]).first()

        if not user or user.password != data["password"]:
            return Response(
                json_body={"error": "Invalid credentials"},
                status=401
            )

        payload = {
            "user_id": user.id,
            "email": user.email,
            "role": user.role,
            "exp": datetime.utcnow() + timedelta(hours=6),
        }

        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        return {
            "token": token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
            }
        }

    finally:
        db.close()
