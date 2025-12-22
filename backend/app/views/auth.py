from pyramid.view import view_config
from pyramid.response import Response

from app.models.user import User
from app.security import hash_password, verify_password
from app.jwt import create_access_token


# =========================
# REGISTER
# =========================
@view_config(route_name="register", renderer="json", request_method="POST")
def register(request):
    data = request.json_body

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "customer")

    if not name or not email or not password:
        return Response(
            json={"error": "Name, email, and password required"},
            status=400
        )

    if role not in ("customer", "owner"):
        return Response(
            json={"error": "Role must be customer or owner"},
            status=400
        )

    existing = request.dbsession.query(User).filter_by(email=email).first()
    if existing:
        return Response(
            json={"error": "Email already registered"},
            status=400
        )

    user = User(
        name=name,
        email=email,
        password=hash_password(password),
        role=role
    )

    request.dbsession.add(user)
    request.dbsession.commit()

    return {
        "success": True,
        "message": "Register successful"
    }


# =========================
# LOGIN
# =========================
@view_config(route_name="login", renderer="json", request_method="POST")
def login(request):
    data = request.json_body

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return Response(
            json={"error": "Email and password required"},
            status=400
        )

    user = request.dbsession.query(User).filter_by(email=email).first()

    if not user or not verify_password(password, user.password):
        return Response(
            json={"error": "Invalid credentials"},
            status=401
        )

    access_token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "success": True,
        "message": "Login success",
        "data": {
            "access_token": access_token,
            "role": user.role
        }
    }

