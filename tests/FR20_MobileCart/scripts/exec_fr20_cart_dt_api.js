const fs = require("fs");
const path = require("path");

const API = process.env.API_BASE_URL || "http://localhost:3000/api";
const OUT = path.resolve(__dirname, "../execution-api-results.json");

async function request(method, endpoint, { token, headers = {}, body } = {}) {
  const finalHeaders = { ...headers };
  if (token !== undefined) finalHeaders.Authorization = token;
  if (body !== undefined) finalHeaders["Content-Type"] = "application/json";

  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers: finalHeaders,
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

function passIf(condition) {
  return condition ? "Pass" : "Fail";
}

function isUnauthorized(status) {
  return status === 401 || status === 403;
}

async function cart(token) {
  return request("GET", "/cart", { token: `Bearer ${token}` });
}

async function main() {
  const runId = Date.now();
  const user = {
    name: `FR20 Exec ${runId}`,
    email: `fr20.exec.${runId}@example.com`,
    password: "Password123!",
  };

  const results = [];
  const evidence = {
    apiBaseUrl: API,
    userEmail: user.email,
    startedAt: new Date().toISOString(),
  };

  const register = await request("POST", "/register", { body: user });
  evidence.register = register;

  const login = await request("POST", "/login", {
    body: { email: user.email, password: user.password },
  });
  const token = login.json && login.json.token;
  evidence.login = login;

  if (!token) {
    throw new Error(`Could not obtain user token. Login status=${login.status}`);
  }

  const productsRes = await request("GET", "/products");
  const products = Array.isArray(productsRes.json) ? productsRes.json : [];
  const product = products[0];
  const otherProduct = products[1] || products[0];
  evidence.productsStatus = productsRes.status;
  evidence.selectedProduct = product;
  evidence.otherProduct = otherProduct;

  if (!product) {
    throw new Error("No product returned by GET /api/products.");
  }

  async function record(tcId, expected, actualApi, status, extra = {}) {
    results.push({
      tcId,
      expected,
      actualApi,
      actualUi: "Not executed - manual Expo emulator UI validation required where applicable.",
      status,
      ...extra,
    });
  }

  const t1 = await cart(token);
  await record(
    "DT-TC001",
    "Authorized GET /api/cart returns cart array.",
    `HTTP ${t1.status}; body=${JSON.stringify(t1.json)}`,
    passIf(t1.status === 200 && Array.isArray(t1.json)),
  );

  const t2 = await request("GET", "/cart");
  await record(
    "DT-TC002",
    "Missing Authorization is rejected.",
    `HTTP ${t2.status}; body=${JSON.stringify(t2.json)}`,
    passIf(isUnauthorized(t2.status)),
  );

  const t3 = await request("GET", "/cart", { token: "Bearer " });
  await record(
    "DT-TC003",
    "Empty bearer token is rejected.",
    `HTTP ${t3.status}; body=${JSON.stringify(t3.json)}`,
    passIf(isUnauthorized(t3.status)),
  );

  const t4 = await request("GET", "/cart", { token: `Basic ${token}` });
  await record(
    "DT-TC004",
    "Malformed/wrong auth scheme is rejected.",
    `HTTP ${t4.status}; body=${JSON.stringify(t4.json)}`,
    passIf(isUnauthorized(t4.status)),
  );

  const t5 = await request("GET", "/cart", { token: "Bearer invalid.token.value" });
  await record(
    "DT-TC005",
    "Invalid bearer token is rejected.",
    `HTTP ${t5.status}; body=${JSON.stringify(t5.json)}`,
    passIf(isUnauthorized(t5.status)),
  );

  const validBody = {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 2,
  };
  const t6 = await request("POST", "/cart", {
    token: `Bearer ${token}`,
    body: validBody,
  });
  const t6Cart = await cart(token);
  const t6Found =
    Array.isArray(t6Cart.json) &&
    t6Cart.json.some((item) => item.id === product.id && item.quantity === 2);
  await record(
    "DT-TC006",
    "Valid product payload is accepted into cart with quantity 2.",
    `POST HTTP ${t6.status}; cart=${JSON.stringify(t6Cart.json)}`,
    passIf(t6.status === 200 && t6Found),
  );

  async function invalidPostCase(tcId, expected, body) {
    const before = await cart(token);
    const beforeLen = Array.isArray(before.json) ? before.json.length : null;
    const res = await request("POST", "/cart", {
      token: `Bearer ${token}`,
      body,
    });
    const after = await cart(token);
    const afterLen = Array.isArray(after.json) ? after.json.length : null;
    const rejectedOrUnchanged = res.status >= 400 || afterLen === beforeLen;
    await record(
      tcId,
      expected,
      `POST HTTP ${res.status}; beforeLen=${beforeLen}; afterLen=${afterLen}; response=${JSON.stringify(res.json)}; lastItem=${JSON.stringify(Array.isArray(after.json) ? after.json[after.json.length - 1] : null)}`,
      passIf(rejectedOrUnchanged),
    );
  }

  await invalidPostCase("DT-TC007", "Missing product id is rejected or leaves cart unchanged.", {
    name: product.name,
    price: product.price,
    quantity: 1,
  });
  await invalidPostCase("DT-TC008", "Non-numeric product id is rejected or leaves cart unchanged.", {
    id: "abc",
    name: product.name,
    price: product.price,
    quantity: 1,
  });
  await invalidPostCase("DT-TC009", "Zero/non-positive product id is rejected or leaves cart unchanged.", {
    id: 0,
    name: product.name,
    price: product.price,
    quantity: 1,
  });
  await invalidPostCase("DT-TC010", "Non-existing positive product id is rejected, normalized, or leaves cart unchanged.", {
    id: 999999,
    name: product.name,
    price: product.price,
    quantity: 1,
  });
  await invalidPostCase("DT-TC011", "Missing name is rejected or leaves cart unchanged.", {
    id: product.id,
    price: product.price,
    quantity: 1,
  });
  await invalidPostCase("DT-TC012", "Empty name is rejected or leaves cart unchanged.", {
    id: product.id,
    name: "",
    price: product.price,
    quantity: 1,
  });
  await invalidPostCase("DT-TC013", "Non-string name is rejected or leaves cart unchanged.", {
    id: product.id,
    name: 12345,
    price: product.price,
    quantity: 1,
  });
  await invalidPostCase("DT-TC014", "Mismatched product name is rejected, normalized, or leaves cart unchanged.", {
    id: product.id,
    name: otherProduct.name === product.name ? "Different Product Name" : otherProduct.name,
    price: product.price,
    quantity: 1,
  });
  await invalidPostCase("DT-TC015", "Missing price is rejected or leaves cart unchanged.", {
    id: product.id,
    name: product.name,
    quantity: 1,
  });
  await invalidPostCase("DT-TC016", "Non-numeric price is rejected or leaves cart unchanged.", {
    id: product.id,
    name: product.name,
    price: "abc",
    quantity: 1,
  });
  await invalidPostCase("DT-TC017", "Zero price is rejected unless free products are supported.", {
    id: product.id,
    name: product.name,
    price: 0,
    quantity: 1,
  });
  await invalidPostCase("DT-TC018", "Negative price is rejected or leaves cart unchanged.", {
    id: product.id,
    name: product.name,
    price: -100000,
    quantity: 1,
  });
  await invalidPostCase("DT-TC019", "Mismatched product price is rejected, normalized, or leaves cart unchanged.", {
    id: product.id,
    name: product.name,
    price: otherProduct.price === product.price ? product.price + 1 : otherProduct.price,
    quantity: 1,
  });
  await invalidPostCase("DT-TC020", "Missing quantity is rejected, normalized, or leaves cart unchanged.", {
    id: product.id,
    name: product.name,
    price: product.price,
  });
  await invalidPostCase("DT-TC021", "Non-numeric quantity is rejected, normalized, or leaves cart unchanged.", {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: "abc",
  });
  await invalidPostCase("DT-TC022", "Zero quantity does not create a zero-quantity cart line.", {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 0,
  });
  await invalidPostCase("DT-TC023", "Negative quantity does not create a negative-quantity cart line.", {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: -1,
  });
  await invalidPostCase("DT-TC024", "Decimal quantity is rejected or consistently normalized.", {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1.5,
  });
  await invalidPostCase("DT-TC025", "Extremely large quantity is constrained, rejected, or handled safely.", {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 999999999,
  });

  const finalCart = await cart(token);
  evidence.finalCart = finalCart;
  evidence.finishedAt = new Date().toISOString();

  const output = { evidence, results };
  fs.writeFileSync(OUT, `${JSON.stringify(output, null, 2)}\n`);

  const summary = results.reduce(
    (acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    },
    {},
  );
  console.log(JSON.stringify({ output: OUT, summary }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
