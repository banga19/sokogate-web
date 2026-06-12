@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

:: ============================================================================
:: Deploy Script for Sokogate Web
:: 
:: IMPORTANT: Do NOT hardcode credentials here.
:: Set the following environment variables before running:
::   set DEPLOY_SERVER_IP=<your-server-ip>
::   set DEPLOY_SERVER_USER=<your-username>
::   set DEPLOY_SERVER_PASSWORD=<your-password>
::   set DEPLOY_REMOTE_PATH=/root/dist
:: ============================================================================

:: Configuration from environment variables (with defaults for LOCAL_PATH only)
set WinSCP="C:\Program Files (x86)\WinSCP\WinSCP.com"
set SERVER_IP=%DEPLOY_SERVER_IP%
set SERVER_USER=%DEPLOY_SERVER_USER%
set SERVER_PASSWORD=%DEPLOY_SERVER_PASSWORD%
if not "%DEPLOY_SERVER_PORT%"=="" ( set SERVER_PORT=%DEPLOY_SERVER_PORT% ) else ( set SERVER_PORT=22 )
set REMOTE_PATH=%DEPLOY_REMOTE_PATH:/root/dist%
set LOCAL_PATH=.\dist

:: Validate required environment variables
if "%SERVER_IP%"=="" (
    echo [ERROR] Environment variable DEPLOY_SERVER_IP is not set.
    echo Please set it before running this script:
    echo   set DEPLOY_SERVER_IP=your-server-ip
    exit /b 1
)
if "%SERVER_USER%"=="" (
    echo [ERROR] Environment variable DEPLOY_SERVER_USER is not set.
    echo Please set it before running this script:
    echo   set DEPLOY_SERVER_USER=your-username
    exit /b 1
)
if "%SERVER_PASSWORD%"=="" (
    echo [ERROR] Environment variable DEPLOY_SERVER_PASSWORD is not set.
    echo Please set it before running this script:
    echo   set DEPLOY_SERVER_PASSWORD=your-password
    exit /b 1
)

:: Check if WinSCP is installed
if not exist %WinSCP% (
    echo [ERROR] WinSCP not found at %WinSCP%
    echo Please install WinSCP or update the path.
    pause
    exit /b 1
)

:: Ensure local dist directory exists
if not exist %LOCAL_PATH% (
    echo [ERROR] Local dist directory not found at %LOCAL_PATH%
    echo Please run 'yarn build' first.
    pause
    exit /b 1
)

echo [INFO] Starting deployment via WinSCP...
echo [INFO] Server: %SERVER_IP%:%SERVER_PORT%
echo [INFO] User: %SERVER_USER%
echo [INFO] Local: %LOCAL_PATH%
echo [INFO] Remote: %REMOTE_PATH%

%WinSCP% ^
  /command ^
    "open sftp://%SERVER_USER%:%SERVER_PASSWORD%@%SERVER_IP%:%SERVER_PORT%/" ^
    "synchronize remote -criteria=time %LOCAL_PATH% %REMOTE_PATH% -filemask=""*|node_modules/; .git/; *.log; .env; deploy_ps.bat""" ^
    "exit"

if %errorlevel% equ 0 (
    echo [SUCCESS] Deployment completed successfully!
) else (
    echo [ERROR] Deployment failed with exit code: %errorlevel%
    pause
)
