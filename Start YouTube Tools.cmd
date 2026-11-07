@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tampermonkey\start-local.ps1"
echo.
echo YouTube Tools has stopped. Press any key to close this window.
pause >nul
