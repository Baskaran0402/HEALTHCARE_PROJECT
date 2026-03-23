from backend.database import SessionLocal
from backend.models import User, UserSession
import sys

def purge_user(email):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"Purging user: {user.email}")
            # Sessions are cascade deleted usually, but let's be safe
            db.query(UserSession).filter(UserSession.user_id == user.id).delete()
            db.delete(user)
            db.commit()
            print("Successfully purged user.")
        else:
            print("User not found.")
    except Exception as e:
        print(f"Error purging user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    purge_user("2022ad0128@svce.ac.in")
