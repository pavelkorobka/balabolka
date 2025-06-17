from pydantic import BaseModel
from typing import Optional

class PhraseOut(BaseModel):
    id: int
    order: int
    text_original: str
    text_translation: Optional[str]
    image_url: Optional[str]
    audio_url: Optional[str]

    class Config:
        from_attributes = True
