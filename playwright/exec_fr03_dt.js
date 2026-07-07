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
  const email = `fr03.${label}.${runId}@example.com`;
  const password = `Initial1!${label}`;
  const res = await request.post(`${BACKEND}/api/register`, {
    data: { name: `FR03 ${label}`, email, password },
  });
  return { email, password, status: res.status(), ok: res.ok() };
}

async function loginStatus(request, email, password) {
  const res = await request.post(`${BACKEND}/api/login`, {
    data: { email, password },
  });
  return { status: res.status(), ok: res.ok() };
}

async function gotoForgot(page) {
  await page.goto(`${FRONTEND}/forgot-password`, { waitUntil: 'networkidle' });
}

async function clickAndCollectDialogs(page, action, waitMs = 700) {
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
  const dialogs = await clickAndCollectDialogs(page, async () => {
    await page.getByRole('button', { name: 'Lấy mã OTP' }).click();
  }, 1000);

  const otpVisible = await page.locator('text=Mã OTP của bạn là:').count();
  let token = null;
  if (otpVisible > 0) {
    const message = await page.locator('text=Mã OTP của bạn là:').innerText();
    const match = message.match(/(\d+)/);
    token = match ? match[1] : null;
  }
  return { dialogs, token, step2Visible: otpVisible > 0 };
}

