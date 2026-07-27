#!/bin/bash
echo "========================================================"
echo "  Building Android APK via Expo Cloud (EAS Build)"
echo "========================================================"
echo ""

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
if [ -d "$DIR/mobile-app" ]; then
  cd "$DIR/mobile-app"
else
  cd "$DIR"
fi

echo "Working Directory: $(pwd)"
echo ""
echo "Launching Expo EAS Cloud Build..."
echo "This compiles your .apk file on Expo servers (No Android SDK required!)."
echo ""

npx eas-cli build -p android --profile preview
