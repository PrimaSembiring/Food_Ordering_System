import os
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv

# ======================================================
# LOAD ENV (.env)
# ======================================================
load_dotenv()

# ======================================================
# JWT CONFIG
# ======================================================
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not set")

ALGORITHM = "HS256"
EXPIRE_MINUTES = 60

# ======================================================
# TOKEN FUNCTIONS
# ======================================================
def create_access_token(payload: dict) -> str:
    data = payload.copy()
    data["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES)
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
