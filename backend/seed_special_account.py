import os
import sys
import uuid
from sqlalchemy.orm import Session

# Add the project root to sys.path to import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend import models, schemas, auth
from backend.database import SessionLocal
from backend.crud import get_user_by_email, create_user

def seed_special_account():
    db = SessionLocal()
    try:
        special_email = "2022ad0128@svce.ac.in"
        existing_user = get_user_by_email(db, special_email)

        if existing_user:
            print(f"User with email {special_email} already exists. Updating to Super Admin.")
            existing_user.role = "super_admin"
            existing_user.is_approved = True
            existing_user.is_active = True
            db.commit()
            print("Successfully updated user to Super Admin.")
        else:
            print(f"Creating special account: {special_email}")
            user_create = schemas.UserCreate(
                username="special_admin",
                email=special_email,
                password="SpecialPassword123!",
                role="super_admin",
                first_name="Special",
                last_name="Account"
            )
            hashed_pw = auth.get_password_hash(user_create.password)
            db_user = models.User(
                id=str(uuid.uuid4()),
                username=user_create.username,
                email=user_create.email,
                hashed_password=hashed_pw,
                role=user_create.role,
                first_name=user_create.first_name,
                last_name=user_create.last_name,
                is_active=True,
                is_approved=True
            )
            db.add(db_user)
            db.commit()
            print("Special Admin created successfully!")
            print(f"Email: {special_email}")
            print("Password: SpecialPassword123!")
    
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_special_account()
