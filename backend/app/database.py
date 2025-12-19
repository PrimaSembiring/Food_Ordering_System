import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:ragilbayu123@localhost:5432/db_makanan"
)

engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,
    echo=True  # ganti False kalau sudah stabil
)

DBSession = sessionmaker(bind=engine)
