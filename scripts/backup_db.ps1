$ErrorActionPreference = "Stop"

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupDir = "C:\Backups\HealthcareApp"
$backupFile = "$backupDir\backup_$timestamp.sql"
$dbName = "healthcare_db"
$dbUser = "postgres"

# Create directory if not exists
if (-not (Test-Path -Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

Write-Host "Starting backup for $dbName..."

# Ensure pg_dump is in PATH or provide full path
try {
    # Password should be in PGPASSWORD env var or .pgpass file
    $env:PGPASSWORD = "your_secure_password" 
    pg_dump -U $dbUser -h localhost -d $dbName -f $backupFile
    
    if (Test-Path -Path $backupFile) {
        Write-Host "Backup successful: $backupFile"
        
        # Cleanup old backups (keep last 7 days)
        Get-ChildItem -Path $backupDir -Filter "*.sql" | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | Remove-Item
        Write-Host "Old backups cleaned up."
    } else {
        Write-Error "Backup file not created."
    }
} catch {
    Write-Error "Backup failed: $_"
}
