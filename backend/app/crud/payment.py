from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.payment import Payment

async def create_payment(db: AsyncSession, user_id: int, provider: str):
    url = f"https://t.me/your_bot?start=pay_{user_id}"  # Мокаем
    payment = Payment(
        user_id=user_id,
        amount=10.00,
        status="pending",
        payment_provider=provider
    )
    db.add(payment)
    await db.commit()
    return url

async def get_latest_payment(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(Payment).where(Payment.user_id == user_id).order_by(desc(Payment.created_at)).limit(1)
    )
    return result.scalar_one_or_none()
