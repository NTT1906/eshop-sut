const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const FRONTEND_WEB = 'http://127.0.0.1:5173';
const FRONTEND_ADMIN = 'http://127.0.0.1:5174';
const BACKEND = 'http://127.0.0.1:3000';
const outDir = path.resolve(__dirname, '../tests/FR10');
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

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return { raw: await res.text().catch(() => '') };
  }
}

async function api(request, method, url, token, data) {
  const options = {};
  if (token) options.headers = { Authorization: `Bearer ${token}` };
  if (data !== undefined) options.data = data;
  const res = await request[method](url, options);
  return { status: res.status(), ok: res.ok(), body: await safeJson(res) };
}

async function createUser(request, label) {
  const email = `fr10.${label}.${runId}@example.com`;
  const password = `Start123!${label}`;
  const res = await api(request, 'post', `${BACKEND}/api/register`, null, {
    name: `FR10 ${label}`,
    email,
    password,
  });
  if (!res.ok) throw new Error(`Could not create ${label}: ${JSON.stringify(res)}`);
  const login = await api(request, 'post', `${BACKEND}/api/login`, null, { email, password });
  if (!login.ok) throw new Error(`Could not log in ${label}: ${JSON.stringify(login)}`);
  return { email, password, token: login.body.token, user: login.body.user };
}

async function loginAdmin(request) {
  const login = await api(request, 'post', `${BACKEND}/api/login`, null, {
    email: 'admin@eshop.com',
    password: 'Admin123!',
  });
  if (!login.ok) throw new Error(`Could not log in admin: ${JSON.stringify(login)}`);
  return { token: login.body.token, user: login.body.user };
}

async function createOrder(request, userToken, label) {
  const res = await api(request, 'post', `${BACKEND}/api/checkout`, userToken, {
    total_amount: 100000 + Math.floor(Math.random() * 10000),
    shipping_address: `FR10 ${label} address ${runId}`,
  });
  if (!res.ok) throw new Error(`Could not create order ${label}: ${JSON.stringify(res)}`);
  return res.body.orderId;
}

async function updateStatus(request, adminToken, orderId, status) {
  return api(request, 'put', `${BACKEND}/api/admin/orders/${orderId}/status`, adminToken, { status });
}

async function setOrderStatus(request, adminToken, orderId, target) {
  const steps = {
    pending: [],
    confirmed: ['confirmed'],
    shipping: ['confirmed', 'shipping'],
    delivered: ['confirmed', 'shipping', 'delivered'],
    canceled: ['canceled'],
  }[target];
  if (!steps) throw new Error(`Unknown target state ${target}`);
  const transitions = [];
  for (const status of steps) {
    transitions.push(await updateStatus(request, adminToken, orderId, status));
  }
  return transitions;
}

async function makeOrder(request, adminToken, userToken, status, label) {
  const orderId = await createOrder(request, userToken, label);
  const transitions = await setOrderStatus(request, adminToken, orderId, status);
  return { orderId, status, transitions };
}

async function getOrder(request, orderId) {
  return api(request, 'get', `${BACKEND}/api/orders/${orderId}`, null);
}

async function getStatus(request, orderId) {
  const res = await getOrder(request, orderId);
  return res.body && res.body.status;
}

async function cancelOrder(request, token, orderIdPath) {
  return api(request, 'put', `${BACKEND}/api/orders/${orderIdPath}/cancel`, token);
}

async function adminStatusPath(request, token, orderIdPath, body) {
  return api(request, 'put', `${BACKEND}/api/admin/orders/${orderIdPath}/status`, token, body);
}

async function screenshotPage(page, tcId) {
  const rel = `tests/FR10/screenshots/${tcId}-after.png`;
  await page.screenshot({ path: path.join(screenshotDir, `${tcId}-after.png`), fullPage: true });
  return rel;
}

async function findRowByOrderId(page, orderId) {
  return page.locator('table tbody tr').evaluateAll((rows, wanted) => {
    const marker = `#${wanted}`;
    const row = rows.find((tr) => tr.innerText.includes(marker));
    if (!row) return null;
    return {
      text: row.innerText.trim(),
      cells: [...row.querySelectorAll('td')].map((td) => td.innerText.trim()),
      buttons: [...row.querySelectorAll('button')].map((button) => button.innerText.trim()),
    };
  }, String(orderId));
}

