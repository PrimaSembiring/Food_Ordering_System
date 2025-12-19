import jwt
from datetime import datetime, timedelta

SECRET_KEY = "SUPER_SECRET_KEY_GANTI_DI_PRODUKSI"
ALGORITHM = "HS256"
EXPIRE_MINUTES = 60


def create_access_token(payload: dict) -> str:
    data = payload.copy()
    data["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES)
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
