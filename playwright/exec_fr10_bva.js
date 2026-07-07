const fs = require('fs');
const path = require('path');

const BACKEND = 'http://127.0.0.1:3000';
const outDir = path.resolve(__dirname, '../tests/FR10');
const runId = Date.now();

function pass(actual, evidence = {}) {
  return { status: 'Pass', actual, evidence };
}

function fail(actual, evidence = {}) {
  return { status: 'Fail', actual, evidence };
}

async function request(method, url, token, body) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const res = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let parsed;
  try {
    parsed = await res.json();
  } catch {
    parsed = { raw: await res.text().catch(() => '') };
  }
  return { status: res.status, ok: res.ok, body: parsed };
}

async function createUser(label) {
  const email = `fr10.bva.${label}.${runId}@example.com`;
  const password = `Start123!${label}`;
  const register = await request('POST', `${BACKEND}/api/register`, null, {
    name: `FR10 BVA ${label}`,
    email,
    password,
  });
  if (!register.ok) throw new Error(`Could not register ${label}: ${JSON.stringify(register)}`);
  const login = await request('POST', `${BACKEND}/api/login`, null, { email, password });
  if (!login.ok) throw new Error(`Could not login ${label}: ${JSON.stringify(login)}`);
  return { email, password, token: login.body.token, user: login.body.user };
}

async function loginAdmin() {
  const login = await request('POST', `${BACKEND}/api/login`, null, {
    email: 'admin@eshop.com',
    password: 'Admin123!',
  });
  if (!login.ok) throw new Error(`Could not login admin: ${JSON.stringify(login)}`);
  return { token: login.body.token, user: login.body.user };
}

async function createOrder(userToken, label) {
  const res = await request('POST', `${BACKEND}/api/checkout`, userToken, {
    total_amount: 100000 + Math.floor(Math.random() * 10000),
    shipping_address: `FR10 BVA ${label} address ${runId}`,
  });
  if (!res.ok) throw new Error(`Could not create order ${label}: ${JSON.stringify(res)}`);
  return res.body.orderId;
}

async function updateStatus(adminToken, orderId, status) {
  return request('PUT', `${BACKEND}/api/admin/orders/${orderId}/status`, adminToken, { status });
}

async function setOrderStatus(adminToken, orderId, targetStatus) {
  const steps = {
    pending: [],
    confirmed: ['confirmed'],
    shipping: ['confirmed', 'shipping'],
    delivered: ['confirmed', 'shipping', 'delivered'],
    canceled: ['canceled'],
  }[targetStatus];
  if (!steps) throw new Error(`Unknown target status ${targetStatus}`);
  const transitions = [];
  for (const step of steps) {
    transitions.push(await updateStatus(adminToken, orderId, step));
  }
  return transitions;
}

async function makeOrder(userToken, adminToken, status, label) {
  const orderId = await createOrder(userToken, label);
  const transitions = await setOrderStatus(adminToken, orderId, status);
  return { orderId, status, transitions };
}

async function getOrder(orderId) {
  return request('GET', `${BACKEND}/api/orders/${orderId}`, null);
}

async function getStatus(orderId) {
  const res = await getOrder(orderId);
  return res.body && res.body.status;
}

async function cancelOrder(token, orderIdPath) {
  return request('PUT', `${BACKEND}/api/orders/${orderIdPath}/cancel`, token);
}

async function adminStatus(token, orderIdPath, status) {
  return request('PUT', `${BACKEND}/api/admin/orders/${orderIdPath}/status`, token, { status });
}

function isRejected(res) {
  return !res.ok && res.status >= 400;
}

