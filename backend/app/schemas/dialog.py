from pydantic import BaseModel
from typing import Optional, List

class DialogOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    is_free: bool
    video_url: Optional[str]
    is_unlocked: Optional[bool] = None  # добавлено для фронта
    progress: Optional[dict] = None     # progress = {"passed": int, "total": int}

    class Config:
        from_attributes = True
