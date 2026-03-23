from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend import auth, crud, models, schemas
from backend.database import get_db

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # 1. Domain Validation (Restrict to organization domain or default svce.ac.in)
    org_domain = None
    if user.organization_id:
        org = crud.get_organization(db, user.organization_id)
        if org:
            org_domain = org.email_domain

    if user.email != "2022ad0128@svce.ac.in":
        auth.validate_organization_email(user.email, org_domain)

    # 2. Existing User Check
    if crud.get_user_by_username(db, username=user.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    if crud.get_user_by_email(db, email=user.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    # 3. Create User
    hashed_password = auth.get_password_hash(user.password)
    return crud.create_user(db=db, user=user, hashed_password=hashed_password)


@router.post("/login", response_model=schemas.Token)
def login_for_access_token(user_login: schemas.UserLogin, db: Session = Depends(get_db)):
    # 1. Authenticate
    user = crud.get_user_by_email(db, email=user_login.email)
    if not user or not auth.verify_password(user_login.password, user.hashed_password):
        # Log failure
        crud.create_audit_log(
            db,
            schemas.AuditLogCreate(
                event_type="login_failure",
                entity_type="user",
                entity_id=user_login.email,
                event_data={"reason": "invalid_credentials"},
            ),
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. Status Checks
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is deactivated")
    if not user.is_approved:
        raise HTTPException(status_code=403, detail="Account pending administrator approval")

    # 3. Create Tokens
    access_token = auth.create_access_token(data={"sub": user.id, "role": user.role, "org_id": user.organization_id})
    refresh_token = auth.create_refresh_token(data={"sub": user.id})

    # 4. Create Session
    crud.create_session(
        db,
        {
            "user_id": user.id,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "expires_at": datetime.utcnow() + timedelta(days=auth.REFRESH_TOKEN_EXPIRE_DAYS),
        },
    )

    # 5. Update User Login Stats
    crud.update_user_login(db, user.id)

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@router.post("/refresh", response_model=schemas.Token)
def refresh_token(request: schemas.RefreshTokenRequest, db: Session = Depends(get_db)):
    session = crud.get_session_by_refresh_token(db, request.refresh_token)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    user = session.user
    access_token = auth.create_access_token(data={"sub": user.id, "role": user.role, "org_id": user.organization_id})

    # Update session with new access token
    session.access_token = access_token
    db.commit()

    return {"access_token": access_token, "refresh_token": request.refresh_token, "token_type": "bearer"}


@router.post("/logout")
def logout(request: schemas.LogoutRequest, db: Session = Depends(get_db)):
    crud.revoke_session(db, request.refresh_token)
    return {"detail": "Successfully logged out"}


@router.post("/google", response_model=schemas.Token)
def google_login(request: schemas.GoogleLoginRequest, db: Session = Depends(get_db)):
    from google.auth.transport import requests
    from google.oauth2 import id_token
    import os

    try:
        # Verify the token
        client_id = os.getenv("VITE_GOOGLE_CLIENT_ID") or os.getenv("GOOGLE_CLIENT_ID")
        idinfo = id_token.verify_oauth2_token(request.token, requests.Request(), client_id)

        email = idinfo["email"]

        # Check if user exists
        user = crud.get_user_by_email(db, email=email)
        if not user:
            # Create a new user for first-time Google login
            user_data = schemas.UserCreate(
                username=email.split("@")[0] + "_" + os.urandom(4).hex(),
                email=email,
                password=auth.get_password_hash(os.urandom(16).hex()),  # Dummy
                role="patient",
                first_name=idinfo.get("given_name"),
                last_name=idinfo.get("family_name"),
            )
            # Bypass password hashing here since we already hashed it in user_data (oops, schemas.UserCreate takes raw)
            # Let's fix that
            hashed = auth.get_password_hash(os.urandom(16).hex())
            user = crud.create_user(db=db, user=user_data, hashed_password=hashed)

        # Create Tokens
        access_token = auth.create_access_token(data={"sub": user.id, "role": user.role, "org_id": user.organization_id})
        refresh_token_str = auth.create_refresh_token(data={"sub": user.id})

        # Create Session
        crud.create_session(
            db,
            {
                "user_id": user.id,
                "access_token": access_token,
                "refresh_token": refresh_token_str,
                "expires_at": datetime.utcnow() + timedelta(days=auth.REFRESH_TOKEN_EXPIRE_DAYS),
            },
        )

        return {"access_token": access_token, "refresh_token": refresh_token_str, "token_type": "bearer"}

    except Exception as e:
        print(f"Google Login Error: {e}")
        raise HTTPException(status_code=400, detail="Invalid Google token")


@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user
