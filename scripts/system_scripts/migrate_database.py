"""
Database Migration Script
Adds patient name and medical_record_number columns to patients table
"""

import sys

from sqlalchemy import text

from backend.database import SessionLocal


def run_migration():
    """Add name and medical_record_number columns to patients table"""

    print("🔄 Starting database migration...")
    print("=" * 60)

    db = SessionLocal()

    try:
        # Check if columns already exist
        print("\n1. Checking existing schema...")
        result = db.execute(
            text(
                """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'patients'
        """
            )
        )
        existing_columns = [row[0] for row in result]
        print(f"   Existing columns: {', '.join(existing_columns)}")

        # Add name column if it doesn't exist
        if "name" not in existing_columns:
            print("\n2. Adding 'name' column...")
            db.execute(
                text(
                    """
                ALTER TABLE patients
                ADD COLUMN name VARCHAR(200)
            """
                )
            )
            db.commit()
            print("   ✅ 'name' column added successfully")
        else:
            print("\n2. 'name' column already exists, skipping...")

        # Add medical_record_number column if it doesn't exist
        if "medical_record_number" not in existing_columns:
            print("\n3. Adding 'medical_record_number' column...")
            db.execute(
                text(
                    """
                ALTER TABLE patients
                ADD COLUMN medical_record_number VARCHAR(50) UNIQUE
            """
                )
            )
            db.commit()
            print("   ✅ 'medical_record_number' column added successfully")
        else:
            print("\n3. 'medical_record_number' column already exists, skipping...")

        # Update existing records with placeholder names
        print("\n4. Updating existing records...")
        result = db.execute(
            text(
                """
            SELECT COUNT(*) FROM patients WHERE name IS NULL
        """
            )
        )
        null_count = result.scalar()

        if null_count > 0:
            print(f"   Found {null_count} records without names")
            db.execute(
                text(
                    """
                UPDATE patients
                SET name = 'Patient-' || SUBSTRING(id, 1, 8)
                WHERE name IS NULL
            """
                )
            )
            db.commit()
            print(f"   ✅ Updated {null_count} records with placeholder names")
        else:
            print("   All records already have names")

        # Make name column NOT NULL after updating existing records
        if "name" in existing_columns:
            print("\n5. Setting 'name' column to NOT NULL...")
            try:
                db.execute(
                    text(
                        """
                    ALTER TABLE patients
                    ALTER COLUMN name SET NOT NULL
                """
                    )
                )
                db.commit()
                print("   ✅ 'name' column set to NOT NULL")
            except Exception as e:
                print(f"   ⚠️  Could not set NOT NULL constraint: {e}")

        print("\n" + "=" * 60)
        print("✅ Migration completed successfully!")
        print("=" * 60)

        # Show final schema
        print("\n📊 Final schema for 'patients' table:")
        result = db.execute(
            text(
                """
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'patients'
            ORDER BY ordinal_position
        """
            )
        )

        for row in result:
            nullable = "NULL" if row[2] == "YES" else "NOT NULL"
            print(f"   • {row[0]}: {row[1]} ({nullable})")

        print("\n✅ Database is ready for use!")

    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        db.rollback()
        sys.exit(1)

    finally:
        db.close()


if __name__ == "__main__":
    print("\n🩺 HEALTHCARE PROJECT - DATABASE MIGRATION")
    print("=" * 60)
    print("This script will add patient identification columns")
    print("=" * 60)

    response = input("\nProceed with migration? (yes/no): ")

    if response.lower() in ["yes", "y"]:
        run_migration()
    else:
        print("\n❌ Migration cancelled")
        sys.exit(0)
