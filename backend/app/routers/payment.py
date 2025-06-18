from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import SessionLocal
from app.schemas.user import UserOut
from app.schemas.payment import PaymentCreateRequest, PaymentCreateResponse, PaymentStatusResponse
from app.deps import get_current_user
from app.crud import payment as payment_crud

router = APIRouter(prefix="/api/payments", tags=["payments"])

async def get_db():
    async with SessionLocal() as session:
        yield session

# POST /api/payments/create
@router.post("/create", response_model=PaymentCreateResponse)
async def create_payment(
    payload: PaymentCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    url = await payment_crud.create_payment(db, user_id=current_user.id, provider=payload.provider)
    return {"payment_url": url}

# GET /api/payments/status
@router.get("/status", response_model=PaymentStatusResponse)
async def get_payment_status(
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    payment = await payment_crud.get_latest_payment(db, user_id=current_user.id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    unlocked = payment.status == "success"
    return {"status": payment.status, "unlocked": unlocked}
