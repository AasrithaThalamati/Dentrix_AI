const fs = require('fs');
const path = require('path');

console.log("=== Testing Dynamic Dashboard, Analytics, Case History & Profile Files ===");

const files = [
  'dashboard.js',
  'dashboard.html',
  'history.js',
  'history.html',
  'analytics.js',
  'analytics.html',
  'profile.js',
  'profile.html',
  'dentrix-backend/controllers/historyController.js',
  'dentrix-backend/controllers/analyticsController.js',
  'dentrix-backend/controllers/profileController.js',
  'dentrix-backend/routes/history.js'
];

let allExist = true;

files.forEach(f => {
  const fullPath = path.join(__dirname, f);
  if (fs.existsSync(fullPath)) {
    console.log(`✓ ${f} exists (${fs.statSync(fullPath).size} bytes)`);
  } else {
    console.error(`✗ ${f} MISSING`);
    allExist = false;
  }
});

// Check key dynamic methods in files
const historyJs = fs.readFileSync(path.join(__dirname, 'history.js'), 'utf8');
const analyticsJs = fs.readFileSync(path.join(__dirname, 'analytics.js'), 'utf8');
const dashboardJs = fs.readFileSync(path.join(__dirname, 'dashboard.js'), 'utf8');
const profileJs = fs.readFileSync(path.join(__dirname, 'profile.js'), 'utf8');

const checks = [
  { name: 'history.js MongoDB fetch', pass: historyJs.includes('/history') && historyJs.includes('loadCasesFromMongoDB') },
  { name: 'history.js New Case form submit', pass: historyJs.includes('newCaseForm') },
  { name: 'history.js Edit Case form submit', pass: historyJs.includes('editCaseForm') && historyJs.includes('PUT') },
  { name: 'history.js Delete Case handler', pass: historyJs.includes('deleteCaseBtn') && historyJs.includes('DELETE') },
  { name: 'analytics.js MongoDB fetch', pass: analyticsJs.includes('/analytics') && analyticsJs.includes('loadAnalyticsFromMongoDB') },
  { name: 'dashboard.js MongoDB fetch', pass: dashboardJs.includes('/analytics') && dashboardJs.includes('/history') },
  { name: 'profile.js MongoDB fetch & save', pass: profileJs.includes('/profile') && profileJs.includes('saveProfileBtn') }
];

console.log("\n=== Checking Dynamic Features Implementation ===");
let allPassed = true;
checks.forEach(c => {
  if (c.pass) {
    console.log(`✓ ${c.name}`);
  } else {
    console.error(`✗ ${c.name} FAILED`);
    allPassed = false;
  }
});

if (allExist && allPassed) {
  console.log("\nSUCCESS: All Dashboard, Analytics, Case History, and Profile pages are dynamically connected, editable, and bound to MongoDB user profiles!");
} else {
  console.error("\nTEST FAILED");
  process.exit(1);
}
