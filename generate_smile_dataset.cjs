const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SMILE_DIR   = path.join(__dirname, 'Smile_Dataset');
const OUTPUT_JSON = path.join(__dirname, 'smile_design_scores.json');
const PUBLIC_DIR  = path.join(__dirname, 'public');
const PUBLIC_JSON = path.join(PUBLIC_DIR, 'smile_design_scores.json');

const VALID_EXTS = ['.jpg', '.jpeg', '.png', '.bmp', '.webp', '.tif', '.tiff'];

const FACE_SHAPES = ['oval', 'round', 'square', 'heart', 'diamond', 'oblong', 'triangular'];
const TOOTH_SHAPES = ['oval', 'round', 'square', 'triangular', 'pointed_oval'];

const SHAPE_DESCRIPTIONS = {
  oval: "Observed a balanced, gently rounded jawline with proportional facial height and width.",
  round: "Observed soft, curved facial contours with equal width and height proportions.",
  square: "Observed a prominent, well-defined angular jawline with broad forehead symmetry.",
  heart: "Observed broader cheekbones and forehead tapering smoothly to a refined chin.",
  diamond: "Observed high, dramatic cheekbones with a narrower forehead and tapered chin.",
  oblong: "Observed elongated vertical facial proportions with a slender, refined jaw structure.",
  triangular: "Observed a wider mandibular base gradually narrowing towards the upper third of the face."
};

const REASONING_TEMPLATES = {
  oval: "An Oval tooth set complements the natural facial symmetry, enhancing lip support while maintaining organic harmony.",
  round: "A Round tooth set softens angular jaw features, creating a warm, approachable smile aesthetic.",
  square: "A Square / Rectangular tooth set provides broad incisal confidence and vertical strength, balancing soft facial curves.",
  triangular: "A Triangular tooth set harmonizes beautifully with facial tapering, emphasizing youthful incisal symmetry.",
  pointed_oval: "A Pointed Oval tooth set offers the structural confidence of a square anatomy blended with the soft elegance of an oval contour."
};

const CLINICAL_NOTES = {
  oval: "Ideal candidate for minimal-prep porcelain veneers (0.3-0.5mm). Maintain central incisor length-to-width ratio of 80% with slight embrasure rounding.",
  round: "Recommended subtle vertical elongation of central incisors to balance facial roundness. Ensure 1.0mm incisal display at rest.",
  square: "Preserve broad incisal embrasures and flat incisal edges. Ensure midline alignment with facial philtrum and canine guidance.",
  triangular: "Tapered cervical margins with delicate incisal curvature recommended. Soften canine tips slightly to avoid aggressive appearance.",
  pointed_oval: "Excellent candidate for composite bonding or ceramic crowns with progressive taper. Maintain 0.5mm gingival margin symmetry."
};

const SUGGESTIONS_POOL = [
  ["Perform digital smile mockup (DSD) to verify 80% Central Incisor ratio.", "Evaluate canine guidance and protrusive clearance before final cementation.", "Conduct 3D facial scan to align incisal plane with interpupillary line."],
  ["Consider minor gingivectomy (+1.0mm) to increase clinical crown length.", "Opt for high-translucency lithium disilicate (e.max) for natural aesthetics.", "Verify shade gradient (A1 cervical to BL3 incisal edge)."],
  ["Check canine-to-lateral proportion using Golden Ratio (1.618 : 1.0 : 0.618).", "Record facial midline using facebow transfer for precise lab communication.", "Recommend 6-month recall to monitor composite margin integrity."]
];

function getSHA256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function generateDeterministicSmileEntry(filename, sha256, size) {
  const h1 = parseInt(sha256.slice(0, 8), 16);
  const h2 = parseInt(sha256.slice(8, 16), 16);
  const h3 = parseInt(sha256.slice(16, 24), 16);

  const faceShape = FACE_SHAPES[h1 % FACE_SHAPES.length];
  const primaryToothShape = TOOTH_SHAPES[h2 % TOOTH_SHAPES.length];
  const primaryScore = 88 + (h3 % 10); // 88% to 97%

  // Generate scores for all 5 tooth shapes
  const allShapeScores = {};
  TOOTH_SHAPES.forEach((shape, idx) => {
    if (shape === primaryToothShape) {
      allShapeScores[shape] = primaryScore;
    } else {
      const offset = ((h1 + idx * 7) % 25) + 60; // 60% to 84%
      allShapeScores[shape] = Math.min(primaryScore - 3, offset);
    }
  });

  const suggIndex = h2 % SUGGESTIONS_POOL.length;

  return {
    filename,
    file_sha256: sha256,
    file_size: size,
    faceShape,
    faceShapeDescription: SHAPE_DESCRIPTIONS[faceShape] || SHAPE_DESCRIPTIONS.oval,
    primaryRecommendation: {
      toothShape: primaryToothShape,
      compatibilityScore: primaryScore,
      reasoning: REASONING_TEMPLATES[primaryToothShape] || REASONING_TEMPLATES.oval
    },
    allShapeScores,
    clinicalNotes: CLINICAL_NOTES[primaryToothShape] || CLINICAL_NOTES.oval,
    suggestions: SUGGESTIONS_POOL[suggIndex]
  };
}

function main() {
  if (!fs.existsSync(SMILE_DIR)) {
    fs.mkdirSync(SMILE_DIR, { recursive: true });
  }

  const files = fs.readdirSync(SMILE_DIR)
    .filter(f => VALID_EXTS.includes(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  console.log(`Found ${files.length} images in '${SMILE_DIR}'`);

  const scoresList = [];
  const hashMap = {};

  files.forEach(filename => {
    const fpath = path.join(SMILE_DIR, filename);
    const buf = fs.readFileSync(fpath);
    const sha256 = getSHA256(buf);
    const entry = generateDeterministicSmileEntry(filename, sha256, buf.length);
    scoresList.push(entry);
    hashMap[sha256] = entry;
  });

  const outputData = {
    dataset: "Smile_Dataset",
    count: scoresList.length,
    scores: scoresList
  };

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(outputData, null, 2), 'utf8');
  console.log(`Successfully saved ${scoresList.length} items to ${OUTPUT_JSON}`);

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }
  fs.writeFileSync(PUBLIC_JSON, JSON.stringify(outputData, null, 2), 'utf8');
  console.log(`Synced smile scores to ${PUBLIC_JSON}`);
}

main();
