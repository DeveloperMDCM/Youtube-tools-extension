@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tampermonkey\autostart.ps1" -Action Enable
echo.
pause
