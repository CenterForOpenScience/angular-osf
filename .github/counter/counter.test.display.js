const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'counter.txt');

try {
  // Read current value
  let current = 0;
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8').trim();
    current = parseInt(content, 10) || 0;
  }

  console.info(`\n\nTotal test runs: ${current}\n\n`);
} catch (err) {
  console.error('Error updating counter:', err.message);
}
