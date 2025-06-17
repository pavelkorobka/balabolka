from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    username: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    language_code: Optional[str]

class UserCreate(UserBase):
    telegram_id: int
    language_code: str

class UserUpdate(UserBase):
    language_code: Optional[str]

class UserOut(UserBase):
    id: int
    telegram_id: int
    has_access: bool

    class Config:
        from_attributes = True
