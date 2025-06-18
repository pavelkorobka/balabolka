# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import user, dialog, phrase, progress, payment

app = FastAPI(title="Balabolka API", version="1.0.0")

# Подключение всех роутеров
app.include_router(user.router)
app.include_router(dialog.router)
app.include_router(phrase.router)
app.include_router(progress.router)
app.include_router(payment.router)

# Разрешим CORS (при необходимости фронтенда)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # в проде указать только свой домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/healthcheck")
async def healthcheck():
    return {"status": "ok"}
