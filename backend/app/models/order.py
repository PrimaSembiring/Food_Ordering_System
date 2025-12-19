from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship  # <--- Wajib ada
from app.database import Base
from datetime import datetime

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    total = Column(Integer)
    status = Column(String, default="PENDING")
    payment_method = Column(String, nullable=True)
    payment_proof = Column(String, nullable=True)
    payment_status = Column(String, default="WAITING_PAYMENT")
    order_date = Column(DateTime, default=datetime.utcnow)
    
    customer_id = Column(Integer, ForeignKey("users.id"))

    # --- RELASI (HAPALAN PENTING) ---
    customer = relationship("User")
    
    # INI YANG TADI ERROR (Kurang baris ini):
    # Artinya: "Satu Order punya banyak Items"
    items = relationship("OrderItem", back_populates="order")