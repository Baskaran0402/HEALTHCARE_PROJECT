import uuid

from backend import models
from backend.database import SessionLocal


def seed_doctors():
    db = SessionLocal()
    try:
        # Check if we already have doctors
        if db.query(models.Doctor).count() > 0:
            print("Doctors already seeded.")
            return

        # Create a dummy user for doctors
        user_id = str(uuid.uuid4())
        user = models.User(
            id=user_id, username="doc_seed", email="seed@medical.com", hashed_password="dummy", role="doctor"
        )
        db.add(user)
        db.commit()

        # Mock Doctors around Bangalore for testing
        doctors = [
            {
                "name": "Arjun Reddy",
                "email": "arjun@apollo.com",
                "medical_license_number": "MED12345",
                "specialization": "Cardiologist",
                "latitude": 12.9716,
                "longitude": 77.5946,
                "address": "Apollo Hospitals, Bannerghatta Road",
                "hospital_affiliation": "Apollo Hospitals",
                "consultation_fee": 50.0,
                "is_verified": True,
                "is_available": True,
                "user_id": user_id,
            },
            {
                "name": "Sarah Williams",
                "email": "sarah@manipal.com",
                "medical_license_number": "MED67890",
                "specialization": "Neurologist",
                "latitude": 12.9592,
                "longitude": 77.6444,
                "address": "Manipal Hospital, HAL Road",
                "hospital_affiliation": "Manipal Hospital",
                "consultation_fee": 65.0,
                "is_verified": True,
                "is_available": True,
                "user_id": user_id,
            },
            {
                "name": "Priya Sharma",
                "email": "priya@fortis.com",
                "medical_license_number": "MED54321",
                "specialization": "Endocrinologist",
                "latitude": 12.9081,
                "longitude": 77.5904,
                "address": "Fortis Hospital, Jayanagar",
                "hospital_affiliation": "Fortis Hospital",
                "consultation_fee": 45.0,
                "is_verified": True,
                "is_available": True,
                "user_id": user_id,
            },
        ]

        for dr_data in doctors:
            dr = models.Doctor(**dr_data)
            db.add(dr)

        db.commit()
        print(f"[SUCCESS] Seeded {len(doctors)} mock doctors with geolocation.")

    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_doctors()
