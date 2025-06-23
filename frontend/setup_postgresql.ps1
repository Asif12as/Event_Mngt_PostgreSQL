# PostgreSQL Setup Script for Event Management System

# Check if PostgreSQL is installed
$pgVersion = $null
try {
    $pgVersion = & psql --version 2>$null
} catch {
    Write-Host "PostgreSQL does not appear to be installed or is not in your PATH." -ForegroundColor Red
    Write-Host "Please install PostgreSQL from https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}

Write-Host "Found PostgreSQL: $pgVersion" -ForegroundColor Green

# Check if PostgreSQL service is running
$pgService = Get-Service -Name postgresql* -ErrorAction SilentlyContinue
if ($pgService -eq $null) {
    Write-Host "PostgreSQL service not found. Make sure PostgreSQL is installed correctly." -ForegroundColor Red
    exit 1
}

if ($pgService.Status -ne "Running") {
    Write-Host "PostgreSQL service is not running. Attempting to start..." -ForegroundColor Yellow
    try {
        Start-Service $pgService.Name
        Write-Host "PostgreSQL service started successfully." -ForegroundColor Green
    } catch {
        Write-Host "Failed to start PostgreSQL service. Please start it manually." -ForegroundColor Red
        Write-Host "Open Services (services.msc), find PostgreSQL service, and click Start." -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "PostgreSQL service is running." -ForegroundColor Green
}

# Create database if it doesn't exist
Write-Host "\nCreating database 'event_management' if it doesn't exist..." -ForegroundColor Cyan
$createDbScript = @"
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'event_management') THEN
        CREATE DATABASE event_management;
    END IF;
END
\$\$;
"@

$createDbScript | psql -U postgres

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create database. Please check your PostgreSQL installation and permissions." -ForegroundColor Red
    exit 1
}

Write-Host "Database 'event_management' is ready." -ForegroundColor Green

# Apply migration script
Write-Host "\nApplying database migrations..." -ForegroundColor Cyan
$migrationPath = "$PSScriptRoot\postgresql\migrations\20250623163931_yellow_scene.sql"

if (-not (Test-Path $migrationPath)) {
    Write-Host "Migration file not found at: $migrationPath" -ForegroundColor Red
    exit 1
}

psql -U postgres -d event_management -f $migrationPath

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to apply migrations. Please check the error messages above." -ForegroundColor Red
    exit 1
}

Write-Host "\nDatabase setup completed successfully!" -ForegroundColor Green
Write-Host "You can now start your Django server with:" -ForegroundColor Cyan
Write-Host "cd backend" -ForegroundColor White
Write-Host ".\venv\Scripts\activate" -ForegroundColor White
Write-Host "python manage.py runserver" -ForegroundColor White