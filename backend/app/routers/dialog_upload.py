from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import SessionLocal
from app.schemas.dialog_upload import DialogUpload
from app.crud.dialog_upload import upload_dialog

router = APIRouter(prefix="/api/dialogs", tags=["dialog-upload"])

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.post("/upload")
async def upload_dialog_endpoint(payload: DialogUpload, db: AsyncSession = Depends(get_db)):
    dialog_id = await upload_dialog(db, payload)
    if dialog_id is None:
        raise HTTPException(status_code=409, detail="Dialog already exists")
    return {"success": True, "dialog_id": dialog_id}
