from pydantic import BaseModel
from typing import Optional

class PhraseOut(BaseModel):
    id: int
    order: int
    text_original: str
    text_translation_ru: Optional[str]
    text_translation_ua: Optional[str]
    image_url: Optional[str]
    audio_url: Optional[str]

    class Config:
        from_attributes = True

class ReviewRequest(BaseModel):
    phrase_id: int
    rating: str  # 'forgot', 'hard', 'medium', 'easy'

class ReviewResponse(BaseModel):
    next_review_at: Optional[str]
