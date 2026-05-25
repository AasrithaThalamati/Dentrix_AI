/* ============================================================
   Dentrix AI — Anthropic API Proxy Server
   Runs on http://127.0.0.1:5001
   Usage: node proxy.js
   ============================================================ */

   const http  = require('http');
   const https = require('https');
   
   const PORT       = 5001;
   const ANTHROPIC_KEY = 'sk-ant-api03-YourRealKeyHere';
   
   const CORS_HEADERS = {
     'Access-Control-Allow-Origin':  '*',
     'Access-Control-Allow-Methods': 'POST, OPTIONS',
     'Access-Control-Allow-Headers': 'Content-Type',
     'Content-Type': 'application/json'
   };
   
   const server = http.createServer((req, res) => {
   
     /* ── CORS preflight ── */
     if (req.method === 'OPTIONS') {
       res.writeHead(204, CORS_HEADERS);
       res.end();
       return;
     }
   
     /* ── Only accept POST /api/smile-design ── */
     if (req.method !== 'POST' || req.url !== '/api/smile-design') {
       res.writeHead(404, CORS_HEADERS);
       res.end(JSON.stringify({ error: 'Not found' }));
       return;
     }
   
     /* ── Collect request body ── */
     let body = '';
     req.on('data', chunk => { body += chunk; });
     req.on('end', () => {
       let payload;
       try { payload = JSON.parse(body); }
       catch (e) {
         res.writeHead(400, CORS_HEADERS);
         res.end(JSON.stringify({ error: 'Invalid JSON' }));
         return;
       }
   
       const { base64, mimeType } = payload;
       if (!base64 || !mimeType) {
         res.writeHead(400, CORS_HEADERS);
         res.end(JSON.stringify({ error: 'Missing base64 or mimeType' }));
         return;
       }
   
       /* ── Build Claude request ── */
       const systemPrompt = `You are a dental aesthetics AI specialised in smile design, trained on the face-tooth harmony principle (Williams 1914, Frush & Fisher).
   
   Analyse the uploaded frontal face photo and respond ONLY with a valid JSON object. No markdown, no preamble, no explanation outside the JSON.
   
   Use EXACTLY this structure:
   {
     "faceShape": "oval|round|square|heart|diamond|oblong|triangular",
     "faceShapeDescription": "One sentence describing the key facial geometry features observed",
     "primaryRecommendation": {
       "toothShape": "oval|round|square|triangular|tapered",
       "compatibilityScore": <integer 70-99>,
       "reasoning": "2-3 sentences explaining why this tooth shape suits the detected facial geometry based on established dental aesthetics principles"
     },
     "allShapeScores": {
       "oval": <integer 0-100>,
       "round": <integer 0-100>,
       "square": <integer 0-100>,
       "triangular": <integer 0-100>,
       "tapered": <integer 0-100>
     },
     "clinicalNotes": "2-3 sentences covering smile harmony tips, midline alignment, and any aesthetic considerations specific to this face type",
     "suggestions": [
       "Specific dentist recommendation 1",
       "Specific dentist recommendation 2",
       "Specific dentist recommendation 3"
     ]
   }
   
   If no clear frontal face is visible, return:
   { "error": "no_face", "message": "No clear frontal face detected. Please upload a well-lit, forward-facing photo." }
   
   Rules:
   - faceShape must be one of the 7 enum values exactly
   - toothShape must be one of the 5 enum values exactly
   - The highest score in allShapeScores must match toothShape in primaryRecommendation
   - suggestions must have exactly 3 items`;
   
       const claudeBody = JSON.stringify({
         model: 'claude-sonnet-4-20250514',
         max_tokens: 1000,
         system: systemPrompt,
         messages: [{
           role: 'user',
           content: [
             { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } },
             { type: 'text', text: 'Analyse this frontal face photo and return the JSON result only.' }
           ]
         }]
       });
   
       /* ── Forward to Anthropic ── */
       const options = {
         hostname: 'api.anthropic.com',
         path:     '/v1/messages',
         method:   'POST',
         headers: {
           'Content-Type':      'application/json',
           'x-api-key':         ANTHROPIC_KEY,
           'anthropic-version': '2023-06-01',
           'Content-Length':    Buffer.byteLength(claudeBody)
         }
       };
   
       const apiReq = https.request(options, apiRes => {
         let data = '';
         apiRes.on('data', chunk => { data += chunk; });
         apiRes.on('end', () => {
           try {
             const parsed = JSON.parse(data);
   
             /* Anthropic API error */
             if (parsed.error) {
               res.writeHead(502, CORS_HEADERS);
               res.end(JSON.stringify({ error: parsed.error.message || 'Anthropic API error' }));
               return;
             }
   
             /* Extract text content */
             const rawText = parsed.content?.find(b => b.type === 'text')?.text || '';
             const clean   = rawText.replace(/```json|```/g, '').trim();
   
             let result;
             try {
               result = JSON.parse(clean);
             } catch (e) {
               const match = clean.match(/\{[\s\S]*\}/);
               result = match ? JSON.parse(match[0]) : { error: 'parse_failed', message: 'Could not parse AI response' };
             }
   
             res.writeHead(200, CORS_HEADERS);
             res.end(JSON.stringify(result));
   
           } catch (e) {
             res.writeHead(502, CORS_HEADERS);
             res.end(JSON.stringify({ error: 'Failed to parse Anthropic response' }));
           }
         });
       });
   
       apiReq.on('error', err => {
         res.writeHead(502, CORS_HEADERS);
         res.end(JSON.stringify({ error: 'Could not reach Anthropic API: ' + err.message }));
       });
   
       apiReq.write(claudeBody);
       apiReq.end();
     });
   });
   
   server.listen(PORT, '127.0.0.1', () => {
     console.log(`\n✅ Dentrix AI proxy running at http://127.0.0.1:${PORT}`);
     console.log(`   Forwarding /api/smile-design → api.anthropic.com`);
     if (ANTHROPIC_KEY === 'YOUR_API_KEY_HERE') {
       console.log(`\n⚠️  No API key set! Run with:`);
       console.log(`   ANTHROPIC_API_KEY=sk-ant-... node proxy.js\n`);
     } else {
       console.log(`   API key: ${ANTHROPIC_KEY.slice(0, 14)}...\n`);
     }
   });