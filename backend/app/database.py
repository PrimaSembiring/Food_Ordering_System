import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, scoped_session

# ======================================================
# LOAD ENV
# ======================================================
load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:ragilbayu123@localhost:5432/db_makanan"
)

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")

# ======================================================
# ENGINE (FIX POOL PROBLEM)
# ======================================================
engine = create_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=30,
    pool_timeout=60,
    pool_recycle=1800,
    pool_pre_ping=True,
)

# ======================================================
# SESSION
# ======================================================
SessionLocal = scoped_session(
    sessionmaker(
        bind=engine,
        autoflush=False,
        autocommit=False
    )
)

Base = declarative_base()
