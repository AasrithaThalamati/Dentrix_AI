# Dentrix AI — Backend Setup

## Folder Structure
```
dentrix-backend/
├── server.js              # Entry point
├── .env.example           # Copy to .env and fill in values
├── package.json
├── api.js                 # Frontend helper (copy to your Dentrix_AI project)
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── User.js
│   ├── Patient.js
│   ├── Analysis.js
│   ├── History.js
│   └── Research.js
├── controllers/
│   ├── authController.js
│   ├── patientController.js
│   ├── analysisController.js
│   ├── historyController.js
│   ├── profileController.js
│   ├── analyticsController.js
│   └── researchController.js
├── routes/
│   ├── auth.js
│   ├── patients.js
│   ├── analysis.js
│   ├── history.js
│   ├── profile.js
│   ├── analytics.js
│   └── research.js
└── middleware/
    ├── auth.js            # JWT guard
    └── upload.js          # Multer file upload
```

## Setup Steps

### 1. Install MongoDB
- Download from https://www.mongodb.com/try/download/community
- Start it: `mongod`

### 2. Setup Backend
```bash
cd dentrix-backend
cp .env.example .env        # fill in your values
npm install
npm run dev                 # starts on port 5000
```

### 3. Connect Frontend
- Copy `api.js` into your `Dentrix_AI` project root
- Add this to each HTML page's `<head>`:
```html
<script src="/api.js"></script>
```
- Then use it in your page scripts:
```js
// Login example (in signup.js or signup.html)
const { token, user } = await Auth.login(email, password);
saveAuth(token, user);
window.location.href = '/dashboard.html';

// Protect a page (add to top of dashboard.js etc.)
requireAuth();

// Load patients
const patients = await Patients.getAll();

// Upload X-ray
const result = await Analysis.create(patientId, fileInput.files[0]);
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/patients | Get all patients |
| POST | /api/patients | Add patient |
| PUT | /api/patients/:id | Update patient |
| DELETE | /api/patients/:id | Delete patient |
| GET | /api/analysis | Get all analyses |
| POST | /api/analysis | Upload X-ray + get AI score |
| GET | /api/analytics | Dashboard stats |
| GET | /api/history | Treatment history |
| GET | /api/profile | User profile |
| PUT | /api/profile | Update profile |
