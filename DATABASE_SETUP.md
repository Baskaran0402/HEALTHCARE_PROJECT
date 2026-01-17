# 🗄️ Database Setup Guide

## PostgreSQL Installation

### Windows

1. **Download PostgreSQL**:

   - Visit: https://www.postgresql.org/download/windows/
   - Download the installer (version 15 or higher recommended)

2. **Install PostgreSQL**:

   - Run the installer
   - Remember the password you set for the `postgres` user
   - Default port: `5432`

3. **Verify Installation**:
   ```powershell
   psql --version
   ```

### Create Database

1. **Open PostgreSQL Command Line** (psql):

   ```powershell
   psql -U postgres
   ```

2. **Create Database**:

   ```sql
   CREATE DATABASE healthcare_db;
   ```

3. **Verify**:

   ```sql
   \l
   ```

   You should see `healthcare_db` in the list.

4. **Exit**:
   ```sql
   \q
   ```

## Environment Configuration

Add the following to your `.env` file:

```env
# Existing
GROQ_API_KEY=your_groq_api_key_here

# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/healthcare_db
```

Replace `your_password` with the password you set during PostgreSQL installation.

## Initialize Database Tables

Run the initialization script to create all tables:

```powershell
python -m backend.init_db
```

You should see:

```
Creating database tables...
✅ Database tables created successfully!
```

## Database Schema

The database includes the following tables:

### 1. **patients**

- Patient demographics and contact information
- Primary key: `id` (UUID)

### 2. **consultations**

- Consultation sessions with conversation history
- Links to patients
- Tracks consultation stage and confidence

### 3. **medical_records**

- Patient vitals, lab values, medical history
- Links to patients
- Timestamped records

### 4. **health_assessments**

- ML-generated risk assessments
- LLM-generated reports (patient & doctor)
- SOAP notes in JSON format
- Links to consultations

### 5. **audit_logs**

- System event tracking
- User activity logging
- Compliance and security

## Verify Database

You can verify the tables were created:

```powershell
psql -U postgres -d healthcare_db
```

Then:

```sql
\dt
```

You should see all 5 tables listed.

## Troubleshooting

### Connection Error

If you get a connection error:

1. Verify PostgreSQL is running:
   ```powershell
   Get-Service postgresql*
   ```
2. Check your `DATABASE_URL` in `.env`
3. Verify the database exists

### Permission Error

If you get permission errors:

```sql
GRANT ALL PRIVILEGES ON DATABASE healthcare_db TO postgres;
```
