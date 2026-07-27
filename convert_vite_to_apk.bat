@echo off
title Dentrix AI - Convert Vite Web App to Android APK
echo ========================================================
echo     Converting Dentrix AI Vite Web App to Android APK
echo ========================================================
echo.

cd /d "%~dp0"

echo Step 1: Building Vite production web app (dist)...
call npm run build

echo.
echo Step 2: Installing Capacitor native wrapper...
call npm install @capacitor/core @capacitor/android
call npm install -D @capacitor/cli

echo.
echo Step 3: Initializing Capacitor project...
if not exist capacitor.config.json (
  call npx cap init "Dentrix AI" "com.dentrix.ai" --web-dir "dist"
)

echo.
echo Step 4: Adding Android native platform...
if not exist android (
  call npx cap add android
)

echo.
echo Step 5: Syncing Vite build assets to Android...
call npx cap copy android

echo.
echo ========================================================
echo  🎉 SUCCESS! Vite app converted to Android Native project!
echo  Location: %CD%\android
echo.
echo  To build the APK:
echo  1. Open Android Studio: npx cap open android
echo  2. Or run: cd android ^& gradlew assembleRelease
echo ========================================================
pause
