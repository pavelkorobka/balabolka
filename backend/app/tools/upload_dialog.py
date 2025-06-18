import sys
import json
import asyncio
import re

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import SessionLocal
from app.models.dialog import Dialog
from app.models.phrase import Phrase
from app.models.phrase_word import PhraseWord

from app.database import engine
from app.models import dialog, phrase, phrase_word  # регистрируем Base.metadata

def tokenize(text: str):
    return re.findall(r'\b\w+\b', text.lower())

async def upload_dialog(json_path: str):
    # Чтение JSON
    with open(json_path, encoding="utf-8") as f:
        data = json.load(f)

    dialog_code = data["dialog_code"]
    title = data["title"]
    description = data.get("description")
    is_free = data.get("is_free", False)
    video_url = data.get("video_url")
    phrases_data = data["phrases"]

    async with SessionLocal() as db:
        # Проверка — есть ли уже диалог с таким title
        existing = await db.execute(select(Dialog).where(Dialog.title == title))
        if existing.scalar():
            print(f'⚠️ Диалог "{title}" уже существует в базе.')
            return

        # Создание Dialog
        new_dialog = Dialog(
            title=title,
            description=description,
            is_free=is_free,
            video_url=video_url
        )
        db.add(new_dialog)
        await db.flush()  # Получим new_dialog.id

        phrase_count = 0
        word_set = set()

        for item in phrases_data:
            phrase = Phrase(
                dialog_id=new_dialog.id,
                order=item["order"],
                text_original=item["text_original"],
                text_translation_ru=item.get("text_translation_ru"),
                text_translation_ua=item.get("text_translation_ua"),
                image_url=item.get("image_url"),
                audio_url=item.get("audio_url"),
            )
            db.add(phrase)
            await db.flush()  # Получим phrase.id

            # Токенизация
            words = tokenize(item["text_original"])
            for word in words:
                if word not in word_set:
                    word_set.add(word)
                    db.add(PhraseWord(phrase_id=phrase.id, word=word))

            phrase_count += 1

        await db.commit()

        print(f'✅ Диалог "{title}" добавлен. Добавлено {phrase_count} фразы, {len(word_set)} слов.')

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ Укажите путь к JSON-файлу: python upload_dialog.py backend/tools/dialog_upload.json")
        sys.exit(1)

    asyncio.run(upload_dialog(sys.argv[1]))
