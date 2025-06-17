# backend/app/database.py

import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config import settings

# Базовый класс для моделей
class Base(DeclarativeBase):
    pass

# Движок и сессия только если используем asyncpg
# Это защищает Alembic от падения при sync-режиме
if settings.DATABASE_URL.startswith("postgresql+asyncpg"):
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    SessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)
else:
    engine = None
    SessionLocal = None

# Импорты для регистрации моделей в metadata (важно для Alembic)
from app.models import user, dialog, phrase, user_phrase, phrase_word, payment
