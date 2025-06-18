from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database import SessionLocal
from app.schemas.phrase import PhraseOut, ReviewRequest, ReviewResponse
from app.schemas.user import UserOut
from app.deps import get_current_user
from app.crud import phrase as phrase_crud
from app.spaced_repetition import process_review

router = APIRouter(prefix="/api/phrases", tags=["phrases"])

# Зависимость
async def get_db():
    async with SessionLocal() as session:
        yield session

# GET /api/phrases/today
@router.get("/today", response_model=List[PhraseOut])
async def get_phrases_to_review(
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    return await phrase_crud.get_phrases_for_review(db, current_user.id)

# POST /api/phrases/review
@router.post("/review", response_model=ReviewResponse)
async def review_phrase(
    review: ReviewRequest,
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    next_time = await process_review(
        db=db,
        user_id=current_user.id,
        phrase_id=review.phrase_id,
        rating=review.rating
    )
    return {"next_review_at": next_time}
