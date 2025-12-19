from sqlalchemy import Column, Integer, ForeignKey, Text
from app.models.base import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    rating = Column(Integer)
    comment = Column(Text)
    customer_id = Column(Integer, ForeignKey("users.id"))
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"))
