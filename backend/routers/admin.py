from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from backend import crud, schemas, auth, models
from backend.database import get_db

router = APIRouter(prefix="/api/admin", tags=["Governance"])

@router.get("/users", response_model=List[schemas.UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.check_role(["super_admin"]))
):
    return db.query(models.User).all()

@router.get("/users/pending", response_model=List[schemas.UserResponse])
def get_pending_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.check_role(["super_admin"]))
):
    return db.query(models.User).filter(models.User.is_approved == False).all()

@router.put("/users/{user_id}/approve", response_model=schemas.UserResponse)
def approve_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.check_role(["super_admin"]))
):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_approved = True
    user.approved_by = current_user.id
    user.approved_at = datetime.utcnow()
    db.commit()
    db.refresh(user)
    return user

@router.put("/users/{user_id}/reject", response_model=schemas.UserResponse)
def reject_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.check_role(["super_admin"]))
):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = False
    db.commit()
    db.refresh(user)
    return user

@router.get("/organizations", response_model=List[schemas.OrganizationResponse])
def get_all_organizations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.check_role(["super_admin"]))
):
    return db.query(models.Organization).all()

@router.get("/system-stats")
def get_system_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.check_role(["super_admin"]))
):
    total_users = db.query(models.User).count()
    active_sessions = db.query(models.UserSession).filter(models.UserSession.is_active == True).count()
    verified_doctors = db.query(models.Doctor).filter(models.Doctor.is_verified == True).count()
    total_orgs = db.query(models.Organization).count()
    
    return {
        "totalUsers": total_users,
        "activePatients": active_sessions, # Using active sessions as a proxy for 'active'
        "verifiedDoctors": verified_doctors,
        "orgs": total_orgs
    }
