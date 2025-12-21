from pyramid.view import view_config
from app.models.user import User
from app.security import hash_password, verify_password
from app.jwt import create_access_token
from app.utils.response import success, error


@view_config(route_name="register", renderer="json", request_method="POST")
def register(request):
    data = request.json_body

    if not data.get("email") or not data.get("password"):
        return error("Email and password required", 400)

    existing = request.dbsession.query(User).filter_by(
        email=data["email"]
    ).first()

    if existing:
        return error("Email already registered", 400)

    user = User(
        name=data.get("name", ""),
        email=data["email"],
        password=hash_password(data["password"]),
        role=data.get("role", "customer")
    )

    request.dbsession.add(user)
    request.dbsession.commit()

    return success(
        {"user_id": user.id},
        "User registered"
    )


@view_config(route_name="login", renderer="json", request_method="POST")
def login(request):
    data = request.json_body

    user = request.dbsession.query(User).filter_by(
        email=data.get("email")
    ).first()

    if not user or not verify_password(data.get("password"), user.password):
        return error("Invalid credentials", 401)

    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return success(
        {
            "access_token": token,
            "token_type": "Bearer"
        },
        "Login success"
    )
