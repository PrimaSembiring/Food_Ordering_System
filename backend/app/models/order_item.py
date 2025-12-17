from sqlalchemy import Column, Integer, ForeignKey
from app.database import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)

    # ⬇️ SAMAKAN DENGAN POSTGRES
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"), nullable=False)

    price = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
