const fs = require('fs');
const path = require('path');
const { config } = require('process');

const configPath = path.join(__dirname, '../src/assets/config/config.json');
const templatePath = path.join(__dirname, '../src/assets/config/template.json');

if (!fs.existsSync(configPath)) {
  console.log('[INFO] config.json not found. Copying from template.json...');
  fs.copyFileSync(templatePath, configPath);
} else {
  console.log('[INFO] config.json already exists.');
}
