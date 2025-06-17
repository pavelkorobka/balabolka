import os
from logging.config import fileConfig
from pathlib import Path
from dotenv import load_dotenv

from sqlalchemy import create_engine, pool
from alembic import context

# --- Загрузка переменных из .env ---
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# --- Alembic Config ---
config = context.config
fileConfig(config.config_file_name)
config.set_main_option("sqlalchemy.url", SQLALCHEMY_DATABASE_URL)

# --- Импорт моделей и metadata ---
from app.database import Base
from app.models import user, dialog, phrase, user_phrase, phrase_word, payment

target_metadata = Base.metadata

# --- Offline mode ---
def run_migrations_offline():
    context.configure(
        url=SQLALCHEMY_DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

# --- Online mode ---
def run_migrations_online():
    connectable = create_engine(SQLALCHEMY_DATABASE_URL, poolclass=pool.NullPool)

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()

# --- Запуск в зависимости от режима ---
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
