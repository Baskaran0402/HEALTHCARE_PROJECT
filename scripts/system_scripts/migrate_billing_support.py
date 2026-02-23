"""
Database Migration Script - Billing & Anatomy Support
Adds billing_codes column to health_assessments table
"""

import sys
import os

# Add the project root to sys.path so we can import backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from sqlalchemy import text
from backend.database import SessionLocal

def run_migration():
    """Add billing_codes column to health_assessments table"""

    print("Starting billing & anatomy migration...")
    print("=" * 60)

    db = SessionLocal()

    try:
        # Check if column already exists
        print("1. Checking existing schema for 'health_assessments'...")
        result = db.execute(
            text(
                """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'health_assessments'
        """
            )
        )
        existing_columns = [row[0] for row in result.all()]
        print(f"   Existing columns: {', '.join(existing_columns)}")

        # Add billing_codes column if it doesn't exist
        if "billing_codes" not in existing_columns:
            print("2. Adding 'billing_codes' column...")
            db.execute(
                text(
                    """
                ALTER TABLE health_assessments
                ADD COLUMN billing_codes JSONB
            """
                )
            )
            db.commit()
            print("   [OK] 'billing_codes' column added successfully")
        else:
            print("2. 'billing_codes' column already exists, skipping...")

        print("=" * 60)
        print("Migration completed successfully!")

    except Exception as e:
        print(f"Migration failed: {e}")
        db.rollback()
        sys.exit(1)

    finally:
        db.close()

if __name__ == "__main__":
    run_migration()
