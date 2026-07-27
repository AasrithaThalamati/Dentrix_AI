#!/bin/bash
echo "========================================================"
echo "    Converting Dentrix AI Vite Web App to Android APK"
echo "========================================================"
echo ""

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "Step 1: Building Vite production web app (dist)..."
npm run build

echo ""
echo "Step 2: Installing Capacitor native wrapper..."
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli

echo ""
echo "Step 3: Initializing Capacitor project..."
if [ ! -f "capacitor.config.json" ]; then
  npx cap init "Dentrix AI" "com.dentrix.ai" --web-dir "dist"
fi

echo ""
echo "Step 4: Adding Android native platform..."
if [ ! -d "android" ]; then
  npx cap add android
fi

echo ""
echo "Step 5: Syncing Vite build assets to Android..."
npx cap copy android

echo ""
echo "========================================================"
echo " 🎉 SUCCESS! Vite app converted to Android Native project!"
echo " Android project location: $(pwd)/android"
echo ""
echo " To build the APK:"
echo " 1. Open Android Studio: npx cap open android"
echo " 2. Or run: cd android && ./gradlew assembleRelease"
echo "========================================================"
