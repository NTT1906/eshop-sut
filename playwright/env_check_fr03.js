const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const outDir = path.resolve(__dirname, '../tests/FR03');
const screenshotDir = path.join(outDir, 'screenshots');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function collectInputs(page) {
  return page.locator('input, button').evaluateAll((elements) =>
    elements.map((el, index) => {
      const label =
        el.closest('div')?.querySelector('label')?.innerText?.trim() ||
        el.innerText?.trim() ||
        el.getAttribute('aria-label') ||
        '';

      return {
        index: index + 1,
        tagName: el.tagName.toLowerCase(),
        label,
        type: el.getAttribute('type') || '',
        required: el.hasAttribute('required'),
        minLength: el.getAttribute('minlength'),
        maxLength: el.getAttribute('maxlength'),
        pattern: el.getAttribute('pattern'),
        text: el.innerText?.trim() || '',
      };
    }),
  );
}

(async () => {
  ensureDir(screenshotDir);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const email = `fr03.env.${Date.now()}@example.com`;
  const password = 'Password1!';
  const result = {
    feature: 'FR-03 - Forgot Password and Password Reset',
    frontendUrl: 'http://localhost:5173/forgot-password',
    backendUrl: 'http://localhost:3000',
    generatedUserEmail: email,
    checks: [],
  };

  try {
    const registerResponse = await page.request.post('http://localhost:3000/api/register', {
      data: {
        name: 'FR03 ENV User',
        email,
        password,
      },
    });
    result.checks.push({
      name: 'Create black-box test account through public register API',
      status: registerResponse.status(),
      ok: registerResponse.ok(),
    });

    await page.goto(result.frontendUrl, { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(screenshotDir, 'ENV-forgot-password-step1.png'),
      fullPage: true,
    });
    result.step1 = {
      title: await page.locator('h2').innerText(),
      controls: await collectInputs(page),
      screenshot: 'tests/FR03/screenshots/ENV-forgot-password-step1.png',
    };

    await page.locator('input').first().fill(email);
    await page.getByRole('button', { name: 'Lấy mã OTP' }).click();
    await page.locator('text=Mã OTP của bạn là:').waitFor({ timeout: 5000 });
    await page.screenshot({
      path: path.join(screenshotDir, 'ENV-forgot-password-step2.png'),
      fullPage: true,
    });
    result.step2 = {
      visibleOtpMessage: await page.locator('text=Mã OTP của bạn là:').innerText(),
      controls: await collectInputs(page),
      screenshot: 'tests/FR03/screenshots/ENV-forgot-password-step2.png',
    };
    result.checks.push({
      name: 'Navigate from step 1 to step 2 after OTP request',
      ok: true,
    });
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(outDir, 'ENV-01-ui-state.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
})();
