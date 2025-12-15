from sqlalchemy import Column, Integer, String
from app.database import Base

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    customerId = Column(Integer)
    customerName = Column(String)
    total = Column(Integer)
    status = Column(String)
    date = Column(String)
