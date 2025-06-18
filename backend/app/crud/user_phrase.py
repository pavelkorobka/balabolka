from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.user_phrase import UserPhrase
from app.models.phrase_word import PhraseWord
from datetime import date

async def get_progress_summary(db: AsyncSession, user_id: int):
    phrases = await db.scalar(select(func.count()).select_from(UserPhrase).where(
        UserPhrase.user_id == user_id,
        UserPhrase.last_review_at.is_not(None)
    ))

    words = await db.scalar(
        select(func.count()).select_from(PhraseWord)
    )

    days = await db.execute(select(func.count(func.distinct(func.date(UserPhrase.last_review_at)))).where(
        UserPhrase.user_id == user_id
    ))
    return {
        "phrases_learned": phrases or 0,
        "words_known": words or 0,
        "active_days": days.scalar() or 0
    }
