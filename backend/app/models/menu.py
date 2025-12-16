from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    category = Column(String)
    price = Column(Integer)
    image_url = Column(String)
    available = Column(Boolean, default=True)
