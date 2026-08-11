// Test Runner Script for HW04 - Automation Testing
// Student ID: 23127053
// Run by: 23127053

const { execSync } = require('child_process');
const path = require('path');

const PLAYWRIGHT_DIR = path.join(__dirname);

console.log('========================================');
console.log('HW04 - Automation Testing');
console.log('Student ID: 23127053');
console.log('Features: FR-05, FR-09, FR-16');
console.log('========================================\n');

const browsers = ['chromium', 'firefox', 'webkit'];
const testFiles = [
  'tests/fr05-product-listing.spec.js',
  'tests/fr09-discount-coupons.spec.js',
  'tests/fr16-product-import.spec.js'
];

async function runTests() {
  for (const browser of browsers) {
    console.log(`\nRunning tests on ${browser}...`);
    console.log('='.repeat(50));
    
    for (const testFile of testFiles) {
      console.log(`\nRunning ${testFile}...`);
      try {
        const command = `npx playwright test ${testFile} --project=${browser} --reporter=html`;
        execSync(command, { 
          cwd: PLAYWRIGHT_DIR, 
          stdio: 'inherit',
          timeout: 300000
        });
        console.log(`✓ ${testFile} completed on ${browser}`);
      } catch (error) {
        console.log(`✗ ${testFile} failed on ${browser}`);
        console.log(error.message);
      }
    }
  }
  
  console.log('\n========================================');
  console.log('All tests completed!');
  console.log('Reports generated in: ../reports/');
  console.log('========================================');
}

runTests().catch(console.error);
