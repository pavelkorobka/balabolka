from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.dialog import Dialog
from app.models.phrase import Phrase
from app.models.user_phrase import UserPhrase
from app.schemas.dialog import DialogOut

async def get_all_dialogs(db: AsyncSession, user_id: int):
    dialogs = (await db.execute(select(Dialog))).scalars().all()
    result = []

    for dialog in dialogs:
        total = await db.scalar(select(func.count()).select_from(Phrase).where(Phrase.dialog_id == dialog.id))
        passed = await db.scalar(select(func.count()).select_from(UserPhrase).join(Phrase).where(
            UserPhrase.user_id == user_id,
            Phrase.dialog_id == dialog.id
        ))
        is_unlocked = dialog.is_free or await db.scalar(
            select(func.count()).select_from(UserPhrase).where(UserPhrase.user_id == user_id)
        ) > 0

        result.append(DialogOut(
            id=dialog.id,
            title=dialog.title,
            description=dialog.description,
            is_free=dialog.is_free,
            video_url=dialog.video_url,
            is_unlocked=is_unlocked,
            progress={"passed": passed or 0, "total": total or 0}
        ))
    return result

async def get_dialog_with_phrases(db: AsyncSession, dialog_id: int, user_id: int):
    dialog = await db.get(Dialog, dialog_id)
    if not dialog:
        return None

    phrases = (await db.execute(
        select(Phrase).where(Phrase.dialog_id == dialog_id).order_by(Phrase.order)
    )).scalars().all()

    out = DialogOut(
        id=dialog.id,
        title=dialog.title,
        description=dialog.description,
        is_free=dialog.is_free,
        video_url=dialog.video_url,
        is_unlocked=True,
        progress=None
    )
    out.phrases = phrases  # ручное присвоение, поле не в схеме, но фронту нужно
    return out

async def get_dialog_video_url(db: AsyncSession, dialog_id: int):
    dialog = await db.get(Dialog, dialog_id)
    return dialog.video_url if dialog else None
