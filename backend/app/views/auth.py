from pyramid.view import view_config
from app.jwt import create_jwt
from app.database import SessionLocal
from app.models.user import User
from app.security import hash_password, verify_password

@view_config(route_name="register", request_method="POST", renderer="json")
def register(req):
    db = SessionLocal()
    d = req.json_body

    user = User(
        name=d["name"],
        email=d["email"],
        password=hash_password(d["password"]),
        role=d["role"]
    )
    db.add(user); db.commit()

    token = create_jwt({"id": user.id, "role": user.role})
    return {**user.__dict__, "token": token}

@view_config(route_name="login", request_method="POST", renderer="json")
def login(req):
    db = SessionLocal()
    d = req.json_body
    u = db.query(User).filter_by(email=d["email"]).first()

    if not u or not verify_password(d["password"], u.password):
        req.response.status = 401
        return {"error": "Invalid login"}

    token = create_jwt({"id": u.id, "role": u.role})
    return {**u.__dict__, "token": token}
