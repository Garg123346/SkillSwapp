@REM ----------------------------------------------------------------------------
@REM SkillSwap Maven Wrapper Script for Windows
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set "PROJECT_DIR=%~dp0"
set "MAVEN_FALLBACK=%PROJECT_DIR%..\maven\apache-maven-3.9.9\bin\mvn.cmd"

where mvn >nul 2>&1
if %ERRORLEVEL% equ 0 (
    mvn %*
    exit /b %ERRORLEVEL%
)

if exist "%MAVEN_FALLBACK%" (
    call "%MAVEN_FALLBACK%" %*
    exit /b %ERRORLEVEL%
)

echo ERROR: Maven was not found on PATH or in local tools directory.
echo Please install Apache Maven 3.9+ or run with system mvn.
exit /b 1
