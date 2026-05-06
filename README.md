# EndoScore AI — Angular 17 Web Application

AI-powered obturation quality evaluation platform for dental and endodontic professionals.

## Tech Stack
- **Frontend**: Angular 17, Angular Material, TypeScript, SCSS, Chart.js
- **Backend**: Node.js + Express REST API
- **AI Service**: Python Flask microservice (OpenCV + ML analysis)
- **Database**: PostgreSQL
- **Auth**: JWT + Google OAuth + LinkedIn OAuth
- **Storage**: AWS S3 / Firebase Storage

## Project Structure
```
endo-score-ai/
├── src/app/
│   ├── core/
│   │   ├── services/     # auth.service, scan.service, doctor.service
│   │   ├── guards/       # auth.guard
│   │   └── interceptors/ # auth.interceptor (JWT injection)
│   ├── shared/
│   │   ├── components/   # sidenav, navbar, score-gauge
│   │   └── models/       # TypeScript interfaces
│   └── features/
│       ├── landing/      # LandingPageComponent
│       ├── auth/         # Login, Register
│       ├── dashboard/    # Dashboard, Analytics
│       ├── scan-analysis/# Upload, Processing, Results
│       ├── doctors/      # Recommendations
│       ├── history/      # Case History
│       ├── profile/      # User Profile
│       └── linkedin/     # Share Achievement
├── backend/              # Node.js Express API
├── ai-service/           # Python Flask + OpenCV AI engine
└── database/             # PostgreSQL schema + seed
```

## Quick Start

### 1. Install Frontend Dependencies
```bash
npm install
ng serve
```
Visit http://localhost:4200

### 2. Start Backend API
```bash
cd backend
npm install
cp .env.example .env   # Configure DB and JWT_SECRET
npm start
```
API runs on http://localhost:3000

### 3. Start AI Service
```bash
cd ai-service
pip install flask flask-cors opencv-python numpy
python main.py
```
AI engine on http://localhost:5000

### 4. Setup Database
```bash
psql -U postgres -c "CREATE DATABASE endoscore_ai"
psql -U postgres -d endoscore_ai -f database/schema.sql
psql -U postgres -d endoscore_ai -f database/seed.sql
```

## AI Scoring System

The AI service evaluates 4 clinical metrics:

| Metric | Max Points | Description |
|--------|-----------|-------------|
| Canal Fill Length Accuracy | 3 pts | Working length vs. actual fill length |
| Obturation Density | 3 pts | Homogeneity and radiodensity |
| Void Detection | 2 pts | Absence of voids and air pockets |
| Apical Seal Quality | 2 pts | Seal completeness at the apex |
| **Total** | **10 pts** | Combined obturation quality score |

## Score Categories
- **Excellent** (8.5–10): Optimal clinical outcome
- **Good** (7.0–8.4): Above average, minor improvements possible
- **Fair** (5.0–6.9): Acceptable but retreatment may be considered
- **Poor** (<5.0): Retreatment indicated

## API Endpoints
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/scan/upload
POST   /api/analysis/run
GET    /api/analysis/result/:id
GET    /api/doctors/recommendations
GET    /api/history
GET    /api/dashboard/stats
GET    /api/analytics/trends
PATCH  /api/profile
```