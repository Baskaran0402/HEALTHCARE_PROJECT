import os
import sys
import uuid

try:
    # Relative imports — resolved by the IDE and when run as part of the package
    from . import auth, models, schemas
    from .crud import get_user_by_email
    from .database import SessionLocal
except ImportError:
    # Fallback for running as a standalone script:
    # python seed_special_account.py  (from the backend/ dir)
    # or:  python -m backend.seed_special_account  (from the project root)
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if project_root not in sys.path:
        sys.path.insert(0, project_root)
    from backend import auth, models, schemas  # type: ignore[import]  # noqa: E402
    from backend.crud import get_user_by_email  # type: ignore[import]  # noqa: E402
    from backend.database import SessionLocal  # type: ignore[import]  # noqa: E402


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
                last_name="Account",
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
                is_approved=True,
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
