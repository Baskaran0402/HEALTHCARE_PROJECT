"""
Database Migration Script - Advanced Intelligence Support
Adds cross_intelligence_insights column to health_assessments table
"""

import sys
import os

# Add the project root to sys.path so we can import backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from sqlalchemy import text
from backend.database import SessionLocal


def run_migration():
    """Add cross_intelligence_insights column to health_assessments table"""

    print("Starting advanced intelligence migration...")
    print("=" * 60)

    db = SessionLocal()

    try:
        # Check if column already exists
        print("1. Checking existing schema for 'health_assessments'...")
        result = db.execute(text("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'health_assessments'
        """))
        existing_columns = [row[0] for row in result.all()]
        print(f"   Existing columns: {', '.join(existing_columns)}")

        # Add cross_intelligence_insights column if it doesn't exist
        if "cross_intelligence_insights" not in existing_columns:
            print("2. Adding 'cross_intelligence_insights' column...")
            db.execute(text("""
                ALTER TABLE health_assessments
                ADD COLUMN cross_intelligence_insights JSONB
            """))
            db.commit()
            print("   [OK] 'cross_intelligence_insights' column added successfully")
        else:
            print("2. 'cross_intelligence_insights' column already exists, skipping...")

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
