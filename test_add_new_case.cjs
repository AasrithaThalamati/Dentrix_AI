const http = require('http');

console.log("=== Testing Add New Case API Endpoint in MongoDB ===");

const testEmail = `testdoc_${Date.now()}@dentrixai.org`;
const loginData = JSON.stringify({
  name: 'Dr. Test Doctor',
  email: testEmail,
  password: 'password123',
  clinic: 'Test Endodontic Clinic'
});

const reqOptions = {
  hostname: '127.0.0.1',
  port: 5001,
  path: '/api/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
};

const req = http.request(reqOptions, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    let token = null;
    try {
      const parsed = JSON.parse(body);
      token = parsed.token;
    } catch(e) {}

    if (token) {
      testAddCase(token);
    } else {
      console.error("Signup failed:", body);
      process.exit(1);
    }
  });
});
req.write(loginData);
req.end();

function testAddCase(token) {
  console.log("✓ Doctor user created & JWT token received");

  const casePayload = JSON.stringify({
    patientName: 'Real Test Patient',
    toothNumber: '26',
    visitType: 'Post-obturation',
    obturationScore: 8.7,
    lengthScore: 3.6,
    densityScore: 2.7,
    taperScore: 2.4,
    notes: 'Real clinical case saved to MongoDB.'
  });

  const caseReq = http.request({
    hostname: '127.0.0.1',
    port: 5001,
    path: '/api/history',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Length': Buffer.byteLength(casePayload)
    }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log(`Add Case HTTP Status: ${res.statusCode}`);
      console.log(`Created Record: ${body}`);

      if (res.statusCode === 201 || res.statusCode === 200) {
        console.log("SUCCESS: Case created dynamically in MongoDB!");
      } else {
        console.error("FAILED to create case in MongoDB");
        process.exit(1);
      }
    });
  });
  caseReq.write(casePayload);
  caseReq.end();
}
