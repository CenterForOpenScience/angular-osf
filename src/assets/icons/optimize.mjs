import * as fs from 'fs';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const sourceDirectory = './source';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const removeFillAttribute = (svgString) => {
  return svgString.replace(/ fill="[^"]*"/g, '');
};

fs.promises
  .readdir(path.join(__dirname, sourceDirectory))
  .then((files) => {
    files.forEach((file) => {
      if (file.endsWith('.svg')) {
        console.log(file);
        const filePath = path.join(__dirname, sourceDirectory, file);
        const command = `picosvg ${filePath}`;

        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing picosvg for ${filePath}: ${error.message}`);
            return;
          }
          const modifiedSVG = removeFillAttribute(stdout);
          fs.writeFileSync(filePath, modifiedSVG);
        });
      }
    });
  })
  .finally(() => {
    console.log('Optimise Done');
  })
  .catch((err) => {
    console.error(`Error reading directory: ${err}`);
  });
