from sqlalchemy import Column, Integer, String
from app.database import Base

class Menu(Base):
    __tablename__ = "menus"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    category = Column(String)
    price = Column(Integer)
    image = Column(String)
    ownerId = Column(Integer)
