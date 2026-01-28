const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/app/extensions.config.ts');
const defaultPath = path.join(__dirname, '../src/app/extensions.config.default.ts');
const customPath = process.env.EXTENSIONS_CONFIG;

if (customPath) {
  const resolvedPath = path.resolve(customPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`EXTENSIONS_CONFIG file not found: ${resolvedPath}`);
  }
  fs.copyFileSync(resolvedPath, targetPath);
  console.log(`Extensions config: ${resolvedPath}`);
} else if (!fs.existsSync(targetPath)) {
  fs.copyFileSync(defaultPath, targetPath);
  console.log(`Extensions config: ${defaultPath} (default)`);
}
