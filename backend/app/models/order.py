from sqlalchemy import Column, Integer, ForeignKey, String, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total = Column(Integer, nullable=False)

    status = Column(String, default="pending")
    order_date = Column(DateTime)
    payment_method = Column(String)
    payment_status = Column(String)
    payment_proof = Column(String)

    customer = relationship("User")
    items = relationship("OrderItem", back_populates="order")
