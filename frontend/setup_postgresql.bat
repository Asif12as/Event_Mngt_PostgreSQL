@echo off
echo PostgreSQL Setup Script for Event Management System
echo =============================================

:: Check if PostgreSQL is installed
where psql >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo PostgreSQL does not appear to be installed or is not in your PATH.
    echo Please install PostgreSQL from https://www.postgresql.org/download/windows/
    exit /b 1
)

for /f "tokens=*" %%i in ('psql --version') do set PG_VERSION=%%i
echo Found PostgreSQL: %PG_VERSION%

:: Check PostgreSQL service
sc query postgresql >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo PostgreSQL service not found. Make sure PostgreSQL is installed correctly.
    exit /b 1
)

sc query postgresql | findstr "RUNNING" >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo PostgreSQL service is not running. Attempting to start...
    net start postgresql
    if %ERRORLEVEL% neq 0 (
        echo Failed to start PostgreSQL service. Please start it manually.
        echo Open Services (services.msc), find PostgreSQL service, and click Start.
        exit /b 1
    )
    echo PostgreSQL service started successfully.
) else (
    echo PostgreSQL service is running.
)

:: Create database if it doesn't exist
echo.
echo Creating database 'event_management' if it doesn't exist...

echo DO $$ > create_db.sql
echo BEGIN >> create_db.sql
echo     IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'event_management') THEN >> create_db.sql
echo         CREATE DATABASE event_management; >> create_db.sql
echo     END IF; >> create_db.sql
echo END >> create_db.sql
echo $$; >> create_db.sql

psql -U postgres -f create_db.sql
del create_db.sql

if %ERRORLEVEL% neq 0 (
    echo Failed to create database. Please check your PostgreSQL installation and permissions.
    exit /b 1
)

echo Database 'event_management' is ready.

:: Apply migration script
echo.
echo Applying database migrations...
set MIGRATION_PATH=%~dp0postgresql\migrations\20250623163931_yellow_scene.sql

if not exist "%MIGRATION_PATH%" (
    echo Migration file not found at: %MIGRATION_PATH%
    exit /b 1
)

psql -U postgres -d event_management -f "%MIGRATION_PATH%"

if %ERRORLEVEL% neq 0 (
    echo Failed to apply migrations. Please check the error messages above.
    exit /b 1
)

echo.
echo Database setup completed successfully!
echo You can now start your Django server with:
echo cd backend
echo .\venv\Scripts\activate
echo python manage.py runserver

pause