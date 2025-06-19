# backend/app/deps.py

from fastapi import Depends, Header, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import SessionLocal
from app.schemas.user import UserOut
from app.crud import user as user_crud
from app.utils.telegram import parse_init_data, check_telegram_signature

# ⚠️ Пока dev, эмуляция пользователя
FAKE_USER_ID = 123456789

BOT_TOKEN = "123:dummy"  # Подставим позже из .env

async def get_db():
    async with SessionLocal() as session:
        yield session

async def get_current_user(
    init_data: str = Header(default="", alias="X-Telegram-InitData"),
    db: AsyncSession = Depends(get_db),
) -> UserOut:
    # 🔧 Временно возвращаем пользователя напрямую
    user = await user_crud.get_by_telegram_id(db, telegram_id=FAKE_USER_ID)
    if not user:
        # {{
        from app.schemas.user import UserCreate
        user = await user_crud.create_user(db, UserCreate(
            telegram_id=FAKE_USER_ID,
            username="test",
            first_name="Test",
            last_name="",
            language_code="ua"
        ))
        #raise HTTPException(status_code=401, detail="User not found")
        # }}
    return UserOut.model_validate(user)

    # ✅ В боевом режиме — вот так:
    """
    if not check_telegram_signature(init_data, BOT_TOKEN):
        raise HTTPException(status_code=401, detail="Invalid Telegram signature")
    data = parse_init_data(init_data)
    telegram_id = int(data.get("user.id", "0"))
    if not telegram_id:
        raise HTTPException(status_code=401, detail="Missing telegram_id")

    user = await user_crud.get_by_telegram_id(db, telegram_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not registered")

    return UserOut.model_validate(user)
    """
