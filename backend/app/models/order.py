from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database import Base
from datetime import datetime

# Definisi status yang valid (asumsi ini adalah bagian yang perlu diubah)
STATUSES = [
    'waiting_payment',
    'payment_uploaded',
    'pending',
    'processing',
    'ready',
    'delivered',
    'completed', # <<< TAMBAHKAN STATUS BARU
    'cancelled'
]

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey("users.id"))
    total = Column(Integer)
    # Gunakan status string, dan pastikan di views Anda melakukan validasi terhadap STATUSES
    status = Column(String) 
    order_date = Column(DateTime, default=datetime.utcnow)

    # ===== PAYMENT EXTENSION =====
    payment_method = Column(String, nullable=True)
    payment_status = Column(String, default="UNPAID")
    payment_proof = Column(String, nullable=True)

# Setelah perubahan ini, Anda mungkin perlu menjalankan migrasi database 
# (misalnya, `alembic revision --autogenerate -m "Add completed status"` 
# dan `alembic upgrade head`) jika Anda menggunakan ORM seperti SQLAlchemy.
