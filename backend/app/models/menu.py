from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    price = Column(Integer, nullable=False)
    image_url = Column(String(255))
    available = Column(Boolean, default=True)
