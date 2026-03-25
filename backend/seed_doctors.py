import uuid

from backend import models
from backend.database import SessionLocal


def seed_doctors():
    db = SessionLocal()
    try:
        import os
        if os.getenv("CLEAN_SEED") == "true":
            print("Cleaning existing doctors...")
            db.query(models.Doctor).delete()
            db.commit()

        # Check if we already have doctors
        if db.query(models.Doctor).count() > 0:
            print("Doctors already seeded.")
            return

        # Use existing user if present, else create
        existing_user = db.query(models.User).filter(models.User.email == "seed@medical.com").first()
        if existing_user:
            user_id = existing_user.id
        else:
            user_id = str(uuid.uuid4())
            user = models.User(
                id=user_id, username="doc_seed", email="seed@medical.com", hashed_password="dummy", role="doctor"
            )
            db.add(user)
            db.commit()

        # Mock Doctors covering all specializations the AI report can recommend
        doctors = [
            # ── Cardiology ────────────────────────────────────────────────
            {
                "name": "Arjun Reddy",
                "email": "arjun@apollo.com",
                "medical_license_number": "MED12345",
                "specialization": "Cardiology",
                "latitude": 12.9716, "longitude": 77.5946,
                "address": "Apollo Hospitals, Bannerghatta Road",
                "city": "Bangalore",
                "hospital_affiliation": "Apollo Hospitals",
                "years_of_experience": 12,
                "consultation_fee": 850.0,
                "bio": (
                    "Interventional cardiologist specialising in coronary artery disease "
                    "and heart failure management."
                ),
                "is_verified": True, "is_available": True, "user_id": user_id,
            },
            {
                "name": "Meena Krishnan",
                "email": "meena@narayana.com",
                "medical_license_number": "MED22201",
                "specialization": "Cardiology",
                "latitude": 12.8967, "longitude": 77.5870,
                "address": "Narayana Health, Bommasandra",
                "city": "Bangalore",
                "hospital_affiliation": "Narayana Health",
                "years_of_experience": 9,
                "consultation_fee": 700.0,
                "bio": "Expert in echocardiography, hypertension management, and preventive cardiology.",
                "is_verified": True, "is_available": True, "user_id": user_id,
            },

            # ── Neurology ────────────────────────────────────────────────
            {
                "name": "Sarah Williams",
                "email": "sarah@manipal.com",
                "medical_license_number": "MED67890",
                "specialization": "Neurology",
                "latitude": 12.9592, "longitude": 77.6444,
                "address": "Manipal Hospital, HAL Road",
                "city": "Bangalore",
                "hospital_affiliation": "Manipal Hospital",
                "years_of_experience": 14,
                "consultation_fee": 1200.0,
                "bio": "Neurologist with expertise in stroke care, epilepsy, and neurodegenerative disorders.",
                "is_verified": True, "is_available": True, "user_id": user_id,
            },
            {
                "name": "Vikram Seth",
                "email": "vikram@aims.com",
                "medical_license_number": "MED77777",
                "specialization": "Neurology",
                "latitude": 13.0285, "longitude": 77.5891,
                "address": "AIMS, Hebbal",
                "city": "Bangalore",
                "hospital_affiliation": "AIMS",
                "years_of_experience": 11,
                "consultation_fee": 1500.0,
                "bio": "Specialist in brain tumour evaluation, neuro-imaging interpretation, and cognitive disorders.",
                "is_verified": True, "is_available": True, "user_id": user_id,
            },

            # ── Endocrinology ────────────────────────────────────────────
            {
                "name": "Deepa Nair",
                "email": "deepa@endocare.com",
                "medical_license_number": "MED30001",
                "specialization": "Endocrinology",
                "latitude": 12.9352, "longitude": 77.6245,
                "address": "BGS Gleneagles, Kengeri",
                "city": "Bangalore",
                "hospital_affiliation": "BGS Gleneagles",
                "years_of_experience": 10,
                "consultation_fee": 900.0,
                "bio": "Endocrinologist focused on diabetes management, thyroid disorders, and hormonal imbalances.",
                "is_verified": True, "is_available": True, "user_id": user_id,
            },
            {
                "name": "Rajan Pillai",
                "email": "rajan@diabetes.com",
                "medical_license_number": "MED30002",
                "specialization": "Endocrinology",
                "latitude": 12.9850, "longitude": 77.7080,
                "address": "Columbia Asia, Whitefield",
                "city": "Bangalore",
                "hospital_affiliation": "Columbia Asia",
                "years_of_experience": 8,
                "consultation_fee": 800.0,
                "bio": "Expert in Type-1 / Type-2 diabetes, insulin pump therapy, and metabolic syndrome.",
                "is_verified": True, "is_available": True, "user_id": user_id,
            },

            # ── Nephrology ────────────────────────────────────────────────
            {
                "name": "Suresh Babu",
                "email": "suresh@kidney.com",
                "medical_license_number": "MED40001",
                "specialization": "Nephrology",
                "latitude": 13.0100, "longitude": 77.5500,
                "address": "Sakra World Hospital, Marathahalli",
                "city": "Bangalore",
                "hospital_affiliation": "Sakra World Hospital",
                "years_of_experience": 13,
                "consultation_fee": 1100.0,
                "bio": (
                    "Nephrologist with specialisation in chronic kidney disease, "
                    "dialysis, and renal transplantation."
                ),
                "is_verified": True, "is_available": True, "user_id": user_id,
            },
            {
                "name": "Kavitha Rangan",
                "email": "kavitha@renal.com",
                "medical_license_number": "MED40002",
                "specialization": "Nephrology",
                "latitude": 12.9550, "longitude": 77.7100,
                "address": "Rainbow Hospital, Marathahalli",
                "city": "Bangalore",
                "hospital_affiliation": "Rainbow Hospital",
                "years_of_experience": 7,
                "consultation_fee": 950.0,
                "bio": "Specialist in acute kidney injury, glomerular diseases, and hypertensive nephropathy.",
                "is_verified": True, "is_available": True, "user_id": user_id,
            },

            # ── Gastroenterology ─────────────────────────────────────────
            {
                "name": "Hari Mohan",
                "email": "hari@gastro.com",
                "medical_license_number": "MED50001",
                "specialization": "Gastroenterology",
                "latitude": 12.9760, "longitude": 77.5710,
                "address": "Bowring Hospital, Shivajinagar",
                "city": "Bangalore",
                "hospital_affiliation": "Bowring Hospital",
                "years_of_experience": 15,
                "consultation_fee": 1050.0,
                "bio": "Gastroenterologist with expertise in liver diseases, GI endoscopy, and hepatitis management.",
                "is_verified": True, "is_available": True, "user_id": user_id,
            },

            # ── Pulmonology ───────────────────────────────────────────────
            {
                "name": "Leena Joshi",
                "email": "leena@lung.com",
                "medical_license_number": "MED60001",
                "specialization": "Pulmonology",
                "latitude": 12.9410, "longitude": 77.5660,
                "address": "Fortis Hospital, Cunningham Road",
                "city": "Bangalore",
                "hospital_affiliation": "Fortis Hospital",
                "years_of_experience": 9,
                "consultation_fee": 900.0,
                "bio": "Pulmonologist specialising in COPD, asthma, sleep apnea, and interstitial lung diseases.",
                "is_verified": True, "is_available": True, "user_id": user_id,
            },

            # ── Oncology ─────────────────────────────────────────────────
            {
                "name": "Priya Sharma",
                "email": "priya@fortis.com",
                "medical_license_number": "MED54321",
                "specialization": "Oncology",
                "latitude": 12.9081, "longitude": 77.5904,
                "address": "Fortis Hospital, Jayanagar",
                "city": "Bangalore",
                "hospital_affiliation": "Fortis Hospital",
                "years_of_experience": 11,
                "consultation_fee": 950.0,
                "bio": "Oncologist with expertise in solid tumours, chemotherapy protocols, and palliative care.",
                "is_verified": True, "is_available": True, "user_id": user_id,
            },

            # ── Radiology ─────────────────────────────────────────────────
            {
                "name": "Ananya Iyer",
                "email": "ananya@aster.com",
                "medical_license_number": "MED88888",
                "specialization": "Radiology",
                "latitude": 13.0645, "longitude": 77.5968,
                "address": "Aster CMI, Sahakar Nagar",
                "city": "Bangalore",
                "hospital_affiliation": "Aster CMI",
                "years_of_experience": 8,
                "consultation_fee": 700.0,
                "bio": "Radiologist specialised in MRI, CT, and ultrasound interpretation across clinical domains.",
                "is_verified": True, "is_available": True, "user_id": user_id,
            },

            # ── General Medicine ──────────────────────────────────────────
            {
                "name": "Siddharth Malhotra",
                "email": "sid@general.com",
                "medical_license_number": "MED99999",
                "specialization": "General Medicine",
                "latitude": 12.9300, "longitude": 77.6200,
                "address": "St. Johns Hospital, Koramangala",
                "city": "Bangalore",
                "hospital_affiliation": "St. Johns",
                "years_of_experience": 6,
                "consultation_fee": 500.0,
                "bio": "General physician handling primary care, preventive health, and multi-system evaluations.",
                "is_verified": True, "is_available": True, "user_id": user_id,
            },
        ]

        for dr_data in doctors:
            dr = models.Doctor(**dr_data)
            db.add(dr)

        db.commit()
        print(f"[SUCCESS] Seeded {len(doctors)} mock doctors across all specializations.")

    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_doctors()
