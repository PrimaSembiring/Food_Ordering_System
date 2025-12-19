from pyramid.view import view_config
from pyramid.response import Response
from app.database import SessionLocal
from app.models.user import User
from app.security import hash_password, verify_password # Import fungsi security
import jwt
import os
from datetime import datetime, timedelta

# Pastikan SECRET_KEY diambil dari environment variable untuk keamanan
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")

# --- FITUR REGISTER (BARU) ---
@view_config(route_name="register", request_method="POST", renderer="json")
def register(request):
    db = SessionLocal()
    try:
        data = request.json_body
        
        # 1. Validasi input dasar
        if not all(k in data for k in ["name", "email", "password", "role"]):
            return Response(json_body={"error": "Missing required fields"}, status=400)

        # 2. Cek apakah email sudah ada
        existing_user = db.query(User).filter(User.email == data["email"]).first()
        if existing_user:
            return Response(json_body={"error": "Email already registered"}, status=400)

        # 3. Buat user baru dengan PASSWORD DI-HASH
        new_user = User(
            name=data["name"],
            email=data["email"],
            password=hash_password(data["password"]), # Penting: Hash password!
            role=data["role"]
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "User created successfully",
            "user": {
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email,
                "role": new_user.role
            }
        }
    except Exception as e:
        return Response(json_body={"error": str(e)}, status=500)
    finally:
        db.close()

# --- FITUR LOGIN (DIPERBAIKI) ---
@view_config(route_name="login", request_method="POST", renderer="json")
def login(request):
    db = SessionLocal()
    data = request.json_body

    try:
        user = db.query(User).filter(User.email == data["email"]).first()

        # Perbaikan Security: Gunakan verify_password, bukan "=="
        if not user or not verify_password(data["password"], user.password):
            return Response(
                json_body={"error": "Invalid credentials"},
                status=401
            )

        # Buat Token JWT
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