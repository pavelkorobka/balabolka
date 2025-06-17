from sqlalchemy import func, Column, Integer, Numeric, Text, TIMESTAMP, ForeignKey
from app.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    amount = Column(Numeric(10, 2))
    status = Column(Text)
    payment_provider = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
