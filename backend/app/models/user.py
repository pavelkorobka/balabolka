from sqlalchemy import func, Column, BigInteger, Boolean, Text, TIMESTAMP
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    telegram_id = Column(BigInteger, unique=True, nullable=False)
    username = Column(Text)
    first_name = Column(Text)
    last_name = Column(Text)
    language_code = Column(Text)
    has_access = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
