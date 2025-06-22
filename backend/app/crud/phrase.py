from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.user_phrase import UserPhrase
from app.models.phrase import Phrase
from app.schemas.phrase import PhraseOut

async def get_phrases_for_review(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(Phrase)
        .join(UserPhrase, UserPhrase.phrase_id == Phrase.id)
        .where(UserPhrase.user_id == user_id)
        .where(UserPhrase.next_review_at <= func.now())
        .order_by(UserPhrase.next_review_at)
    )
    return result.scalars().all()
