from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import SessionLocal
from app.schemas.user import UserOut
from app.schemas.progress import ProgressSummary
from app.deps import get_current_user
from app.crud import user_phrase as user_phrase_crud

router = APIRouter(prefix="/api/progress", tags=["progress"])

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.get("/summary", response_model=ProgressSummary)
async def get_progress_summary(
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    return await user_phrase_crud.get_progress_summary(db, current_user.id)