async function run() {
  fs.mkdirSync(outDir, { recursive: true });
  const results = [];
  const userA = await createUser('usera');
  const admin = await loginAdmin();

  async function userOrder(status, label) {
    return makeOrder(userA.token, admin.token, status, label);
  }

  async function adminOrder(status, label) {
    return makeOrder(userA.token, admin.token, status, label);
  }

  async function add(tcId, expected, ok, actual, evidence = {}) {
    results.push({ tcId, expected, ...(ok ? pass(actual, evidence) : fail(actual, evidence)) });
  }

  {
    const order = await userOrder('pending', 'bva001');
    const res = await cancelOrder(userA.token, order.orderId);
    const finalStatus = await getStatus(order.orderId);
    await add(
      'BVA-TC001',
      'Cancel succeeds for the first generated valid positive own order ID.',
      res.ok && finalStatus === 'canceled',
      `orderId=${order.orderId}; HTTP ${res.status}; finalStatus=${finalStatus}.`,
    );
  }

  {
    const order = await userOrder('confirmed', 'bva002');
    const res = await cancelOrder(userA.token, order.orderId);
    const finalStatus = await getStatus(order.orderId);
    await add(
      'BVA-TC002',
      'Cancel succeeds for the adjacent generated positive own order ID.',
      res.ok && finalStatus === 'canceled',
      `orderId=${order.orderId}; HTTP ${res.status}; finalStatus=${finalStatus}.`,
    );
  }

  for (const [tcId, orderIdPath, expected] of [
    ['BVA-TC003', '0', 'Cancel with orderId 0 is rejected.'],
    ['BVA-TC004', '-1', 'Cancel with orderId -1 is rejected.'],
    ['BVA-TC005', '999999', 'Cancel with high nonexistent orderId is rejected.'],
  ]) {
    const res = await cancelOrder(userA.token, orderIdPath);
    await add(tcId, expected, isRejected(res), `HTTP ${res.status}; body=${JSON.stringify(res.body)}.`);
  }

  for (const [tcId, startStatus, expectedFinal, expected] of [
    ['BVA-TC006', 'pending', 'canceled', 'Registered user can cancel own pending order.'],
    ['BVA-TC007', 'confirmed', 'canceled', 'Registered user can cancel own confirmed order.'],
  ]) {
    const order = await userOrder(startStatus, tcId.toLowerCase());
    const res = await cancelOrder(userA.token, order.orderId);
    const finalStatus = await getStatus(order.orderId);
    await add(tcId, expected, res.ok && finalStatus === expectedFinal, `HTTP ${res.status}; finalStatus=${finalStatus}.`);
  }

  {
    const order = await userOrder('shipping', 'bva008');
    const res = await cancelOrder(userA.token, order.orderId);
    const finalStatus = await getStatus(order.orderId);
    const safe = (res.ok && finalStatus === 'canceled') || (isRejected(res) && finalStatus === 'shipping');
    await add(
      'BVA-TC008',
      'Shipping cancel either succeeds or is rejected without inconsistent state.',
      safe,
      `HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`,
    );
  }

  for (const [tcId, status, expected] of [
    ['BVA-TC009', 'canceled', 'Direct cancel on canceled order rejects or no-ops and remains canceled.'],
    ['BVA-TC010', 'delivered', 'Direct cancel on delivered order rejects and remains delivered.'],
  ]) {
    const order = await userOrder(status, tcId.toLowerCase());
    const res = await cancelOrder(userA.token, order.orderId);
    const finalStatus = await getStatus(order.orderId);
    await add(tcId, expected, isRejected(res) && finalStatus === status, `HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`);
  }

  for (const [tcId, startStatus, targetStatus, expectedFinal, expected] of [
    ['BVA-TC011', 'pending', 'confirmed', 'confirmed', 'Admin pending -> confirmed succeeds.'],
    ['BVA-TC012', 'pending', 'canceled', 'canceled', 'Admin pending -> canceled succeeds.'],
    ['BVA-TC014', 'confirmed', 'shipping', 'shipping', 'Admin confirmed -> shipping succeeds.'],
    ['BVA-TC015', 'confirmed', 'canceled', 'canceled', 'Admin confirmed -> canceled succeeds.'],
    ['BVA-TC017', 'shipping', 'delivered', 'delivered', 'Admin shipping -> delivered succeeds.'],
  ]) {
    const order = await adminOrder(startStatus, tcId.toLowerCase());
    const res = await updateStatus(admin.token, order.orderId, targetStatus);
    const finalStatus = await getStatus(order.orderId);
    await add(tcId, expected, res.ok && finalStatus === expectedFinal, `HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`);
  }

  for (const [tcId, startStatus, targetStatus, expectedFinal, expected] of [
    ['BVA-TC013', 'confirmed', 'pending', 'confirmed', 'Admin confirmed -> pending is rejected or fails safely.'],
    ['BVA-TC016', 'shipping', 'confirmed', 'shipping', 'Admin shipping -> confirmed is rejected or fails safely.'],
    ['BVA-TC018', 'delivered', 'delivered', 'delivered', 'Admin delivered -> delivered is rejected or no-ops.'],
    ['BVA-TC020', 'pending', 'returned', 'pending', 'Admin pending -> returned is rejected.'],
  ]) {
    const order = await adminOrder(startStatus, tcId.toLowerCase());
    const res = await updateStatus(admin.token, order.orderId, targetStatus);
    const finalStatus = await getStatus(order.orderId);
    await add(tcId, expected, isRejected(res) && finalStatus === expectedFinal, `HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`);
  }

  {
    const order = await adminOrder('canceled', 'bva019');
    const res = await updateStatus(admin.token, order.orderId, 'delivered');
    const finalStatus = await getStatus(order.orderId);
    const safe = (res.ok && finalStatus === 'delivered') || (isRejected(res) && finalStatus === 'canceled');
    await add(
      'BVA-TC019',
      'Canceled -> delivered either succeeds or is rejected without inconsistent state.',
      safe,
      `HTTP ${res.status}; body=${JSON.stringify(res.body)}; finalStatus=${finalStatus}.`,
    );
  }

  results.sort((a, b) => a.tcId.localeCompare(b.tcId));
  const summary = {
    feature: 'FR-10 - Order State Machine',
    runId,
    executedAt: new Date().toISOString(),
    backendUrl: BACKEND,
    total: results.length,
    passed: results.filter((r) => r.status === 'Pass').length,
    failed: results.filter((r) => r.status === 'Fail').length,
    notExecuted: 0,
    results,
  };

  fs.writeFileSync(path.join(outDir, 'bva-execution-results.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
