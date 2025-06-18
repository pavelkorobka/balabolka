from pydantic import BaseModel

class PaymentCreateRequest(BaseModel):
    provider: str  # 'telegram'

class PaymentCreateResponse(BaseModel):
    payment_url: str

class PaymentStatusResponse(BaseModel):
    status: str  # 'pending' | 'success' | 'failed'
    unlocked: bool