async function submitResetViaUi(page, token, newPassword) {
  const inputs = page.locator('input');
  await inputs.nth(0).fill(token);
  await inputs.nth(1).fill(newPassword);
  const dialogs = await clickAndCollectDialogs(page, async () => {
    await page.getByRole('button', { name: 'Đặt lại mật khẩu' }).click();
  }, 1000);
  return {
    dialogs,
    url: page.url(),
    stillOnStep2: (await page.locator('text=Mã OTP của bạn là:').count()) > 0,
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
    {
      const account = await createAccount(request, 'tc001');
      const otp = await requestOtpViaUi(page, account.email);
      const reset = await submitResetViaUi(page, otp.token || '', 'StrongPass1!');
      const newLogin = await loginStatus(request, account.email, 'StrongPass1!');
      const oldLogin = await loginStatus(request, account.email, account.password);
      const shot = await screenshot(page, 'DT-TC001');
      const ok = otp.step2Visible && newLogin.ok && !oldLogin.ok;
      results.push({
        tcId: 'DT-TC001',
        expected: 'OTP request succeeds; reset with valid token and strong password succeeds; new password works.',
        ...(
          ok
            ? pass(`OTP step succeeded and login with new password returned HTTP ${newLogin.status}.`, { screenshot: shot })
            : fail(`OTP step2Visible=${otp.step2Visible}; reset dialogs=${JSON.stringify(reset.dialogs)}; login new=${newLogin.status}; login old=${oldLogin.status}.`, { screenshot: shot })
        ),
      });
    }

    {
      await gotoForgot(page);
      await page.getByRole('button', { name: 'Lấy mã OTP' }).click();
      await page.waitForTimeout(500);
      const valid = await page.locator('input').first().evaluate((el) => el.validity.valueMissing);
      const shot = await screenshot(page, 'DT-TC002');
      results.push({
        tcId: 'DT-TC002',
        expected: 'Required-field validation prevents OTP request for empty email.',
        ...(valid ? pass('Browser required validation blocked empty email submission.', { screenshot: shot }) : fail('Empty email submission was not blocked by required validation.', { screenshot: shot })),
      });
    }

    {
      await gotoForgot(page);
      await page.locator('input').first().fill(`not.registered.${runId}@example.com`);
      const dialogs = await clickAndCollectDialogs(page, async () => {
        await page.getByRole('button', { name: 'Lấy mã OTP' }).click();
      }, 800);
      const step2 = (await page.locator('text=Mã OTP của bạn là:').count()) > 0;
      const shot = await screenshot(page, 'DT-TC003');
      results.push({
        tcId: 'DT-TC003',
        expected: 'Unregistered well-formed email is rejected and no token is produced.',
        ...(!step2 && dialogs.length > 0 ? pass(`Rejected with alert: ${dialogs.join(' | ')}`, { screenshot: shot }) : fail(`step2Visible=${step2}; dialogs=${JSON.stringify(dialogs)}`, { screenshot: shot })),
      });
    }

    {
      await gotoForgot(page);
      await page.locator('input').first().fill('not-an-email');
      const dialogs = await clickAndCollectDialogs(page, async () => {
        await page.getByRole('button', { name: 'Lấy mã OTP' }).click();
      }, 800);
      const step2 = (await page.locator('text=Mã OTP của bạn là:').count()) > 0;
      const shot = await screenshot(page, 'DT-TC004');
      results.push({
        tcId: 'DT-TC004',
        expected: 'Malformed email is rejected or fails safely without producing token.',
        ...(!step2 ? pass(`No token produced. Alert(s): ${dialogs.join(' | ') || 'none'}.`, { screenshot: shot }) : fail('Malformed email produced a reset token and advanced to step 2.', { screenshot: shot })),
      });
    }

    async function setupStep2(label) {
      const account = await createAccount(request, label);
      const otp = await requestOtpViaUi(page, account.email);
      return { account, otp };
    }

    {
      const { account } = await setupStep2('tc005');
      const inputs = page.locator('input');
      await inputs.nth(0).fill('');
      await inputs.nth(1).fill('StrongPass1!');
      await page.getByRole('button', { name: 'Đặt lại mật khẩu' }).click();
      await page.waitForTimeout(500);
      const missing = await inputs.nth(0).evaluate((el) => el.validity.valueMissing);
      const oldLogin = await loginStatus(request, account.email, account.password);
      const shot = await screenshot(page, 'DT-TC005');
      results.push({
        tcId: 'DT-TC005',
        expected: 'Required-field validation prevents reset for empty token.',
        ...(missing && oldLogin.ok ? pass(`Browser required validation blocked empty token; old login HTTP ${oldLogin.status}.`, { screenshot: shot }) : fail(`valueMissing=${missing}; oldLogin=${oldLogin.status}.`, { screenshot: shot })),
      });
    }

    async function invalidTokenCase(tcId, label, tokenValue) {
      const { account } = await setupStep2(label);
      const reset = await submitResetViaUi(page, tokenValue, 'StrongPass1!');
      const oldLogin = await loginStatus(request, account.email, account.password);
      const newLogin = await loginStatus(request, account.email, 'StrongPass1!');
      const shot = await screenshot(page, tcId);
      const tokenErrorObserved = reset.dialogs.some((m) => /otp|mã/i.test(m));
      return {
        account,
        result: {
          tcId,
          expected: 'Reset is rejected by the token domain under test and password remains unchanged.',
          ...(tokenErrorObserved && oldLogin.ok && !newLogin.ok
            ? pass(`Rejected with token-related alert: ${reset.dialogs.join(' | ')}; old login HTTP ${oldLogin.status}.`, { screenshot: shot })
            : fail(`Expected token-domain rejection, but actual dialogs=${JSON.stringify(reset.dialogs)}; oldLogin=${oldLogin.status}; newLogin=${newLogin.status}.`, { screenshot: shot })),
        },
      };
    }

    results.push((await invalidTokenCase('DT-TC006', 'tc006', '0000')).result);

    {
      const accountA = await createAccount(request, 'tc007a');
      const accountB = await createAccount(request, 'tc007b');
      await requestOtpViaUi(page, accountB.email);
      const tokenBText = await page.locator('text=Mã OTP của bạn là:').innerText();
      const tokenB = tokenBText.match(/(\d+)/)?.[1] || '';
      await requestOtpViaUi(page, accountA.email);
      const reset = await submitResetViaUi(page, tokenB, 'StrongPass1!');
      const oldLogin = await loginStatus(request, accountA.email, accountA.password);
      const newLogin = await loginStatus(request, accountA.email, 'StrongPass1!');
      const shot = await screenshot(page, 'DT-TC007');
      const tokenErrorObserved = reset.dialogs.some((m) => /otp|mã/i.test(m));
      results.push({
        tcId: 'DT-TC007',
        expected: 'Token issued for Account B is rejected when used with Account A.',
        ...(tokenErrorObserved && oldLogin.ok && !newLogin.ok
          ? pass(`Rejected with token-related alert: ${reset.dialogs.join(' | ')}; old login HTTP ${oldLogin.status}.`, { screenshot: shot })
          : fail(`Expected token/email mismatch rejection, but actual dialogs=${JSON.stringify(reset.dialogs)}; oldLogin=${oldLogin.status}; newLogin=${newLogin.status}.`, { screenshot: shot })),
      });
    }

    results.push((await invalidTokenCase('DT-TC008', 'tc008', 'abcd')).result);
    results.push((await invalidTokenCase('DT-TC009', 'tc009', '123456')).result);

    {
      const account = await createAccount(request, 'tc010');
      const reset = await request.post(`${BACKEND}/api/reset-password`, {
        data: { email: account.email, resetToken: '0000', newPassword: 'StrongPass1!' },
      });
      const oldLogin = await loginStatus(request, account.email, account.password);
      const newLogin = await loginStatus(request, account.email, 'StrongPass1!');
      results.push({
        tcId: 'DT-TC010',
        expected: 'API reset without prior OTP is rejected and password remains unchanged.',
        ...(reset.status() >= 400 && oldLogin.ok && !newLogin.ok
          ? pass(`API reset returned HTTP ${reset.status()}; old login HTTP ${oldLogin.status}; new login HTTP ${newLogin.status}.`, {})
          : fail(`API reset HTTP ${reset.status()}; oldLogin=${oldLogin.status}; newLogin=${newLogin.status}.`, {})),
      });
    }

    {
      const { account, otp } = await setupStep2('tc011');
      const inputs = page.locator('input');
      await inputs.nth(0).fill(otp.token || '');
      await inputs.nth(1).fill('');
      await page.getByRole('button', { name: 'Đặt lại mật khẩu' }).click();
      await page.waitForTimeout(500);
      const missing = await inputs.nth(1).evaluate((el) => el.validity.valueMissing);
      const oldLogin = await loginStatus(request, account.email, account.password);
      const shot = await screenshot(page, 'DT-TC011');
      results.push({
        tcId: 'DT-TC011',
        expected: 'Required-field validation prevents reset for empty new password.',
        ...(missing && oldLogin.ok ? pass(`Browser required validation blocked empty password; old login HTTP ${oldLogin.status}.`, { screenshot: shot }) : fail(`valueMissing=${missing}; oldLogin=${oldLogin.status}.`, { screenshot: shot })),
      });
    }

    async function invalidPasswordCase(tcId, label, password, expectedLabel) {
      const { account, otp } = await setupStep2(label);
      const reset = await submitResetViaUi(page, otp.token || '', password);
      const oldLogin = await loginStatus(request, account.email, account.password);
      const newLogin = await loginStatus(request, account.email, password);
      const shot = await screenshot(page, tcId);
      const weakAlert = reset.dialogs.some((m) => /mật khẩu|password|yếu/i.test(m));
      return {
        tcId,
        expected: `Password is rejected for ${expectedLabel}; password remains unchanged.`,
        ...(weakAlert && oldLogin.ok && !newLogin.ok
          ? pass(`Rejected with weak-password alert: ${reset.dialogs.join(' | ')}; old login HTTP ${oldLogin.status}.`, { screenshot: shot })
          : fail(`Expected weak-password rejection, but dialogs=${JSON.stringify(reset.dialogs)}; oldLogin=${oldLogin.status}; attemptedPasswordLogin=${newLogin.status}.`, { screenshot: shot })),
      };
    }

    results.push(await invalidPasswordCase('DT-TC012', 'tc012', 'Aa1!aaa', 'too short'));
    results.push(await invalidPasswordCase('DT-TC013', 'tc013', 'password1!', 'missing uppercase'));
    results.push(await invalidPasswordCase('DT-TC014', 'tc014', 'PASSWORD1!', 'missing lowercase'));
    results.push(await invalidPasswordCase('DT-TC015', 'tc015', 'Password!!', 'missing digit'));
    results.push(await invalidPasswordCase('DT-TC016', 'tc016', 'Password1', 'missing special character'));
  } finally {
    await browser.close();
  }

  const summary = {
    runId,
    executedAt: new Date().toISOString(),
    feature: 'FR-03 - Forgot Password and Password Reset',
    results,
    totals: {
      total: results.length,
      passed: results.filter((r) => r.status === 'Pass').length,
      failed: results.filter((r) => r.status === 'Fail').length,
    },
  };

  fs.writeFileSync(path.join(outDir, 'execution-results.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
