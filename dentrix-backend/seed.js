/**
 * Seed script — populates MongoDB with sample case history data.
 * Run from the dentrix-backend directory:
 *   node seed.js
 *
 * It will:
 *  1. Connect to MongoDB using MONGO_URI from .env
 *  2. Find the first dentist/endodontist user (or create a seed user)
 *  3. Upsert the 12 unique patients
 *  4. Insert 15 history/case records linked to those patients
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const User    = require('./models/User');
const Patient = require('./models/Patient');
const History = require('./models/History');

// ── Seed data ─────────────────────────────────────────────────────────────────

const SEED_PATIENTS = [
  { name: 'Riya Arora',    age: 32, gender: 'female', phone: '9876540081' },
  { name: 'Manav Khanna',  age: 45, gender: 'male',   phone: '9876540080' },
  { name: 'Sonal Patel',   age: 28, gender: 'female', phone: '9876540079' },
  { name: 'Arjun Joshi',   age: 51, gender: 'male',   phone: '9876540078' },
  { name: 'Neha Mehta',    age: 36, gender: 'female', phone: '9876540077' },
  { name: 'Rakesh Iyer',   age: 42, gender: 'male',   phone: '9876540076' },
  { name: 'Priya Desai',   age: 29, gender: 'female', phone: '9876540075' },
  { name: 'Farhan Sheikh', age: 38, gender: 'male',   phone: '9876540074' },
  { name: 'Kavita Singh',  age: 47, gender: 'female', phone: '9876540073' },
  { name: 'Deepak Nair',   age: 55, gender: 'male',   phone: '9876540072' },
  { name: 'Anjali Verma',  age: 31, gender: 'female', phone: '9876540071' },
  { name: 'Rohan Sharma',  age: 40, gender: 'male',   phone: '9876540070' },
];

// Each case row: [patientName, caseId, tooth, date, score, length, density, taper, visit, confidence]
const SEED_CASES = [
  ['Riya Arora',    'CA-0147', '26', '2026-05-03', 8.4, 3.4, 2.7, 2.3, 'Post-obturation', 92.1],
  ['Manav Khanna',  'CA-0146', '36', '2026-05-02', 6.7, 2.8, 2.1, 1.8, 'Follow-up',       88.4],
  ['Sonal Patel',   'CA-0145', '16', '2026-04-30', 4.9, 2.0, 1.6, 1.3, 'Post-obturation', 85.9],
  ['Arjun Joshi',   'CA-0144', '46', '2026-04-29', 9.1, 3.8, 2.8, 2.5, 'Post-obturation', 94.7],
  ['Neha Mehta',    'CA-0143', '11', '2026-04-28', 3.2, 1.2, 1.2, 0.8, 'Pre-retreatment', 91.2],
  ['Rakesh Iyer',   'CA-0142', '36', '2026-04-25', 7.8, 3.1, 2.5, 2.2, 'Recall',          89.3],
  ['Priya Desai',   'CA-0141', '21', '2026-04-22', 8.9, 3.6, 2.8, 2.5, 'Post-obturation', 93.8],
  ['Farhan Sheikh', 'CA-0140', '47', '2026-04-20', 5.5, 2.3, 1.8, 1.4, 'Follow-up',       86.1],
  ['Kavita Singh',  'CA-0139', '15', '2026-04-18', 7.2, 3.0, 2.3, 1.9, 'Recall',          88.6],
  ['Deepak Nair',   'CA-0138', '14', '2026-04-15', 6.1, 2.5, 2.0, 1.6, 'Post-obturation', 87.2],
  ['Anjali Verma',  'CA-0137', '27', '2026-04-10', 8.3, 3.3, 2.6, 2.4, 'Post-obturation', 91.5],
  ['Rohan Sharma',  'CA-0136', '46', '2026-04-05', 2.8, 1.0, 1.1, 0.7, 'Pre-retreatment', 90.1],
  ['Riya Arora',    'CA-0135', '26', '2026-03-28', 7.6, 3.2, 2.3, 2.1, 'Follow-up',       88.9],
  ['Manav Khanna',  'CA-0134', '36', '2026-03-20', 5.8, 2.4, 1.9, 1.5, 'Post-obturation', 85.3],
  ['Arjun Joshi',   'CA-0133', '14', '2026-03-10', 8.7, 3.5, 2.7, 2.5, 'Post-obturation', 92.4],
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getOrCreateDentist() {
  // Use any existing dentist/endodontist
  let user = await User.findOne({ role: { $in: ['dentist', 'endodontist'] } });
  if (user) {
    console.log(`  ✓ Using existing user: ${user.name} (${user.email})`);
    return user;
  }

  // No user found — create a seed dentist
  const hashed = await bcrypt.hash('seed@123', 10);
  user = await User.create({
    name:           'Seed Dentist',
    email:          'seed@dentrixai.com',
    password:       hashed,
    role:           'dentist',
    specialization: 'Endodontist',
    clinic:         'Dentrix AI Clinic',
  });
  console.log(`  ✓ Created seed user: ${user.email}  (password: seed@123)`);
  return user;
}

async function upsertPatients(dentistId) {
  const map = {};
  for (const p of SEED_PATIENTS) {
    let patient = await Patient.findOne({ dentist: dentistId, name: p.name });
    if (!patient) {
      patient = await Patient.create({ ...p, dentist: dentistId, status: 'active' });
      console.log(`  + Created patient: ${p.name}`);
    } else {
      console.log(`  · Patient exists: ${p.name}`);
    }
    map[p.name] = patient;
  }
  return map;
}

async function seedHistory(dentistId, patientMap) {
  let created = 0;
  let skipped = 0;

  for (const [name, caseId, tooth, date, score, length, density, taper, visit, confidence] of SEED_CASES) {
    const exists = await History.findOne({ dentist: dentistId, caseId });
    if (exists) {
      console.log(`  · Case exists: ${caseId}`);
      skipped++;
      continue;
    }

    const patient = patientMap[name];
    if (!patient) {
      console.warn(`  ✗ Patient not found: ${name} — skipping ${caseId}`);
      continue;
    }

    await History.create({
      dentist:         dentistId,
      patient:         patient._id,
      caseId,
      toothNumber:     tooth,
      date:            new Date(date),
      obturationScore: score,
      lengthScore:     length,
      densityScore:    density,
      taperScore:      taper,
      visitType:       visit,
      aiConfidence:    confidence,
    });

    console.log(`  + Seeded case: ${caseId}  ${name}  Tooth ${tooth}  Score ${score}`);
    created++;
  }

  return { created, skipped };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌱  Dentrix AI — Seed Script\n');

  if (!process.env.MONGO_URI) {
    console.error('✗  MONGO_URI not set. Make sure .env exists in dentrix-backend/');
    process.exit(1);
  }

  console.log('Connecting to MongoDB…');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected.\n');

  console.log('── Step 1: Resolve dentist user ──');
  const dentist = await getOrCreateDentist();

  console.log('\n── Step 2: Upsert patients ──');
  const patientMap = await upsertPatients(dentist._id);

  console.log('\n── Step 3: Seed case history ──');
  const { created, skipped } = await seedHistory(dentist._id, patientMap);

  console.log(`\n✅  Done.  ${created} case(s) created, ${skipped} already existed.\n`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
