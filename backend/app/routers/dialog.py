from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database import SessionLocal
from app.schemas.dialog import DialogOutDetail, DialogOutList
from app.schemas.phrase import PhraseOut
from app.crud import dialog as dialog_crud
from app.crud import phrase as phrase_crud
from app.deps import get_current_user
from app.schemas.user import UserOut

router = APIRouter(prefix="/api/dialogs", tags=["dialogs"])

# Зависимость на сессию
async def get_db():
    async with SessionLocal() as session:
        yield session

# GET /api/dialogs
@router.get("/", response_model=List[DialogOutList])
async def get_dialogs(
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    return await dialog_crud.get_all_dialogs(db, user_id=current_user.id)

# GET /api/dialogs/{dialog_id}
@router.get("/{dialog_id}", response_model=DialogOutDetail)
async def get_dialog_with_phrases(
    dialog_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    dialog = await dialog_crud.get_dialog_with_phrases(db, dialog_id, current_user.id)
    if not dialog:
        raise HTTPException(status_code=404, detail="Dialog not found")
    return dialog

# GET /api/dialogs/{dialog_id}/bonus
@router.get("/{dialog_id}/bonus")
async def get_dialog_bonus(
    dialog_id: int,
    db: AsyncSession = Depends(get_db)
):
    video_url = await dialog_crud.get_dialog_video_url(db, dialog_id)
    if not video_url:
        raise HTTPException(status_code=404, detail="Dialog not found")
    return {"video_url": video_url}
