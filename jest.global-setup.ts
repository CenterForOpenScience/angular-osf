import { execSync } from 'child_process';

export default async function globalSetup(): Promise<void> {
  try {
    execSync('node .github/counter/counter.test.increment.js', { stdio: 'inherit' });
  } catch (err) {
    console.error('Test counter failed to increment:', err);
  }
}
