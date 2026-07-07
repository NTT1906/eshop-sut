const fs = require('fs');
const path = require('path');

const BACKEND = 'http://127.0.0.1:3000';
const outDir = path.resolve(__dirname, '../tests/FR10');
const runId = Date.now();

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
  const email = `fr10.bug001.${label}.${runId}@example.com`;
  const password = `Start123!${label}`;
  await request('POST', `${BACKEND}/api/register`, null, {
    name: `FR10 BUG001 ${label}`,
    email,
    password,
  });
  const login = await request('POST', `${BACKEND}/api/login`, null, { email, password });
  return { email, password, token: login.body.token, login };
}

async function main() {
  const user = await createUser('user');
  const adminLogin = await request('POST', `${BACKEND}/api/login`, null, {
    email: 'admin@eshop.com',
    password: 'Admin123!',
  });

  const checkout = await request('POST', `${BACKEND}/api/checkout`, user.token, {
    total_amount: 123456,
    shipping_address: `FR10 BUG001 address ${runId}`,
  });
  const orderId = checkout.body.orderId;

  const before = await request('GET', `${BACKEND}/api/orders/${orderId}`, null);
  const nonAdminUpdate = await request(
    'PUT',
    `${BACKEND}/api/admin/orders/${orderId}/status`,
    user.token,
    { status: 'confirmed' },
  );
  const after = await request('GET', `${BACKEND}/api/orders/${orderId}`, null);

  const controlOrder = await request('POST', `${BACKEND}/api/checkout`, user.token, {
    total_amount: 123457,
    shipping_address: `FR10 BUG001 control ${runId}`,
  });
  const unauthenticatedControl = await request(
    'PUT',
    `${BACKEND}/api/admin/orders/${controlOrder.body.orderId}/status`,
    null,
    { status: 'confirmed' },
  );
  const invalidTokenControl = await request(
    'PUT',
    `${BACKEND}/api/admin/orders/${controlOrder.body.orderId}/status`,
    'invalid.fr10.bug001.token',
    { status: 'confirmed' },
  );

  const result = {
    bugId: 'BUG-001',
    feature: 'FR-10 - Order State Machine',
    runId,
    backendUrl: BACKEND,
    reproduced: nonAdminUpdate.status === 200 && after.body.status === 'confirmed',
    user: { email: user.email, loginStatus: user.login.status },
    adminControl: { loginStatus: adminLogin.status, hasToken: Boolean(adminLogin.body.token) },
    order: {
      id: orderId,
      beforeStatus: before.body.status,
      nonAdminUpdate,
      afterStatus: after.body.status,
    },
    controls: {
      unauthenticatedControl,
      invalidTokenControl,
    },
  };

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'BUG-001-repro.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
