from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import SessionLocal
from app.schemas.user import UserCreate, UserOut, UserUpdate
from app.crud import user as user_crud
from app.deps import get_current_user  # извлекает пользователя из initData

router = APIRouter(prefix="/api/user", tags=["user"])

# Зависимость для получения сессии
async def get_db():
    async with SessionLocal() as session:
        yield session

# POST /api/user/create
@router.post("/create", response_model=UserOut)
async def create_user(data: UserCreate, db: AsyncSession = Depends(get_db)):
    existing = await user_crud.get_by_telegram_id(db, data.telegram_id)
    if existing:
        return existing
    return await user_crud.create_user(db, data)

# GET /api/user/me
@router.get("/me", response_model=UserOut)
async def get_me(current_user: UserOut = Depends(get_current_user)):
    return current_user

# PUT /api/user/update
@router.put("/update")
async def update_user(
    data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    await user_crud.update_user(db, current_user.id, data)
    return {"success": True}
