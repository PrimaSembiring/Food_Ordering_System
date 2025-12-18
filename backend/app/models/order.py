from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database import Base
from datetime import datetime

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey("users.id"))
    total = Column(Integer)
    status = Column(String)
    order_date = Column(DateTime, default=datetime.utcnow)

    # ===== PAYMENT EXTENSION =====
    payment_method = Column(String, nullable=True)
    payment_status = Column(String, default="UNPAID")
    payment_proof = Column(String, nullable=True)
