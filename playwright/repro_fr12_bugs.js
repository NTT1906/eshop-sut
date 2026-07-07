const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TEST_DIR = path.join(ROOT, "tests", "FR12");
const API = "http://localhost:3000/api";
const runId = Date.now();

fs.mkdirSync(TEST_DIR, { recursive: true });

async function requestJson(method, endpoint, { token, rawAuth, body, rawBody } = {}) {
  const headers = {};
  if (rawAuth !== undefined) headers.Authorization = rawAuth;
  else if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined || rawBody !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(`${API}${endpoint}`, {
    method,
    headers,
    body: rawBody !== undefined ? rawBody : body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let parsed = text;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }
  return {
    method,
    endpoint,
    status: response.status,
    ok: response.ok,
    body: parsed,
    bodySummary: Array.isArray(parsed) ? `array(${parsed.length})` : String(JSON.stringify(parsed) || parsed).slice(0, 260),
  };
}

async function registerAndLogin(email, password, name) {
  await requestJson("POST", "/register", { body: { name, email, password } });
  return requestJson("POST", "/login", { body: { email, password } });
}

async function findUserByEmail(adminToken, email) {
  const users = await requestJson("GET", "/admin/users", { token: adminToken });
  return Array.isArray(users.body) ? users.body.find((u) => u.email === email) : null;
}

async function findProductByName(name) {
  const products = await requestJson("GET", "/products");
  return Array.isArray(products.body) ? products.body.find((p) => p.name === name) : null;
}

async function main() {
  const normalEmail = `fr12.repro.normal.${runId}@example.com`;
  const normalPassword = "Password123!";
  const normalLogin = await registerAndLogin(normalEmail, normalPassword, "FR12 Repro Normal");
  const adminLogin = await requestJson("POST", "/login", {
    body: { email: "admin@eshop.com", password: "Admin123!" },
  });
  const normalToken = normalLogin.body?.token;
  const adminToken = adminLogin.body?.token;

  const categories = await requestJson("GET", "/categories");
  const categoryId = Array.isArray(categories.body) && categories.body[0] ? categories.body[0].id : 1;
  const order = await requestJson("POST", "/checkout", {
    token: normalToken,
    body: { total_amount: 50000, shipping_address: `FR12 repro ${runId}` },
  });
  const orderId = order.body?.orderId || 1;

  const victimEmail = `fr12.repro.victim.${runId}@example.com`;
  await registerAndLogin(victimEmail, "Password123!", "FR12 Repro Victim");
  const victim = await findUserByEmail(adminToken, victimEmail);

  const productName = `FR12 repro product ${runId}`;
  const adminProductCreate = await requestJson("POST", "/products", {
    token: adminToken,
    body: { name: productName, price: 10000, description: "x", imageUrl: "", category_id: categoryId },
  });
  const product = await findProductByName(productName);

  const checks = [
    {
      bugId: "BUG-001",
      name: "Normal user token can read admin user list",
      result: await requestJson("GET", "/admin/users", { token: normalToken }),
      expected: "401 or 403",
    },
    {
      bugId: "BUG-001",
      name: "Normal user token can delete a user through admin endpoint",
      result: await requestJson("DELETE", `/admin/users/${victim?.id || 99999999}`, { token: normalToken }),
      expected: "401 or 403 and victim remains",
    },
    {
      bugId: "BUG-001",
      name: "Normal user token can update admin order status",
      result: await requestJson("PUT", `/admin/orders/${orderId}/status`, {
        token: normalToken,
        body: { status: "confirmed" },
      }),
      expected: "401 or 403",
    },
    {
      bugId: "BUG-001",
      name: "Normal user token can import products through admin endpoint",
      result: await requestJson("POST", "/admin/import-products", {
        token: normalToken,
        body: { products: [{ name: `FR12 repro import ${runId}`, price: 10000, description: "x", imageUrl: "", category_id: categoryId }] },
      }),
      expected: "401 or 403",
    },
    {
      bugId: "BUG-001",
      name: "Normal user token can read coupons",
      result: await requestJson("GET", "/coupons", { token: normalToken }),
      expected: "401 or 403",
    },
    {
      bugId: "BUG-001",
      name: "Normal user token can create coupon through admin endpoint",
      result: await requestJson("POST", "/admin/coupons", {
        token: normalToken,
        body: { code: `RNU${String(runId).slice(-6)}`, type: "percent", discount_value: 10, min_order_amount: 0, expired_at: "2027-01-31", max_uses_per_user: 1 },
      }),
      expected: "401 or 403",
    },
    {
      bugId: "BUG-002",
      name: "Basic authorization scheme with admin token is accepted",
      result: await requestJson("GET", "/admin/users", { rawAuth: `Basic ${adminToken}` }),
      expected: "401 or 403",
    },
    {
      bugId: "BUG-003",
      name: "Normal user token can create product",
      result: await requestJson("POST", "/products", {
        token: normalToken,
        body: { name: `FR12 repro normal product ${runId}`, price: 10000, description: "x", imageUrl: "", category_id: categoryId },
      }),
      expected: "401 or 403",
    },
    {
      bugId: "BUG-003",
      name: "Unauthenticated request can delete product",
      result: await requestJson("DELETE", `/products/${product?.id || adminProductCreate.body?.id || 1}`),
      expected: "401 or 403",
    },
    {
      bugId: "BUG-003",
      name: "Normal user token can create category",
      result: await requestJson("POST", "/categories", {
        token: normalToken,
        body: { name: `FR12 repro normal category ${runId}` },
      }),
      expected: "401 or 403",
    },
    {
      bugId: "BUG-004",
      name: "Malformed JSON is parsed before access denial on admin coupon endpoint",
      result: await requestJson("POST", "/admin/coupons", {
        token: normalToken,
        rawBody: "{invalid-json",
      }),
      expected: "401 or 403 without HTML stack trace",
    },
    {
      bugId: "BUG-005",
      name: "Product update accepts non-numeric ID",
      result: await requestJson("PUT", "/products/not-a-number", {
        token: adminToken,
        body: { name: "Bad ID", price: 10000, description: "x", imageUrl: "", category_id: categoryId },
      }),
      expected: "400 or 404; no update",
    },
    {
      bugId: "BUG-005",
      name: "Product update accepts nonexistent numeric ID",
      result: await requestJson("PUT", "/products/99999999", {
        token: adminToken,
        body: { name: "Missing ID", price: 10000, description: "x", imageUrl: "", category_id: categoryId },
      }),
      expected: "404; no update",
    },
    {
      bugId: "BUG-005",
      name: "Product create accepts missing required body",
      result: await requestJson("POST", "/products", {
        token: adminToken,
        body: {},
      }),
      expected: "400; no product created",
    },
  ];

  const output = {
    feature: "FR-12 - Access Control",
    runId,
    createdNormalUser: normalEmail,
    adminLoginStatus: adminLogin.status,
    normalLoginStatus: normalLogin.status,
    checks,
  };
  fs.writeFileSync(path.join(TEST_DIR, "BUG-01-repro.json"), JSON.stringify(output, null, 2));
  console.log(JSON.stringify({
    runId,
    checks: checks.length,
    unexpectedSuccesses: checks.filter((c) => c.result.status >= 200 && c.result.status < 300).map((c) => `${c.bugId}: ${c.name} -> ${c.result.status}`),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
