from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Integer) # 1 sampai 5
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relasi: Siapa yang review? Review makanan apa?
    customer_id = Column(Integer, ForeignKey("users.id"))
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"))

    # Penghubung (Relationship)
    customer = relationship("User")
    menu_item = relationship("MenuItem")