from pydantic import BaseModel
from typing import List, Optional

class PhraseUpload(BaseModel):
    order: int
    text_original: str
    text_translation_ru: Optional[str]
    text_translation_ua: Optional[str]
    image_url: Optional[str]
    audio_url: Optional[str]

class DialogUpload(BaseModel):
    dialog_code: str
    title: str
    description: Optional[str]
    is_free: bool
    video_url: Optional[str]
    phrases: List[PhraseUpload]
