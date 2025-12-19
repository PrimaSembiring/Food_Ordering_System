from pyramid.view import view_config
from pyramid.response import Response
from app.models.user import User
from app.security import hash_password, verify_password


# =========================
# REGISTER
# =========================
@view_config(route_name="register", renderer="json", request_method="POST")
def register(request):
    data = request.json_body

    # cek user sudah ada
    existing = request.dbsession.query(User).filter_by(
        email=data["email"]
    ).first()

    if existing:
        return Response(
            json={"error": "Email already registered"},
            status=400
        )

    user = User(
        name=data["name"],
        email=data["email"],
        password=hash_password(data["password"]),
        role=data["role"]
    )

    request.dbsession.add(user)
    request.dbsession.flush()

    return {
        "message": "User registered",
        "user_id": user.id
    }


# =========================
# LOGIN
# =========================
@view_config(route_name="login", renderer="json", request_method="POST")
def login(request):
    data = request.json_body

    user = request.dbsession.query(User).filter_by(
        email=data["email"]
    ).first()

    if user is None:
        return Response(
            json={"error": "Invalid credentials"},
            status=401
        )

    if not verify_password(data["password"], user.password):
        return Response(
            json={"error": "Invalid credentials"},
            status=401
        )

    return {
        "message": "Login success",
        "user_id": user.id,
        "role": user.role
    }
