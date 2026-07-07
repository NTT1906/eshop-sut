const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const FRONTEND_WEB = 'http://localhost:5173';
const FRONTEND_ADMIN = 'http://localhost:5174';
const BACKEND = 'http://localhost:3000';
const outDir = path.resolve(__dirname, '../tests/FR10');
const screenshotDir = path.join(outDir, 'screenshots');
const runId = Date.now();

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function apiLogin(request, email, password) {
  const res = await request.post(`${BACKEND}/api/login`, { data: { email, password } });
  const body = await res.json();
  return { status: res.status(), ok: res.ok(), token: body.token, user: body.user, body };
}

async function createUser(request) {
  const email = `fr10.env.${runId}@example.com`;
  const password = 'Test1234!';
  const res = await request.post(`${BACKEND}/api/register`, {
    data: { name: 'FR10 ENV User', email, password },
  });
  return { email, password, status: res.status(), ok: res.ok() };
}

async function createOrder(request, token, total, address) {
  const res = await request.post(`${BACKEND}/api/checkout`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { total_amount: total, shipping_address: address },
  });
  const body = await res.json();
  return { status: res.status(), ok: res.ok(), orderId: body.orderId, body };
}

async function updateStatus(request, adminToken, orderId, status) {
  const res = await request.put(`${BACKEND}/api/admin/orders/${orderId}/status`, {
    headers: { Authorization: `Bearer ${adminToken}` },
    data: { status },
  });
  let body = {};
  try {
    body = await res.json();
  } catch {
    body = {};
  }
  return { status: res.status(), ok: res.ok(), body };
}

async function transitionOrder(request, adminToken, orderId, targetStatus) {
  const steps = {
    pending: [],
    confirmed: ['confirmed'],
    shipping: ['confirmed', 'shipping'],
    delivered: ['confirmed', 'shipping', 'delivered'],
    canceled: ['canceled'],
  }[targetStatus];

  const results = [];
  for (const status of steps) {
    results.push(await updateStatus(request, adminToken, orderId, status));
  }
  return results;
}

async function collectTableState(page) {
  return page.locator('table tbody tr').evaluateAll((rows) =>
    rows.map((row) => {
      const cells = [...row.querySelectorAll('td')].map((td) => td.innerText.trim());
      const buttons = [...row.querySelectorAll('button')].map((button) => button.innerText.trim());
      return { cells, buttons };
    }),
  );
}

(async () => {
  ensureDir(screenshotDir);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const request = context.request;
  const result = {
    feature: 'FR-10 - Order State Machine',
    frontendWebUrl: FRONTEND_WEB,
    frontendAdminUrl: FRONTEND_ADMIN,
    backendUrl: BACKEND,
    checks: [],
    testData: { runId, orders: [] },
  };

  try {
    const testUser = await createUser(request);
    result.testData.user = { email: testUser.email, status: testUser.status, ok: testUser.ok };
    const userLogin = await apiLogin(request, testUser.email, testUser.password);
    const adminLogin = await apiLogin(request, 'admin@eshop.com', 'Admin123!');
    result.checks.push({
      name: 'Registered user login through public API',
      status: userLogin.status,
      ok: userLogin.ok,
    });
    result.checks.push({
      name: 'Admin login through public API',
      status: adminLogin.status,
      ok: adminLogin.ok,
    });

    const statuses = ['pending', 'confirmed', 'shipping', 'canceled', 'delivered'];
    for (const status of statuses) {
      const created = await createOrder(
        request,
        userLogin.token,
        100000 + statuses.indexOf(status) * 10000,
        `FR10 ${status} address ${runId}`,
      );
      const transitions = await transitionOrder(request, adminLogin.token, created.orderId, status);
      result.testData.orders.push({
        orderId: created.orderId,
        targetStatus: status,
        createStatus: created.status,
        createOk: created.ok,
        transitions,
      });
    }

    await page.addInitScript((token) => {
      localStorage.setItem('token', token);
    }, userLogin.token);
    await page.goto(`${FRONTEND_WEB}/profile`, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Lịch sử đơn hàng', { timeout: 5000 });
    result.registeredUser = {
      url: page.url(),
      screenshot: 'tests/FR10/screenshots/ENV-registered-user-orders.png',
      rows: await collectTableState(page),
    };
    await page.screenshot({
      path: path.join(screenshotDir, 'ENV-registered-user-orders.png'),
      fullPage: true,
    });

    const adminPage = await context.newPage();
    await adminPage.addInitScript((token) => {
      localStorage.setItem('adminToken', token);
    }, adminLogin.token);
    await adminPage.goto(FRONTEND_ADMIN, { waitUntil: 'networkidle' });
    await adminPage.getByText('Đơn hàng', { exact: true }).click();
    await adminPage.waitForSelector('text=Quản lý Đơn hàng', { timeout: 5000 });
    result.admin = {
      url: adminPage.url(),
      screenshot: 'tests/FR10/screenshots/ENV-admin-orders.png',
      rows: await collectTableState(adminPage),
    };
    await adminPage.screenshot({
      path: path.join(screenshotDir, 'ENV-admin-orders.png'),
      fullPage: true,
    });
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(outDir, 'ENV-01-ui-state.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
})();
