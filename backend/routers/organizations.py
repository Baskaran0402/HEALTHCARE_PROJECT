from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend import auth, crud, models, schemas
from backend.database import get_db

router = APIRouter(prefix="/api/organizations", tags=["Organizations"])


@router.post("/register", response_model=schemas.OrganizationResponse)
def register_organization(org: schemas.OrganizationCreate, db: Session = Depends(get_db)):
    db_org = crud.get_organization_by_domain(db, domain=org.email_domain)
    if db_org:
        raise HTTPException(status_code=400, detail="Domain already registered to another organization")
    return crud.create_organization(db=db, org=org)


@router.get("/{org_id}", response_model=schemas.OrganizationResponse)
def get_organization(org_id: str, db: Session = Depends(get_db)):
    org = crud.get_organization(db, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org


@router.get("/{org_id}/users", response_model=List[schemas.UserResponse])
def get_organization_users(
    org_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.check_role(["org_admin", "super_admin"])),
):
    # Verify the admin belongs to this org unless super_admin
    if current_user.role != "super_admin" and current_user.organization_id != org_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this organization's users")

    return db.query(models.User).filter(models.User.organization_id == org_id).all()


@router.put("/approve-user/{user_id}", response_model=schemas.UserResponse)
def approve_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.check_role(["org_admin", "super_admin"])),
):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if current_user.role != "super_admin" and current_user.organization_id != user.organization_id:
        raise HTTPException(status_code=403, detail="Not authorized to approve users from another organization")

    user.is_approved = True
    user.approved_by = current_user.id
    from datetime import datetime

    user.approved_at = datetime.utcnow()
    db.commit()
    db.refresh(user)
    return user
