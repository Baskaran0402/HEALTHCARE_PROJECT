# Security & Infrastructure Guide

## Database Security (PostgreSQL)

### Transparent Data Encryption (TDE)

PostgreSQL does not support TDE natively in the open-source version until very recent extensions or commercial forks (like EDB). However, for a standard deployment, we recommend **Disk-Level Encryption**:

1.  **Windows**: Enable BitLocker on the drive hosting the PostgreSQL `data` directory.
2.  **Linux**: Use `dm-crypt` / LUKS for the data volume.

For application-level encryption of sensitive columns (PII):

- Use `pgcrypto` extension for specific columns.
- Ensure `SSL` is enabled for all database connections in `postgresql.conf` (`ssl = on`).

### Automated Backups

A PowerShell script `scripts/backup_db.ps1` is provided to automate backups.
Schedule this using Windows Task Scheduler:

1.  Open Task Scheduler.
2.  Create Basic Task -> "Daily Database Backup".
3.  Action: Start a Program -> `powershell.exe` -> Arguments: `-File "C:\path\to\scripts\backup_db.ps1"`

## Application Performance Monitoring (APM)

We use `prometheus-fastapi-instrumentator` to expose metrics at `/metrics`.

1.  **Prometheus**: Configure a Prometheus server to scrape `http://localhost:8000/metrics`.
2.  **Grafana**: Connect Grafana to Prometheus to visualize Request Latency, Error Rates, and Throughput.

## Disaster Recovery Plan

1.  **RPO (Recovery Point Objective)**: 24 hours (Daily Backups).
2.  **RTO (Recovery Time Objective)**: 2 hours.
3.  **Procedure**:
    - Install PostgreSQL.
    - Restore latest backup: `psql -U user -d dbname -f backup_file.sql`
    - Redeploy Application containers/services.
