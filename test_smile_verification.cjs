const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'smile_design_scores.json');
const datasetDir = path.join(__dirname, 'Smile_Dataset');

if (!fs.existsSync(jsonPath)) {
  console.error("FAIL: smile_design_scores.json does not exist");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Count in JSON: ${data.count}`);
console.log(`Scores array length: ${data.scores ? data.scores.length : 0}`);

const imageFiles = fs.readdirSync(datasetDir).filter(f => f.match(/\.(jpg|jpeg|png|bmp|webp|tif|tiff)$/i));
console.log(`Image files in Smile_Dataset directory: ${imageFiles.length}`);

let missingCount = 0;
let invalidShapeCount = 0;

const validToothShapes = ['oval', 'round', 'square', 'triangular', 'pointed_oval', 'tapered'];

data.scores.forEach((item, idx) => {
  if (!item.filename) {
    console.error(`Item ${idx} missing filename`);
    missingCount++;
  }
  const shape = item.primaryRecommendation ? item.primaryRecommendation.toothShape : null;
  if (!shape || !validToothShapes.includes(shape)) {
    console.error(`Item ${item.filename} invalid tooth shape: ${shape}`);
    invalidShapeCount++;
  }
});

console.log(`Missing count: ${missingCount}`);
console.log(`Invalid shape count: ${invalidShapeCount}`);

if (data.count === imageFiles.length && missingCount === 0 && invalidShapeCount === 0) {
  console.log("SUCCESS: All smile dataset images are indexed and mapped to valid tooth set shapes in smile_design_scores.json!");
} else {
  console.error("VERIFICATION FAILED");
  process.exit(1);
}
