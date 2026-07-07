const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const FRONTEND = 'http://localhost:5173';
const BACKEND = 'http://localhost:3000';
const outDir = path.resolve(__dirname, '../tests/FR03');
const screenshotDir = path.join(outDir, 'screenshots');
const runId = Date.now();

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function pass(actual, evidence = {}) {
  return { status: 'Pass', actual, evidence };
}

function fail(actual, evidence = {}) {
  return { status: 'Fail', actual, evidence };
}

async function screenshot(page, tcId) {
  const rel = `tests/FR03/screenshots/${tcId}-after.png`;
  await page.screenshot({ path: path.join(screenshotDir, `${tcId}-after.png`), fullPage: true });
  return rel;
}

async function createAccount(request, label) {
  const email = `fr03.bva.${label}.${runId}@example.com`;
  const password = `Initial1!${label}`;
  const res = await request.post(`${BACKEND}/api/register`, {
    data: { name: `FR03 BVA ${label}`, email, password },
  });
  return { email, password, status: res.status(), ok: res.ok() };
}

async function loginStatus(request, email, password) {
  const res = await request.post(`${BACKEND}/api/login`, { data: { email, password } });
  return { status: res.status(), ok: res.ok() };
}

async function gotoForgot(page) {
  await page.goto(`${FRONTEND}/forgot-password`, { waitUntil: 'networkidle' });
}

async function collectDialogs(page, action, waitMs = 700) {
  const dialogs = [];
  const handler = async (dialog) => {
    dialogs.push(dialog.message());
    await dialog.accept();
  };
  page.on('dialog', handler);
  try {
    await action();
    await page.waitForTimeout(waitMs);
  } finally {
    page.off('dialog', handler);
  }
  return dialogs;
}

async function requestOtpViaUi(page, email) {
  await gotoForgot(page);
  await page.locator('input').first().fill(email);
  const dialogs = await collectDialogs(page, async () => {
    await page.getByRole('button', { name: 'Lấy mã OTP' }).click();
  }, 800);
  const visible = (await page.locator('text=Mã OTP của bạn là:').count()) > 0;
  let token = '';
  if (visible) {
    const msg = await page.locator('text=Mã OTP của bạn là:').innerText();
    token = msg.match(/(\d+)/)?.[1] || '';
  }
  return { dialogs, visible, token };
}

async function submitResetViaUi(page, token, newPassword) {
  const inputs = page.locator('input');
  await inputs.nth(0).fill(token);
  await inputs.nth(1).fill(newPassword);
  const dialogs = await collectDialogs(page, async () => {
    await page.getByRole('button', { name: 'Đặt lại mật khẩu' }).click();
  }, 900);
  return { dialogs, url: page.url() };
}

async function runResetCase(page, request, tcId, label, tokenMode, newPassword, shouldReset, expected) {
  const account = await createAccount(request, label);
  const otp = await requestOtpViaUi(page, account.email);
  let token = otp.token;
  if (tokenMode !== 'issued') token = tokenMode;

  const reset = await submitResetViaUi(page, token, newPassword);
  const oldLogin = await loginStatus(request, account.email, account.password);
  const newLogin = await loginStatus(request, account.email, newPassword);
  const shot = await screenshot(page, tcId);

  const actual =
    `otpVisible=${otp.visible}; tokenUsed=${token}; dialogs=${JSON.stringify(reset.dialogs)}; ` +
    `oldLogin=${oldLogin.status}; newPasswordLogin=${newLogin.status}.`;

  if (shouldReset) {
    return {
      tcId,
      expected,
      ...(otp.visible && newLogin.ok && !oldLogin.ok ? pass(actual, { screenshot: shot }) : fail(actual, { screenshot: shot })),
    };
  }

  return {
    tcId,
    expected,
    ...(oldLogin.ok && !newLogin.ok && reset.dialogs.length > 0 ? pass(actual, { screenshot: shot }) : fail(actual, { screenshot: shot })),
  };
}

async function run() {
  ensureDir(screenshotDir);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  const request = context.request;
  const results = [];

  try {
    const cases = [
      ['BVA-TC001', 'tc001', 'issued', 'Aa1!aaa', false, 'Password reset rejected because password length is 7.'],
      ['BVA-TC002', 'tc002', 'issued', 'Aa1!aaaa', true, 'Password reset accepted at password length 8 if password rule is correctly implemented.'],
      ['BVA-TC003', 'tc003', 'issued', 'Aa1!aaaaa', true, 'Password reset accepted at password length 9 if password rule is correctly implemented.'],
      ['BVA-TC004', 'tc004', 'issued', 'password1!', false, 'Password reset rejected because uppercase count is 0.'],
      ['BVA-TC005', 'tc005', 'issued', 'Password1!', true, 'Password reset accepted with uppercase/digit/special count at minimum.'],
      ['BVA-TC006', 'tc006', 'issued', 'PASSWORD1!', false, 'Password reset rejected because lowercase count is 0.'],
      ['BVA-TC007', 'tc007', 'issued', 'PASSWORd1!', true, 'Password reset accepted with lowercase count at minimum.'],
      ['BVA-TC008', 'tc008', 'issued', 'Password!!', false, 'Password reset rejected because digit count is 0.'],
      ['BVA-TC009', 'tc009', 'issued', 'Password1!', true, 'Password reset accepted with digit count at minimum.'],
      ['BVA-TC010', 'tc010', 'issued', 'Password1', false, 'Password reset rejected because special-character count is 0.'],
      ['BVA-TC011', 'tc011', 'issued', 'Password1!', true, 'Password reset accepted with special-character count at minimum.'],
      ['BVA-TC012', 'tc012', '123', 'Aa1!aaaa', false, 'Reset rejected or fails safely for token length 3.'],
      ['BVA-TC013', 'tc013', 'issued', 'Aa1!aaaa', true, 'Reset accepted with actual issued 4-digit token and valid password.'],
      ['BVA-TC014', 'tc014', '12345', 'Aa1!aaaa', false, 'Reset rejected or fails safely for token length 5.'],
      ['BVA-TC015', 'tc015', '123456', 'Aa1!aaaa', false, 'Reset rejected or fails safely for token length 6 unless API accepts 6-digit tokens.'],
    ];

    for (const [tcId, label, tokenMode, password, shouldReset, expected] of cases) {
      results.push(await runResetCase(page, request, tcId, label, tokenMode, password, shouldReset, expected));
    }
  } finally {
    await browser.close();
  }

  const summary = {
    runId,
    executedAt: new Date().toISOString(),
    feature: 'FR-03 - Forgot Password and Password Reset',
    testType: 'BVA',
    results,
    totals: {
      total: results.length,
      passed: results.filter((r) => r.status === 'Pass').length,
      failed: results.filter((r) => r.status === 'Fail').length,
    },
  };

  fs.writeFileSync(path.join(outDir, 'bva-execution-results.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
