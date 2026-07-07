const fs = require("fs");
const path = require("path");

const API = process.env.API_BASE_URL || "http://localhost:3000/api";
const OUT = path.resolve(__dirname, "../bva-execution-results.json");

async function request(method, endpoint, { token, body } = {}) {
  const headers = {};
  if (token !== undefined) headers.Authorization = token;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { status: res.status, ok: res.ok, json, text };
}

async function freshUser(runId) {
  const user = {
    name: `FR20 BVA ${runId}`,
    email: `fr20.bva.${runId}@example.com`,
    password: "Password123!",
  };
  const reg = await request("POST", "/register", { body: user });
  const login = await request("POST", "/login", {
    body: { email: user.email, password: user.password },
  });
  const token = login.json && login.json.token;
  return { user, reg, login, token };
}

async function main() {
  const runId = Date.now();
  const productsRes = await request("GET", "/products");
  const products = Array.isArray(productsRes.json) ? productsRes.json : [];
  if (products.length < 3) throw new Error("Need at least 3 seeded products.");

  const p1 = products[0];
  const p2 = products[1];
  const p3 = products[2];

  const cases = [
    {
      tcId: "BVA-TC001",
      expected: "selectedProductId minimum - 1 is rejected.",
      body: { id: 0, name: p1.name, price: p1.price, quantity: 1 },
      shouldPass: false,
    },
    {
      tcId: "BVA-TC002",
      expected: "selectedProductId minimum is accepted.",
      body: { id: p1.id, name: p1.name, price: p1.price, quantity: 1 },
      shouldPass: true,
    },
    {
      tcId: "BVA-TC003",
      expected: "selectedProductId minimum + 1 is accepted.",
      body: { id: p2.id, name: p2.name, price: p2.price, quantity: 1 },
      shouldPass: true,
    },
    {
      tcId: "BVA-TC004",
      expected: "selectedProductId nominal value is accepted.",
      body: { id: p3.id, name: p3.name, price: p3.price, quantity: 1 },
      shouldPass: true,
    },
    {
      tcId: "BVA-TC005",
      expected: "selectedQuantity minimum - 1 is rejected.",
      body: { id: p1.id, name: p1.name, price: p1.price, quantity: 0 },
      shouldPass: false,
    },
    {
      tcId: "BVA-TC006",
      expected: "selectedQuantity minimum is accepted.",
      body: { id: p1.id, name: p1.name, price: p1.price, quantity: 1 },
      shouldPass: true,
    },
    {
      tcId: "BVA-TC007",
      expected: "selectedQuantity minimum + 1 is accepted.",
      body: { id: p1.id, name: p1.name, price: p1.price, quantity: 2 },
      shouldPass: true,
    },
    {
      tcId: "BVA-TC008",
      expected: "selectedQuantity nominal value is accepted.",
      body: { id: p1.id, name: p1.name, price: p1.price, quantity: 3 },
      shouldPass: true,
    },
    {
      tcId: "BVA-TC009",
      expected: "apiCartItemPrice minimum - 1 is rejected.",
      body: { id: p1.id, name: p1.name, price: 0, quantity: 1 },
      shouldPass: false,
    },
    {
      tcId: "BVA-TC010",
      expected: "apiCartItemPrice minimum is accepted.",
      body: { id: p1.id, name: p1.name, price: 1, quantity: 1 },
      shouldPass: true,
    },
    {
      tcId: "BVA-TC011",
      expected: "apiCartItemPrice minimum + 1 is accepted.",
      body: { id: p1.id, name: p1.name, price: 2, quantity: 1 },
      shouldPass: true,
    },
    {
      tcId: "BVA-TC012",
      expected: "apiCartItemPrice nominal value is accepted.",
      body: { id: p1.id, name: p1.name, price: p1.price, quantity: 1 },
      shouldPass: true,
    },
  ];

  const results = [];
  const evidence = {
    apiBaseUrl: API,
    startedAt: new Date().toISOString(),
    products: [p1, p2, p3],
  };

  for (const test of cases) {
    const { token } = await freshUser(runId + results.length);
    const before = await request("GET", "/cart", { token: `Bearer ${token}` });
    const post = await request("POST", "/cart", { token: `Bearer ${token}`, body: test.body });
    const after = await request("GET", "/cart", { token: `Bearer ${token}` });
    const afterCart = Array.isArray(after.json) ? after.json : [];

    const accepted =
      post.status === 200 &&
      afterCart.length === 1 &&
      afterCart[0] &&
      String(afterCart[0].id) === String(test.body.id) &&
      afterCart[0].price === test.body.price &&
      afterCart[0].quantity === test.body.quantity;

    const pass = test.shouldPass ? accepted : !accepted;
    results.push({
      tcId: test.tcId,
      expected: test.expected,
      actualApi: `POST HTTP ${post.status}; cart=${JSON.stringify(after.json)}; response=${JSON.stringify(post.json)}`,
      actualUi: "Not executed - API-only BVA case.",
      status: pass ? "Pass" : "Fail",
    });
  }

  evidence.finishedAt = new Date().toISOString();
  fs.writeFileSync(OUT, `${JSON.stringify({ evidence, results }, null, 2)}\n`);
  const summary = results.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  }, {});
  console.log(JSON.stringify({ output: OUT, summary }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
