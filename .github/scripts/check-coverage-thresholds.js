const coverage = require('../../coverage/coverage-summary.json');
const vitestConfig = require('../../vitest.config.ts');

const summary = coverage.total;
const thresholds = vitestConfig.default.test.coverage.thresholds;

let failed = false;
const errors = [];
const leftBracket = `*${' '.repeat(3)}`;
const rightBracket = `${' '.repeat(3)}*`;
const warnMessage =
  'This is only a warn. In the future, you will not be able to push to github until the thresholds are updated.';

function formatErrorsWithAlignedStars(error, isSecondline = false) {
  const totalWidth = warnMessage.length;
  const spaces = totalWidth - error.length - (isSecondline ? 4 : 0);
  return `${leftBracket}${isSecondline ? '\t' : ''}${error}${' '.repeat(spaces)}${rightBracket}`;
}

// Example usage:

for (const key of ['branches', 'functions', 'lines', 'statements']) {
  const current = summary[key].pct;
  const threshold = thresholds[key];
  if (current > threshold) {
    errors.push(
      formatErrorsWithAlignedStars(`Coverage for ${key} (${current}%) is above the threshold (${threshold}%).`)
    );
    errors.push(
      formatErrorsWithAlignedStars(
        `Please update test.coverage.thresholds.${key} in vitest.config.ts to ---> ${current} <---`,
        true
      )
    );
    errors.push(`${leftBracket}${' '.repeat(warnMessage.length)}${rightBracket}`);
    failed = true;
  }
}

if (failed) {
  const stars = '*'.repeat(warnMessage.length + 8);
  console.log('\n\nCongratulations! You have successfully run the coverage check and added tests.');
  console.log('\n\nThe vitest.config.ts file is not in sync with your new test additions.');
  console.log('Please update test.coverage.thresholds in vitest.config.ts.');
  console.log('You will need to commit again once you have updated the vitest.config.ts file.');
  console.log('This is only necessary until we hit 100% coverage.');
  console.log(`\n\n${stars}`);
  errors.forEach((err) => {
    console.error(err);
  });
  console.log(`${stars}`);
  console.log(`\n\n${stars}`);
  console.log(`${leftBracket}${' '.repeat(warnMessage.length)}${rightBracket}`);
  console.log(`${leftBracket}${warnMessage}${rightBracket}`);
  console.log(`${leftBracket}${' '.repeat(warnMessage.length)}${rightBracket}`);
  console.log(`${stars}\n\n`);
}
