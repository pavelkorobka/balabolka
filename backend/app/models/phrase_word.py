from sqlalchemy import Column, Integer, Text, ForeignKey, Index
from app.database import Base

class PhraseWord(Base):
    __tablename__ = "phrase_words"

    id = Column(Integer, primary_key=True)
    phrase_id = Column(Integer, ForeignKey("phrases.id", ondelete="CASCADE"))
    word = Column(Text)

    __table_args__ = (Index("idx_phrase_words_word", "word"),)
