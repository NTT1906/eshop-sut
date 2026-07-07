const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Capture registration page
  await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle' });
  await page.screenshot({
    path: '../tests/FR01/screenshots/ENV-register-page.png',
    fullPage: true
  });
  console.log('Register page screenshot saved.');

  // Capture homepage for reference
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.screenshot({
    path: '../tests/FR01/screenshots/ENV-homepage.png',
    fullPage: true
  });
  console.log('Homepage screenshot saved.');

  await browser.close();
})();
