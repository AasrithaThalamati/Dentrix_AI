#!/bin/bash
echo "========================================================"
echo "  Starting Dentrix AI Mobile App (LAN Mode)"
echo "========================================================"
echo ""

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
if [ -d "$DIR/mobile-app" ]; then
  cd "$DIR/mobile-app"
else
  cd "$DIR"
fi

# Kill any leftover process on port 8081
lsof -ti :8081 | xargs kill -9 2>/dev/null || true

echo "Working Directory: $(pwd)"
echo ""
echo "Launching Expo Metro bundler on LAN mode..."
echo "Ensure your phone is connected to the same Wi-Fi as your Mac!"
echo ""

npx expo start --host lan --clear
