from sqlalchemy import func, Column, Integer, Text, Boolean, TIMESTAMP
from app.database import Base

class Dialog(Base):
    __tablename__ = "dialogs"

    id = Column(Integer, primary_key=True)
    title = Column(Text, nullable=False)
    description = Column(Text)
    is_free = Column(Boolean, default=False)
    video_url = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
