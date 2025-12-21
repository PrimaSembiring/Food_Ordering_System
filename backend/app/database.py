import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ======================================================
# LOAD ENV (.env)
# ======================================================
load_dotenv()

# ======================================================
# DATABASE CONFIG
# ======================================================
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:ragilbayu123@localhost:5432/db_makanan"
)

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # aman untuk koneksi lama / deploy
)

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
