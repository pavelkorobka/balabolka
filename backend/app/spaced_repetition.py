from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user_phrase import UserPhrase

intervals = {
    "forgot": timedelta(minutes=1),
    "hard": timedelta(minutes=10),
    "medium": timedelta(days=1),
    "easy": timedelta(days=3)
}

async def process_review(db: AsyncSession, user_id: int, phrase_id: int, rating: str):
    now = datetime.utcnow()
    next_time = now + intervals.get(rating, timedelta(days=1))

    result = await db.execute(select(UserPhrase).where(
        UserPhrase.user_id == user_id,
        UserPhrase.phrase_id == phrase_id
    ))
    entry = result.scalar_one_or_none()

    if entry:
        entry.repetition_count += 1
        entry.last_rating = rating
        entry.last_review_at = now
        entry.next_review_at = next_time
    else:
        entry = UserPhrase(
            user_id=user_id,
            phrase_id=phrase_id,
            last_rating=rating,
            last_review_at=now,
            next_review_at=next_time,
            repetition_count=1
        )
        db.add(entry)

    await db.commit()
    return next_time.isoformat()
