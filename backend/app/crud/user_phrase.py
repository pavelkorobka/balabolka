from datetime import datetime, timedelta
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.user_phrase import UserPhrase
from app.models.phrase_word import PhraseWord

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


async def mark_phrase_as_learned(db: AsyncSession, user_id: int, phrase_id: int):
    from app.models.user_phrase import UserPhrase
    result = await db.execute(
        select(UserPhrase).where(
            UserPhrase.user_id == user_id,
            UserPhrase.phrase_id == phrase_id
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        return  # already marked as learned
    now = datetime.utcnow()
    entry = UserPhrase(
        user_id=user_id,
        phrase_id=phrase_id,
        interval=1,
        repetition_count=0,
        last_rating=None,
        last_review_at=None,
        next_review_at=now
    )
    db.add(entry)
    await db.commit()


async def get_learned_phrase_ids(db: AsyncSession, user_id: int, dialog_id: int):
    from app.models.user_phrase import UserPhrase
    from app.models.phrase import Phrase
    result = await db.execute(
        select(UserPhrase.phrase_id)
        .join(Phrase, UserPhrase.phrase_id == Phrase.id)
        .where(UserPhrase.user_id == user_id, Phrase.dialog_id == dialog_id)
    )
    rows = result.scalars().all()
    return set(rows)