import os
import sys

# Add the project root to sys.path to import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend import schemas  # noqa: E402
from backend.auth import get_password_hash  # noqa: E402
from backend.crud import create_user, get_user_by_email  # noqa: E402
from backend.database import SessionLocal  # noqa: E402


def create_super_admin():
    db = SessionLocal()
    try:
        admin_email = "admin@svce.ac.in"
        existing_user = get_user_by_email(db, admin_email)

        if existing_user:
            print(f"User with email {admin_email} already exists.")
            # Ensure it's approved and has the right role
            existing_user.is_approved = True
            existing_user.role = "super_admin"
            db.commit()
            print("Successfully updated existing user to Super Admin and approved.")
            return

        admin_user = schemas.UserCreate(
            username="admin",
            email=admin_email,
            password="AdminPassword123!",
            role="super_admin",
            first_name="System",
            last_name="Administrator",
        )

        hashed_pw = get_password_hash(admin_user.password)
        db_user = create_user(db, admin_user, hashed_pw)

        # Manually approve the admin
        db_user.is_approved = True
        db.commit()

        print("Super Admin created successfully!")
        print(f"Email: {admin_email}")
        print("Password: AdminPassword123!")

    finally:
        db.close()


if __name__ == "__main__":
    create_super_admin()
