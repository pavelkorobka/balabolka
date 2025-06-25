from sqlalchemy import Column, Integer, Text, ForeignKey, TIMESTAMP, UniqueConstraint
from app.database import Base

class UserPhrase(Base):
    __tablename__ = "user_phrases"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    phrase_id = Column(Integer, ForeignKey("phrases.id", ondelete="CASCADE"))
    interval = Column(Integer, default=1)
    next_review_at = Column(TIMESTAMP)
    repetition_count = Column(Integer, default=0)
    last_rating = Column(Text)
    last_review_at = Column(TIMESTAMP)

    __table_args__ = (UniqueConstraint("user_id", "phrase_id", name="_user_phrase_uc"),)