async function captureUserOrder(context, token, orderId, tcId) {
  const page = await context.newPage();
  await page.addInitScript((authToken) => localStorage.setItem('token', authToken), token);
  await page.goto(`${FRONTEND_WEB}/profile`, { waitUntil: 'networkidle' });
  await page.waitForSelector('table tbody tr', { timeout: 5000 }).catch(() => {});
  const row = await findRowByOrderId(page, orderId);
  const shot = await screenshotPage(page, tcId);
  await page.close();
  return { row, screenshot: shot };
}

async function captureAdminOrder(context, token, orderId, tcId) {
  const page = await context.newPage();
  await page.addInitScript((authToken) => localStorage.setItem('adminToken', authToken), token);
  await page.goto(FRONTEND_ADMIN, { waitUntil: 'networkidle' });
  await page.getByText('Don hang', { exact: true }).click().catch(async () => {
    await page.getByText('Đơn hàng', { exact: true }).click();
  });
  await page.waitForSelector('table tbody tr', { timeout: 5000 }).catch(() => {});
  const row = await findRowByOrderId(page, orderId);
  const shot = await screenshotPage(page, tcId);
  await page.close();
  return { row, screenshot: shot };
}

function isRejected(res) {
  return !res.ok && res.status >= 400;
}

function terminalUnchanged(actual, expected) {
  return actual === expected;
}

