from pydantic import BaseModel
from typing import Optional, List
from app.schemas.phrase import PhraseOut

class DialogBase(BaseModel):
    id: int
    title: str
    description: Optional[str]
    is_free: bool
    video_url: Optional[str]
    is_unlocked: Optional[bool]
    progress: Optional[dict]

    class Config:
        from_attributes = True

class DialogOutList(DialogBase):
    pass  # без phrases

class DialogOutDetail(DialogBase):
    phrases: List[PhraseOut]
