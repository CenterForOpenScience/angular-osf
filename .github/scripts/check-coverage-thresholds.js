const fs = require('fs');
const { execSync } = require('child_process');
const coverage = require('../../coverage/coverage-summary.json');
const jestConfig = require('../../jest.config.js');

const summary = coverage.total;
const thresholds = jestConfig.coverageThreshold.global;

let failed = false;
const errors = [];
for (const key of ['branches', 'functions', 'lines', 'statements']) {
  const current = summary[key].pct;
  const threshold = thresholds[key];
  if (current > threshold) {
    errors.push(
      `Coverage for ${key} (${current}%) is above the threshold (${threshold}%).\n\tPlease update the coverageThreshold.global.${key} in the jest.config.js to ${current}!`
    )
    failed = true;
  }
}

if (failed) {
  execSync('clear', { stdio: 'inherit' });
  console.log('\n\nCongratulations! You have successfully run the coverage check and added tests.');
  console.log('\n\nThe jest.config.js file is not insync with your new test additions.');
  console.log('Please update the coverage thresholds in jest.config.js.');
  console.log('You will need to commit again once you have updated the jst.config.js file.');
  console.log('This is only necessary until we hit 100% coverage.\n\n');
  errors.forEach(err => console.error(`${err}\n`));
  process.exit(1);
}