async function run() {
  ensureDir(screenshotDir);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const request = context.request;
  const results = [];

  try {
    const userA = await createUser(request, 'usera');
    const userB = await createUser(request, 'userb');
    const admin = await loginAdmin(request);
    const invalidToken = 'invalid.fr10.token';

    async function userOrder(status, label) {
      return makeOrder(request, admin.token, userA.token, status, label);
    }

    async function adminOrder(status, label) {
      return makeOrder(request, admin.token, userA.token, status, label);
    }

    {
      const order = await userOrder('pending', 'tc001');
      const res = await cancelOrder(request, userA.token, order.orderId);
      const finalStatus = await getStatus(request, order.orderId);
      const ui = await captureUserOrder(context, userA.token, order.orderId, 'DT-TC001');
      const ok = res.ok && finalStatus === 'canceled' && ui.row;
      results.push({
        tcId: 'DT-TC001',
        expected: 'Cancel own pending order succeeds and status becomes canceled.',
        ...(ok
          ? pass(`HTTP ${res.status}; finalStatus=${finalStatus}; UI row=${ui.row.text}.`, { screenshot: ui.screenshot })
          : fail(`HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}; UI row=${JSON.stringify(ui.row)}.`, { screenshot: ui.screenshot })),
      });
    }

    {
      const order = await userOrder('confirmed', 'tc002');
      const res = await cancelOrder(request, userA.token, order.orderId);
      const finalStatus = await getStatus(request, order.orderId);
      const ok = res.ok && finalStatus === 'canceled';
      results.push({
        tcId: 'DT-TC002',
        expected: 'Cancel own confirmed order succeeds and status becomes canceled.',
        ...(ok ? pass(`HTTP ${res.status}; finalStatus=${finalStatus}.`) : fail(`HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`)),
      });
    }

    {
      const order = await userOrder('shipping', 'tc003');
      const beforeUi = await captureUserOrder(context, userA.token, order.orderId, 'DT-TC003');
      const res = await cancelOrder(request, userA.token, order.orderId);
      const finalStatus = await getStatus(request, order.orderId);
      const safe = (res.ok && finalStatus === 'canceled') || (isRejected(res) && finalStatus === 'shipping');
      results.push({
        tcId: 'DT-TC003',
        expected: 'Confirmation-needed: shipping cancellation either succeeds or is rejected without inconsistent state.',
        ...(safe
          ? pass(`Before UI buttons=${JSON.stringify(beforeUi.row && beforeUi.row.buttons)}; HTTP ${res.status}; finalStatus=${finalStatus}.`, { screenshot: beforeUi.screenshot })
          : fail(`Before UI row=${JSON.stringify(beforeUi.row)}; HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`, { screenshot: beforeUi.screenshot })),
      });
    }

    {
      const order = await userOrder('canceled', 'tc004');
      const ui = await captureUserOrder(context, userA.token, order.orderId, 'DT-TC004');
      const res = await cancelOrder(request, userA.token, order.orderId);
      const finalStatus = await getStatus(request, order.orderId);
      const noButton = ui.row && ui.row.buttons.length === 0;
      const ok = noButton && isRejected(res) && finalStatus === 'canceled';
      results.push({
        tcId: 'DT-TC004',
        expected: 'Canceled order has no user cancel button; direct API rejects or no-ops and remains canceled.',
        ...(ok
          ? pass(`UI buttons=${JSON.stringify(ui.row.buttons)}; HTTP ${res.status}; finalStatus=${finalStatus}.`, { screenshot: ui.screenshot })
          : fail(`UI row=${JSON.stringify(ui.row)}; HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`, { screenshot: ui.screenshot })),
      });
    }

    {
      const order = await userOrder('delivered', 'tc005');
      const ui = await captureUserOrder(context, userA.token, order.orderId, 'DT-TC005');
      const res = await cancelOrder(request, userA.token, order.orderId);
      const finalStatus = await getStatus(request, order.orderId);
      const ok = ui.row && ui.row.buttons.length === 0 && isRejected(res) && finalStatus === 'delivered';
      results.push({
        tcId: 'DT-TC005',
        expected: 'Delivered order has no user cancel button; direct API rejects and remains delivered.',
        ...(ok
          ? pass(`UI buttons=${JSON.stringify(ui.row.buttons)}; HTTP ${res.status}; finalStatus=${finalStatus}.`, { screenshot: ui.screenshot })
          : fail(`UI row=${JSON.stringify(ui.row)}; HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`, { screenshot: ui.screenshot })),
      });
    }

    {
      const orderB = await makeOrder(request, admin.token, userB.token, 'pending', 'tc006-userb');
      const res = await cancelOrder(request, userA.token, orderB.orderId);
      const finalStatus = await getStatus(request, orderB.orderId);
      const ok = isRejected(res) && finalStatus === 'pending';
      results.push({
        tcId: 'DT-TC006',
        expected: "Cancel another user's order is rejected and target order remains unchanged.",
        ...(ok ? pass(`HTTP ${res.status}; finalStatus=${finalStatus}.`) : fail(`HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`)),
      });
    }

    {
      const res = await cancelOrder(request, userA.token, 999999);
      results.push({
        tcId: 'DT-TC007',
        expected: 'Cancel nonexistent order is rejected.',
        ...(isRejected(res) ? pass(`HTTP ${res.status}; body=${JSON.stringify(res.body)}.`) : fail(`HTTP ${res.status}; body=${JSON.stringify(res.body)}.`)),
      });
    }

    {
      const order = await userOrder('pending', 'tc008');
      const res = await cancelOrder(request, null, order.orderId);
      const finalStatus = await getStatus(request, order.orderId);
      const ok = isRejected(res) && finalStatus === 'pending';
      results.push({
        tcId: 'DT-TC008',
        expected: 'Cancel without session is rejected and order remains pending.',
        ...(ok ? pass(`HTTP ${res.status}; finalStatus=${finalStatus}.`) : fail(`HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`)),
      });
    }

    {
      const order = await userOrder('pending', 'tc009');
      const res = await cancelOrder(request, invalidToken, order.orderId);
      const finalStatus = await getStatus(request, order.orderId);
      const ok = isRejected(res) && finalStatus === 'pending';
      results.push({
        tcId: 'DT-TC009',
        expected: 'Cancel with invalid session is rejected and order remains pending.',
        ...(ok ? pass(`HTTP ${res.status}; finalStatus=${finalStatus}.`) : fail(`HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`)),
      });
    }

    for (const [tcId, orderIdPath, expected] of [
      ['DT-TC010', 'abc', 'Cancel with non-integer ID is rejected.'],
      ['DT-TC011', '%236', 'Cancel with UI-formatted #id is rejected.'],
      ['DT-TC012', '', 'Cancel with missing ID path is rejected or routed away.'],
      ['DT-TC013', '0', 'Cancel with zero ID is rejected.'],
    ]) {
      const urlPart = orderIdPath === '' ? '' : orderIdPath;
      const res = await cancelOrder(request, userA.token, urlPart);
      results.push({
        tcId,
        expected,
        ...(isRejected(res) ? pass(`HTTP ${res.status}; body=${JSON.stringify(res.body)}.`) : fail(`HTTP ${res.status}; body=${JSON.stringify(res.body)}.`)),
      });
    }

    async function adminTransitionCase(tcId, startStatus, targetStatus, expectedFinal, expectedText, evidenceUi = false) {
      const order = await adminOrder(startStatus, tcId.toLowerCase());
      const ui = evidenceUi ? await captureAdminOrder(context, admin.token, order.orderId, tcId) : null;
      const res = await updateStatus(request, admin.token, order.orderId, targetStatus);
      const finalStatus = await getStatus(request, order.orderId);
      const ok = res.ok && finalStatus === expectedFinal;
      results.push({
        tcId,
        expected: expectedText,
        ...(ok
          ? pass(`HTTP ${res.status}; finalStatus=${finalStatus}${ui ? `; UI buttons=${JSON.stringify(ui.row && ui.row.buttons)}` : ''}.`, ui ? { screenshot: ui.screenshot } : {})
          : fail(`HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}${ui ? `; UI row=${JSON.stringify(ui.row)}` : ''}.`, ui ? { screenshot: ui.screenshot } : {})),
      });
    }

    await adminTransitionCase('DT-TC014', 'pending', 'confirmed', 'confirmed', 'Admin pending -> confirmed succeeds.', true);
    await adminTransitionCase('DT-TC015', 'pending', 'canceled', 'canceled', 'Admin pending -> canceled succeeds.');
    await adminTransitionCase('DT-TC016', 'confirmed', 'shipping', 'shipping', 'Admin confirmed -> shipping succeeds.');
    await adminTransitionCase('DT-TC017', 'confirmed', 'canceled', 'canceled', 'Admin confirmed -> canceled succeeds.');
    await adminTransitionCase('DT-TC018', 'shipping', 'delivered', 'delivered', 'Admin shipping -> delivered succeeds.');

    {
      const order = await adminOrder('canceled', 'tc019');
      const ui = await captureAdminOrder(context, admin.token, order.orderId, 'DT-TC019');
      const res = await updateStatus(request, admin.token, order.orderId, 'delivered');
      const finalStatus = await getStatus(request, order.orderId);
      const safe = (res.ok && finalStatus === 'delivered') || (isRejected(res) && finalStatus === 'canceled');
      results.push({
        tcId: 'DT-TC019',
        expected: 'Confirmation-needed: canceled -> delivered either succeeds or is rejected without inconsistent state.',
        ...(safe
          ? pass(`UI buttons=${JSON.stringify(ui.row && ui.row.buttons)}; HTTP ${res.status}; finalStatus=${finalStatus}.`, { screenshot: ui.screenshot })
          : fail(`UI row=${JSON.stringify(ui.row)}; HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`, { screenshot: ui.screenshot })),
      });
    }

    {
      const order = await adminOrder('delivered', 'tc020');
      const ui = await captureAdminOrder(context, admin.token, order.orderId, 'DT-TC020');
      const res = await updateStatus(request, admin.token, order.orderId, 'delivered');
      const finalStatus = await getStatus(request, order.orderId);
      const ok = ui.row && ui.row.buttons.length === 0 && isRejected(res) && finalStatus === 'delivered';
      results.push({
        tcId: 'DT-TC020',
        expected: 'Delivered order has no admin action; same-current direct update rejects or no-ops and remains delivered.',
        ...(ok
          ? pass(`UI buttons=${JSON.stringify(ui.row.buttons)}; HTTP ${res.status}; finalStatus=${finalStatus}.`, { screenshot: ui.screenshot })
          : fail(`UI row=${JSON.stringify(ui.row)}; HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`, { screenshot: ui.screenshot })),
      });
    }

    for (const [tcId, startStatus, body, expectedFinal, expected] of [
      ['DT-TC021', 'confirmed', { status: 'pending' }, 'confirmed', 'Enum-valid pending target from confirmed is rejected or fails safely.'],
      ['DT-TC022', 'shipping', { status: 'confirmed' }, 'shipping', 'Enum-valid non-UI shipping -> confirmed is rejected.'],
      ['DT-TC023', 'pending', {}, 'pending', 'Missing status body is rejected.'],
      ['DT-TC024', 'pending', { status: '' }, 'pending', 'Empty status is rejected.'],
      ['DT-TC025', 'pending', { status: 123 }, 'pending', 'Non-string status is rejected.'],
      ['DT-TC026', 'pending', { status: 'returned' }, 'pending', 'Outside-enum status is rejected.'],
      ['DT-TC027', 'pending', { status: 'Delivered' }, 'pending', 'Wrong-case status is rejected.'],
    ]) {
      const order = await adminOrder(startStatus, tcId.toLowerCase());
      const res = await adminStatusPath(request, admin.token, order.orderId, body);
      const finalStatus = await getStatus(request, order.orderId);
      const ok = isRejected(res) && finalStatus === expectedFinal;
      results.push({
        tcId,
        expected,
        ...(ok ? pass(`HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`) : fail(`HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`)),
      });
    }

    {
      const order = await adminOrder('pending', 'tc028');
      const res = await updateStatus(request, null, order.orderId, 'confirmed');
      const finalStatus = await getStatus(request, order.orderId);
      const ok = isRejected(res) && finalStatus === 'pending';
      results.push({
        tcId: 'DT-TC028',
        expected: 'Admin update without session is rejected and order remains pending.',
        ...(ok ? pass(`HTTP ${res.status}; finalStatus=${finalStatus}.`) : fail(`HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`)),
      });
    }

    {
      const order = await adminOrder('pending', 'tc029');
      const res = await updateStatus(request, userA.token, order.orderId, 'confirmed');
      const finalStatus = await getStatus(request, order.orderId);
      const ok = isRejected(res) && finalStatus === 'pending';
      results.push({
        tcId: 'DT-TC029',
        expected: 'Authenticated non-admin user is rejected from admin status endpoint and order remains pending.',
        ...(ok ? pass(`HTTP ${res.status}; finalStatus=${finalStatus}.`) : fail(`HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`)),
      });
    }

    {
      const order = await adminOrder('pending', 'tc030');
      const res = await updateStatus(request, invalidToken, order.orderId, 'confirmed');
      const finalStatus = await getStatus(request, order.orderId);
      const ok = isRejected(res) && finalStatus === 'pending';
      results.push({
        tcId: 'DT-TC030',
        expected: 'Admin update with invalid token is rejected and order remains pending.',
        ...(ok ? pass(`HTTP ${res.status}; finalStatus=${finalStatus}.`) : fail(`HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`)),
      });
    }

    for (const [tcId, pathId, expected] of [
      ['DT-TC031', 'abc', 'Admin status update with non-integer ID is rejected.'],
      ['DT-TC032', '', 'Admin status update with missing ID path is rejected or routed away.'],
      ['DT-TC033', '0', 'Admin status update with zero ID is rejected.'],
    ]) {
      const res = await adminStatusPath(request, admin.token, pathId, { status: 'confirmed' });
      results.push({
        tcId,
        expected,
        ...(isRejected(res) ? pass(`HTTP ${res.status}; body=${JSON.stringify(res.body)}.`) : fail(`HTTP ${res.status}; body=${JSON.stringify(res.body)}.`)),
      });
    }

    const summary = {
      feature: 'FR-10 - Order State Machine',
      runId,
      executedAt: new Date().toISOString(),
      frontendWebUrl: FRONTEND_WEB,
      frontendAdminUrl: FRONTEND_ADMIN,
      backendUrl: BACKEND,
      total: results.length,
      passed: results.filter((r) => r.status === 'Pass').length,
      failed: results.filter((r) => r.status === 'Fail').length,
      notExecuted: 0,
      results,
    };

    fs.writeFileSync(path.join(outDir, 'execution-results.json'), JSON.stringify(summary, null, 2));
    console.log(JSON.stringify(summary, null, 2));
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
