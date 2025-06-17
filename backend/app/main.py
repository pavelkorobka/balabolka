# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Balabolka API", version="1.0.0")

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
