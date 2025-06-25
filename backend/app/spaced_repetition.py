from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user_phrase import UserPhrase

def get_next_interval_days(prev_days: int, rating: str) -> int:
    if rating == "forgot":
        return 1
    if rating == "hard":
        return max(1, int(prev_days * 1.2))
    if rating == "medium":
        return int(prev_days * 2)
    if rating == "easy":
        return int(prev_days * 3)
    return max(1, prev_days)

async def process_review(db: AsyncSession, user_id: int, phrase_id: int, rating: str):
    now = datetime.utcnow()

    result = await db.execute(select(UserPhrase).where(
        UserPhrase.user_id == user_id,
        UserPhrase.phrase_id == phrase_id
    ))
    entry = result.scalar_one_or_none()

    if entry:
        entry.repetition_count += 1
        entry.last_rating = rating
        entry.last_review_at = now
        entry.interval = get_next_interval_days(entry.interval or 1, rating)
        entry.next_review_at = now + timedelta(days=entry.interval)
    else:
        interval = get_next_interval_days(1, rating)
        entry = UserPhrase(
            user_id=user_id,
            phrase_id=phrase_id,
            repetition_count=1,
            last_rating=rating,
            last_review_at=now,
            interval=interval,
            next_review_at=now + timedelta(days=interval)
        )
        db.add(entry)

    await db.commit()
    return entry.next_review_at.isoformat()
