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

  // Increment
  const updated = current + 1;

  // Write back
  fs.writeFileSync(filePath, String(updated));
  console.info(`\n\nCounter updated: ${current} → ${updated}\n\n`);
} catch (err) {
  console.error('Error updating counter:', err.message);
}
