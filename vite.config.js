import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',      // React app entry
        home: 'index.html',       // Your original homepage
        dashboard: 'dashboard.html',
        patients: 'patients.html',
        analytics: 'analytics.html',
        analyze: 'analyze.html',
        history: 'history.html',
        profile: 'profile.html',
        research: 'research.html',
        settings: 'settings.html',
        signup: 'signup.html',
      }
    }
  }
})