from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

async def get_by_telegram_id(db: AsyncSession, telegram_id: int):
    res = await db.execute(select(User).where(User.telegram_id == telegram_id))
    return res.scalar_one_or_none()

async def create_user(db: AsyncSession, data: UserCreate):
    user = User(**data.model_dump())
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

async def update_user(db: AsyncSession, user_id: int, data: UserUpdate):
    await db.execute(update(User).where(User.id == user_id).values(**data.model_dump(exclude_unset=True)))
    await db.commit()
