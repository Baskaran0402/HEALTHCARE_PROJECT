"""
Database Migration Script - Brain MRI Support
Adds mri_image_path column to medical_records table
"""

import sys
import os

# Add the project root to sys.path so we can import backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from sqlalchemy import text
from backend.database import SessionLocal

def run_migration():
    """Add mri_image_path column to medical_records table"""

    print("Starting brain MRI support migration...")
    print("=" * 60)

    db = SessionLocal()

    try:
        # Check if columns already exist
        print("1. Checking existing schema for 'medical_records'...")
        result = db.execute(
            text(
                """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'medical_records'
        """
            )
        )
        existing_columns = [row[0] for row in result.all()]
        print(f"   Existing columns: {', '.join(existing_columns)}")

        # Add mri_image_path column if it doesn't exist
        if "mri_image_path" not in existing_columns:
            print("2. Adding 'mri_image_path' column...")
            db.execute(
                text(
                    """
                ALTER TABLE medical_records
                ADD COLUMN mri_image_path TEXT
            """
                )
            )
            db.commit()
            print("   [OK] 'mri_image_path' column added successfully")
        else:
            print("2. 'mri_image_path' column already exists, skipping...")

        print("=" * 60)
        print("Migration completed successfully!")
        print("=" * 60)

        # Show final schema
        print("Final schema for 'medical_records' table:")
        result = db.execute(
            text(
                """
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'medical_records'
            ORDER BY ordinal_position
        """
            )
        )

        for row in result:
            nullable = "NULL" if row[2] == "YES" else "NOT NULL"
            print(f"   - {row[0]}: {row[1]} ({nullable})")

        print("Database is ready for brain MRI support!")

    except Exception as e:
        print(f"Migration failed: {e}")
        db.rollback()
        sys.exit(1)

    finally:
        db.close()

if __name__ == "__main__":
    run_migration()
