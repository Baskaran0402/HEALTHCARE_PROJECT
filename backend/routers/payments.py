from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend import crud, models, schemas
from backend.database import get_db

router = APIRouter(prefix="/api/payments", tags=["Payments"])


@router.post("/process", response_model=schemas.PaymentResponse)
def process_payment(payment: schemas.PaymentBase, db: Session = Depends(get_db)):
    # 1. Mock Gateway logic (Razorpay/Stripe)
    # real_transaction_id = gateway.process(payment.amount, payment.currency)
    import uuid

    transaction_id = f"tx_{uuid.uuid4().hex[:12]}"

    # 2. Save Payment record
    payment_create = schemas.PaymentCreate(**payment.model_dump(), transaction_id=transaction_id)

    return crud.create_payment(db, payment_create)


@router.get("/history/{consultation_id}", response_model=schemas.PaymentResponse)
def get_payment_status(consultation_id: str, db: Session = Depends(get_db)):
    payment = db.query(models.Payment).filter(models.Payment.consultation_id == consultation_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="No payment record found")
    return payment
