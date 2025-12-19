from pyramid.view import view_config
from pyramid.response import Response
from app.models.user import User
from app.security import hash_password, verify_password
from app.jwt import create_access_token


@view_config(route_name="register", renderer="json", request_method="POST")
def register(request):
    print(">>> REGISTER ENDPOINT HIT <<<")
    data = request.json_body

    # VALIDASI WAJIB
    if not data.get("email") or not data.get("password"):
        return Response(
            json={"error": "Email and password required"},
            status=400
        )

    # CEK USER SUDAH ADA
    existing = request.dbsession.query(User).filter_by(
        email=data["email"]
    ).first()

    if existing:
        return Response(
            json={"error": "Email already registered"},
            status=400
        )

    # BUAT USER BARU
    user = User(
        name=data.get("name", ""),
        email=data["email"],
        password=hash_password(data["password"]),
        role=data.get("role", "customer")
    )

    request.dbsession.add(user)
    request.dbsession.commit()    # penting: dapet user.id

    return {
        "message": "User registered",
        "user_id": user.id
    }
    

@view_config(route_name="login", renderer="json", request_method="POST")
def login(request):
    data = request.json_body

    user = request.dbsession.query(User).filter_by(
        email=data["email"]
    ).first()

    if not user or not verify_password(data["password"], user.password):
        return Response(
            json={"error": "Invalid credentials"},
            status=401
        )

    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "message": "Login success",
        "access_token": token,
        "token_type": "Bearer"
    }


