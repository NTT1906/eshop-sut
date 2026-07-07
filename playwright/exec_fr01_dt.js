const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '../tests/FR01/screenshots');

// Ensure screenshot dir exists
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

// Helper: fill and submit the registration form
async function fillForm(page, name, email, password) {
  await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle' });
  const inputs = page.locator('input');
  await inputs.nth(0).fill(name);
  await inputs.nth(1).fill(email);
  await inputs.nth(2).fill(password);
}

async function submitForm(page) {
  await page.locator('button[type="submit"], button:has-text("Đăng Ký")').click();
  await page.waitForTimeout(1500);
}

// Helper: capture API response by intercepting network
async function runTest(browser, tc, name, email, password) {
  const page = await browser.newPage();
  let apiResponse = null;
  let apiBody = null;

  page.on('response', async (response) => {
    if (response.url().includes('/api/register')) {
      apiResponse = { status: response.status(), url: response.url() };
      try { apiBody = await response.json(); } catch { apiBody = null; }
    }
  });

  await fillForm(page, name, email, password);

  // Screenshot before submit
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${tc}-before.png`), fullPage: true });

  await submitForm(page);

  // Screenshot after submit
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${tc}-after.png`), fullPage: true });

  // Collect visible error/success text
  const bodyText = await page.locator('body').innerText();

  await page.close();
  return { apiResponse, apiBody, bodyText };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  const testCases = [
    { tc: 'TC001', name: 'Nguyen Van A', email: 'testuser01@example.com', password: 'Password1!',  desc: 'All valid — happy path' },
    { tc: 'TC002', name: '',             email: 'testuser02@example.com', password: 'Password1!',  desc: 'Empty name' },
    { tc: 'TC003', name: 'Nguyen Van B', email: '',                        password: 'Password1!',  desc: 'Empty email' },
    { tc: 'TC004', name: 'Nguyen Van C', email: 'invalidemail',            password: 'Password1!',  desc: 'Email missing @' },
    { tc: 'TC005', name: 'Nguyen Van D', email: 'user@',                   password: 'Password1!',  desc: 'Email missing domain' },
    { tc: 'TC006', name: 'Nguyen Van E', email: '@example.com',            password: 'Password1!',  desc: 'Email missing local part' },
    { tc: 'TC007', name: 'Nguyen Van F', email: 'testuser01@example.com', password: 'Password1!',  desc: 'Duplicate email (TC001 account)' },
    { tc: 'TC008', name: 'Nguyen Van G', email: 'testuser08@example.com', password: '',             desc: 'Empty password' },
    { tc: 'TC009', name: 'Nguyen Van H', email: 'testuser09@example.com', password: 'Pass1!',      desc: 'Password too short (7 chars)' },
    { tc: 'TC010', name: 'Nguyen Van I', email: 'testuser10@example.com', password: 'password1!',  desc: 'Password missing uppercase' },
    { tc: 'TC011', name: 'Nguyen Van J', email: 'testuser11@example.com', password: 'PASSWORD1!',  desc: 'Password missing lowercase' },
    { tc: 'TC012', name: 'Nguyen Van K', email: 'testuser12@example.com', password: 'Password!!',  desc: 'Password missing digit' },
    { tc: 'TC013', name: 'Nguyen Van L', email: 'testuser13@example.com', password: 'Password1',   desc: 'Password missing special char' },
  ];

  for (const t of testCases) {
    console.log(`Running ${t.tc}: ${t.desc}`);
    try {
      const result = await runTest(browser, t.tc, t.name, t.email, t.password);
      results.push({ ...t, ...result, error: null });
      console.log(`  API: ${result.apiResponse ? result.apiResponse.status : 'no API call intercepted'}`);
      console.log(`  Body: ${JSON.stringify(result.apiBody)}`);
    } catch (err) {
      results.push({ ...t, apiResponse: null, apiBody: null, bodyText: '', error: err.message });
      console.log(`  ERROR: ${err.message}`);
    }
  }

  await browser.close();

  // Write results JSON for the report
  fs.writeFileSync(
    path.join(__dirname, '../tests/FR01/execution-results.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\nDone. Results saved to tests/FR01/execution-results.json');
})();
