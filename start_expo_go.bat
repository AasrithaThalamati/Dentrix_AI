@echo off
title Dentrix AI - Expo Go Terminal Scanner (LAN)
echo ========================================================
echo   Starting Dentrix AI Mobile App (LAN Mode)
echo ========================================================
echo.

cd /d "%~dp0mobile-app"

echo Working Directory: %CD%
echo.
echo Launching Expo Metro bundler on LAN mode...
echo Ensure your phone is connected to the SAME WI-FI network!
echo.

call npx expo start --host lan --clear

pause
