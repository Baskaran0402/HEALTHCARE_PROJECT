from datetime import datetime
from fastapi import APIRouter, HTTPException
from backend import schemas
from src.agents.kira_agent import KiraAgent
import logging

router = APIRouter(prefix="/api/chat", tags=["Kira Chat"])
agent = KiraAgent()
appointments_db = [] # Simple in-memory storage for MVP

@router.post("/", response_model=schemas.ChatResponse)
async def chat_with_kira(request: schemas.ChatRequest):
    try:
        response_text = agent.chat(request.message, request.history)
        return schemas.ChatResponse(response=response_text)
    except Exception as e:
        logging.error(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/appointments", response_model=schemas.AppointmentResponse)
async def book_appointment(appointment: schemas.AppointmentCreate):
    # Mock booking
    new_app = appointment.dict()
    new_app["id"] = len(appointments_db) + 1
    new_app["created_at"] = datetime.now()
    appointments_db.append(new_app)
    return new_app
