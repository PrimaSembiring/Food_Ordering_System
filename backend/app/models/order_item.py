from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    name = Column(String)
    price = Column(Integer)
    quantity = Column(Integer)
