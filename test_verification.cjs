const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'obturation_scores.json');
const imagesDir = path.join(__dirname, 'Images 2');

if (!fs.existsSync(jsonPath)) {
  console.error("FAIL: obturation_scores.json does not exist");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Count in JSON: ${data.count}`);
console.log(`Scores array length: ${data.scores ? data.scores.length : 0}`);

const imageFiles = fs.readdirSync(imagesDir).filter(f => f.match(/\.(jpg|jpeg|png|bmp|tif|tiff)$/i));
console.log(`Image files in Images 2 directory: ${imageFiles.length}`);

let missingCount = 0;
let invalidScoreCount = 0;

data.scores.forEach((item, idx) => {
  if (!item.filename) {
    console.error(`Item ${idx} missing filename`);
    missingCount++;
  }
  if (item.total_score === undefined || item.total_score !== item.obturation_score) {
    console.error(`Item ${item.filename} total_score mismatch`);
    invalidScoreCount++;
  }
});

console.log(`Missing count: ${missingCount}`);
console.log(`Invalid score count: ${invalidScoreCount}`);

if (data.count === 650 && imageFiles.length === 650 && missingCount === 0 && invalidScoreCount === 0) {
  console.log("SUCCESS: All 650 images are present and scored in obturation_scores.json!");
} else {
  console.error("VERIFICATION FAILED");
  process.exit(1);
}
