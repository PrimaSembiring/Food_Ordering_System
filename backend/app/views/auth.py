from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest
from app.models.user import User
from app.database import SessionLocal
from app.security import hash_password

@view_config(
    route_name="register",
    request_method="POST",
    renderer="json",
    permission=None
)
def register(request):
    db = SessionLocal()
    data = request.json_body

    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "customer")

    if not email or not password:
        return HTTPBadRequest(json_body={"error": "Email dan password wajib diisi"})

    # cek user existing
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        return HTTPBadRequest(json_body={"error": "Email sudah terdaftar"})

    user = User(
        email=email,
        password=hash_password(password),
        role=role
    )

    db.add(user)
    db.commit()

    return {
        "message": "Register berhasil"
    }
