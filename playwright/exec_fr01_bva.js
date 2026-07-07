const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = path.join(__dirname, '../tests/FR01/screenshots');

fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

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

  await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle' });
  const inputs = page.locator('input');
  await inputs.nth(0).fill(name);
  await inputs.nth(1).fill(email);
  await inputs.nth(2).fill(password);

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${tc}-before.png`), fullPage: true });

  await page.locator('button[type="submit"], button:has-text("Đăng Ký")').click();
  await page.waitForTimeout(1500);

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${tc}-after.png`), fullPage: true });

  const bodyText = await page.locator('body').innerText();
  await page.close();
  return { apiResponse, apiBody, bodyText };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  const testCases = [
    { tc: 'BVA-TC001', name: 'Nguyen Van BVA1', email: 'bva01@example.com', password: 'Pas1!Aa',   desc: 'Password min-1 (7 chars) — expect rejected' },
    { tc: 'BVA-TC002', name: 'Nguyen Van BVA2', email: 'bva02@example.com', password: 'Pas1!Aab',  desc: 'Password at min (8 chars) — expect accepted' },
    { tc: 'BVA-TC003', name: 'Nguyen Van BVA3', email: 'bva03@example.com', password: 'Pas1!Aabc', desc: 'Password min+1 (9 chars) — expect accepted' },
  ];

  for (const t of testCases) {
    console.log(`Running ${t.tc}: ${t.desc}`);
    try {
      const result = await runTest(browser, t.tc, t.name, t.email, t.password);
      results.push({ ...t, ...result, error: null });
      console.log(`  API: ${result.apiResponse ? result.apiResponse.status : 'no API call intercepted'}`);
      console.log(`  Body snippet: ${result.bodyText.substring(0, 120).replace(/\n/g, ' ')}`);
    } catch (err) {
      results.push({ ...t, apiResponse: null, apiBody: null, bodyText: '', error: err.message });
      console.log(`  ERROR: ${err.message}`);
    }
  }

  await browser.close();

  fs.writeFileSync(
    path.join(__dirname, '../tests/FR01/bva-execution-results.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\nDone. Results saved to tests/FR01/bva-execution-results.json');
})();
