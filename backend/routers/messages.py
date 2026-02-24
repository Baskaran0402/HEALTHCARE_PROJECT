from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend import crud, schemas, auth, models
from backend.database import get_db

router = APIRouter(prefix="/api/messages", tags=["Messaging"])


@router.post("/send", response_model=schemas.MessageResponse)
def send_message(
    message: schemas.MessageCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Verify sender_id matches current_user
    # ...
    return crud.create_message(db=db, message=message)


@router.get("/consultation/{consultation_id}", response_model=List[schemas.MessageResponse])
def get_consultation_messages(consultation_id: str, db: Session = Depends(get_db)):
    return crud.get_consultation_messages(db, consultation_id=consultation_id)


@router.put("/{message_id}/mark-read", response_model=schemas.MessageResponse)
def mark_read(
    message_id: str, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    return crud.mark_message_as_read(db, message_id=message_id)
