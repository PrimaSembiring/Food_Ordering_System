from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from pyramid.threadlocal import get_current_registry

Base = declarative_base()
SessionLocal = None

def get_engine():
    settings = get_current_registry().settings
    return create_engine(settings["sqlalchemy.url"])

def get_session():
    global SessionLocal
    if SessionLocal is None:
        engine = get_engine()
        SessionLocal = sessionmaker(bind=engine)
    return SessionLocal()
