from sqlalchemy import Column, Integer, Text, ForeignKey
from app.database import Base

class Phrase(Base):
    __tablename__ = "phrases"

    id = Column(Integer, primary_key=True)
    dialog_id = Column(Integer, ForeignKey("dialogs.id", ondelete="CASCADE"))
    order = Column(Integer, nullable=False)
    text_original = Column(Text, nullable=False)
    text_translation_ru = Column(Text)
    text_translation_ua = Column(Text)
    image_url = Column(Text)
    audio_url = Column(Text)
