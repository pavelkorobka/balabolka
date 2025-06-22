from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.models.dialog import Dialog
from app.models.phrase import Phrase
from app.models.phrase_word import PhraseWord
from app.schemas.dialog_upload import DialogUpload
from app.utils.text import tokenize

async def upload_dialog(db: AsyncSession, payload: DialogUpload):
    existing_dialog = await db.execute(select(Dialog).where(Dialog.title == payload.title))
    existing_dialog = existing_dialog.scalar_one_or_none()
    if existing_dialog:
        await db.delete(existing_dialog)
        await db.execute(
            delete(PhraseWord).where(
                PhraseWord.phrase_id.in_(
                    select(Phrase.id).where(Phrase.dialog_id == existing_dialog.id)
                )
            )
        )
        await db.execute(delete(Phrase).where(Phrase.dialog_id == existing_dialog.id))
        await db.flush()

    dialog = Dialog(
        title=payload.title,
        description=payload.description,
        is_free=payload.is_free,
        video_url=payload.video_url
    )
    db.add(dialog)
    await db.flush()  # получить dialog.id

    for phrase_data in payload.phrases:
        phrase = Phrase(
            dialog_id=dialog.id,
            order=phrase_data.order,
            text_original=phrase_data.text_original,
            text_translation_ru=phrase_data.text_translation_ru,
            text_translation_ua=phrase_data.text_translation_ua,
            image_url=phrase_data.image_url,
            audio_url=phrase_data.audio_url
        )
        db.add(phrase)
        await db.flush()

        for word in tokenize(phrase_data.text_original):
            db.add(PhraseWord(phrase_id=phrase.id, word=word))

    await db.commit()
    return dialog.id
