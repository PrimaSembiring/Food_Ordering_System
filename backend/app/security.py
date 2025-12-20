from pyramid.response import Response
from passlib.context import CryptContext
from app.jwt import decode_access_token
from passlib.exc import UnknownHashError

# =========================
# PASSWORD HASHING
# =========================
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except UnknownHashError:
        return False


# =========================
# JWT AUTH DECORATOR
# =========================
def require_auth(view_func):
    def wrapper(request):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return Response(
                json={"error": "Missing or invalid Authorization header"},
                status=401
            )

        token = auth_header.split(" ", 1)[1]

        try:
            payload = decode_access_token(token)
            request.user = payload
        except Exception:
            return Response(
                json={"error": "Invalid or expired token"},
                status=401
            )

        return view_func(request)
    return wrapper


# =========================
# ROLE-BASED AUTH
# =========================
def require_role(*roles):
    def decorator(view_func):
        def wrapper(request):
            user = getattr(request, "user", None)
            if not user or user.get("role") not in roles:
                return Response(
                    json={"error": "Forbidden"},
                    status=403
                )
            return view_func(request)
        return wrapper
    return decorator
