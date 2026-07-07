const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const TEST_DIR = path.join(ROOT, "tests", "FR12");
const SCREENSHOT_DIR = path.join(TEST_DIR, "screenshots");
const API = "http://localhost:3000/api";
const ADMIN_URL = "http://localhost:5174/";

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const runId = Date.now();
const state = {
  runId,
  adminToken: "",
  normalToken: "",
  normalUser: null,
  categoryId: 1,
  productId: null,
  updateProductId: null,
  deleteProductId: null,
  orderId: null,
  couponId: null,
};

const results = [];

function summarizeBody(body) {
  if (Array.isArray(body)) return `array(${body.length})`;
  if (body && typeof body === "object") return JSON.stringify(body).slice(0, 240);
  return String(body).slice(0, 240);
}

async function requestJson(method, endpoint, { token, rawAuth, body, rawBody, contentType = "application/json" } = {}) {
  const headers = {};
  if (rawAuth !== undefined) headers.Authorization = rawAuth;
  else if (token) headers.Authorization = `Bearer ${token}`;
  if (rawBody !== undefined || body !== undefined) headers["Content-Type"] = contentType;

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
    status: response.status,
    ok: response.ok,
    body: parsed,
    bodySummary: summarizeBody(parsed),
  };
}

function isAllowed(result) {
  return result.ok && result.status >= 200 && result.status < 300;
}

function isDenied(result) {
  return result.status === 401 || result.status === 403;
}

function addResult(id, expected, actual, pass, evidence = "", details = {}) {
  results.push({
    tcId: id,
    expected,
    actual,
    status: pass ? "PASS" : "FAIL",
    evidence,
    details,
  });
}

async function registerAndLogin(email, password, name = "FR12 Test User") {
  await requestJson("POST", "/register", {
    body: { name, email, password },
  });
  return requestJson("POST", "/login", { body: { email, password } });
}

async function login(email, password) {
  return requestJson("POST", "/login", { body: { email, password } });
}

async function findByName(endpoint, name) {
  const res = await requestJson("GET", endpoint);
  if (!Array.isArray(res.body)) return null;
  return res.body.find((item) => item.name === name || item.code === name) || null;
}

async function createProduct(name) {
  const body = {
    name,
    price: 12345,
    description: `FR12 product ${runId}`,
    imageUrl: "",
    category_id: state.categoryId,
  };
  const create = await requestJson("POST", "/products", { token: state.adminToken, body });
  const found = await findByName("/products", name);
  return { create, product: found, body };
}

async function ensureSetupData() {
  const normalEmail = `fr12.dt.normal.${runId}@example.com`;
  const normalPassword = "Password123!";
  state.normalUser = { email: normalEmail, password: normalPassword };
  const normalLogin = await registerAndLogin(normalEmail, normalPassword, "FR12 DT Normal");
  state.normalToken = normalLogin.body?.token || "";

  const adminLogin = await login("admin@eshop.com", "Admin123!");
  state.adminToken = adminLogin.body?.token || "";

  const categories = await requestJson("GET", "/categories");
  if (Array.isArray(categories.body) && categories.body[0]?.id) state.categoryId = categories.body[0].id;

  const order = await requestJson("POST", "/checkout", {
    token: state.normalToken,
    body: {
      total_amount: 101000,
      shipping_address: `FR12 order ${runId}`,
    },
  });
  state.orderId = order.body?.orderId || order.body?.id || null;
  if (!state.orderId) {
    const orders = await requestJson("GET", "/orders/my-orders", { token: state.normalToken });
    if (Array.isArray(orders.body) && orders.body.length) state.orderId = orders.body[0].id;
  }

  const created = await createProduct(`FR12 base product ${runId}`);
  state.productId = created.product?.id || null;
  const updateCreated = await createProduct(`FR12 update product ${runId}`);
  state.updateProductId = updateCreated.product?.id || state.productId;
  const deleteCreated = await createProduct(`FR12 delete product ${runId}`);
  state.deleteProductId = deleteCreated.product?.id || state.productId;

  const couponCode = `FR12${String(runId).slice(-6)}`;
  const coupon = await requestJson("POST", "/admin/coupons", {
    token: state.adminToken,
    body: {
      code: couponCode,
      type: "percent",
      discount_value: 10,
      min_order_amount: 0,
      expired_at: "2027-01-31",
      max_uses_per_user: 1,
    },
  });
  const coupons = await requestJson("GET", "/coupons", { token: state.adminToken });
  if (Array.isArray(coupons.body)) {
    const found = coupons.body.find((c) => c.code === couponCode);
    state.couponId = found?.id || coupon.body?.id || null;
  }

  return { normalLogin, adminLogin, categories, order, created, coupon };
}

async function runUiTests() {
  const browser = await chromium.launch({ headless: true });

  async function newPage() {
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await page.goto(ADMIN_URL, { waitUntil: "networkidle" });
    return page;
  }

  let page = await newPage();
  await page.evaluate(() => localStorage.removeItem("adminToken"));
  await page.reload({ waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "DT-TC001-after.png"), fullPage: true });
  let text = await page.textContent("body");
  addResult("DT-TC001", "Admin Login shown; Admin shell hidden", text.includes("Admin Login") && !text.includes("EShop Admin")
    ? "Admin Login shown; Admin shell hidden"
    : `Unexpected page text: ${text.slice(0, 120)}`, text.includes("Admin Login") && !text.includes("EShop Admin"), "screenshots/DT-TC001-after.png");
  await page.close();

  page = await newPage();
  await page.evaluate(() => localStorage.removeItem("adminToken"));
  await page.reload({ waitUntil: "networkidle" });
  await page.getByPlaceholder("Email").fill("admin@eshop.com");
  await page.getByPlaceholder("Password").fill("Admin123!");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "DT-TC002-after.png"), fullPage: true });
  const tc2 = await page.evaluate(() => ({
    hasShell: document.body.innerText.includes("EShop Admin"),
    hasToken: Boolean(localStorage.getItem("adminToken")),
  }));
  addResult("DT-TC002", "Admin shell visible; adminToken stored", JSON.stringify(tc2), tc2.hasShell && tc2.hasToken, "screenshots/DT-TC002-after.png");
  await page.close();

  page = await newPage();
  await page.evaluate(() => localStorage.removeItem("adminToken"));
  await page.reload({ waitUntil: "networkidle" });
  let normalAlert = "";
  page.once("dialog", async (dialog) => {
    normalAlert = dialog.message();
    await dialog.accept();
  });
  await page.getByPlaceholder("Email").fill(state.normalUser.email);
  await page.getByPlaceholder("Password").fill(state.normalUser.password);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "DT-TC003-after.png"), fullPage: true });
  text = await page.textContent("body");
  addResult("DT-TC003", "Normal User blocked; Admin shell hidden", `alert=${normalAlert}; hasShell=${text.includes("EShop Admin")}`, normalAlert.includes("không phải là admin") && !text.includes("EShop Admin"), "screenshots/DT-TC003-after.png");
  await page.close();

  page = await newPage();
  await page.evaluate(() => localStorage.removeItem("adminToken"));
  await page.reload({ waitUntil: "networkidle" });
  let invalidAlert = "";
  page.once("dialog", async (dialog) => {
    invalidAlert = dialog.message();
    await dialog.accept();
  });
  await page.getByPlaceholder("Email").fill(`missing.${runId}@example.com`);
  await page.getByPlaceholder("Password").fill("Wrong123!");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "DT-TC004-after.png"), fullPage: true });
  text = await page.textContent("body");
  const tc4Token = await page.evaluate(() => Boolean(localStorage.getItem("adminToken")));
  addResult("DT-TC004", "Invalid credentials denied; Admin shell hidden", `alert=${invalidAlert}; hasToken=${tc4Token}; hasShell=${text.includes("EShop Admin")}`, invalidAlert.includes("Đăng nhập thất bại") && !tc4Token && !text.includes("EShop Admin"), "screenshots/DT-TC004-after.png");
  await page.close();

  page = await newPage();
  await page.evaluate((token) => localStorage.setItem("adminToken", token), state.adminToken);
  await page.reload({ waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "DT-TC005-after.png"), fullPage: true });
  text = await page.textContent("body");
  addResult("DT-TC005", "Stored Admin token allows Admin shell", text.includes("EShop Admin") ? "Admin shell visible" : `Unexpected text: ${text.slice(0, 120)}`, text.includes("EShop Admin"), "screenshots/DT-TC005-after.png");
  await page.close();

  page = await newPage();
  await page.evaluate((token) => localStorage.setItem("adminToken", token), state.normalToken);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "DT-TC006-after.png"), fullPage: true });
  text = await page.textContent("body");
  addResult("DT-TC006", "Stored Normal User token denied; Admin shell hidden", text.includes("EShop Admin") ? "Admin shell visible" : "Admin shell hidden/login shown", !text.includes("EShop Admin"), "screenshots/DT-TC006-after.png");
  await page.close();

  page = await newPage();
  await page.evaluate(() => localStorage.setItem("adminToken", "invalid.token.value"));
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "DT-TC007-after.png"), fullPage: true });
  text = await page.textContent("body");
  addResult("DT-TC007", "Stored invalid token denied; Admin shell hidden", text.includes("EShop Admin") ? "Admin shell visible" : "Admin shell hidden/login shown", !text.includes("EShop Admin"), "screenshots/DT-TC007-after.png");
  await page.close();

  await browser.close();
}

async function runApiTests() {
  async function expectAllowed(id, method, endpoint, opts, description) {
    const res = await requestJson(method, endpoint, opts);
    addResult(id, "Allowed 2xx protected-operation result", `${res.status} ${res.bodySummary}`, isAllowed(res), "", { endpoint, method, response: res, description });
    return res;
  }
  async function expectDenied(id, method, endpoint, opts, description) {
    const res = await requestJson(method, endpoint, opts);
    addResult(id, "Access denied (401 or 403), protected data/action not exposed", `${res.status} ${res.bodySummary}`, isDenied(res), "", { endpoint, method, response: res, description });
    return res;
  }

  await expectAllowed("DT-TC008", "GET", "/admin/users", { token: state.adminToken });
  await expectDenied("DT-TC009", "GET", "/admin/users", { token: state.normalToken });
  await expectDenied("DT-TC010", "GET", "/admin/users", {});
  await expectDenied("DT-TC011", "GET", "/admin/users", { rawAuth: "" });
  await expectDenied("DT-TC012", "GET", "/admin/users", { rawAuth: `Basic ${state.adminToken}` });
  await expectDenied("DT-TC013", "GET", "/admin/users", { rawAuth: "Bearer" });
  await expectDenied("DT-TC014", "GET", "/admin/users", { rawAuth: "Bearer invalid.token.value" });

  const victimAdmin = await registerAndLogin(`fr12.dt.admin.delete.${runId}@example.com`, "Password123!", "FR12 Admin Delete Victim");
  const usersAfterVictim = await requestJson("GET", "/admin/users", { token: state.adminToken });
  const victim = Array.isArray(usersAfterVictim.body)
    ? usersAfterVictim.body.find((u) => u.email === `fr12.dt.admin.delete.${runId}@example.com`)
    : null;
  await expectAllowed("DT-TC015", "DELETE", `/admin/users/${victim?.id || 99999999}`, { token: state.adminToken });

  const victimNormalEmail = `fr12.dt.normal.delete.${runId}@example.com`;
  await registerAndLogin(victimNormalEmail, "Password123!", "FR12 Normal Delete Victim");
  const usersBeforeNormalDelete = await requestJson("GET", "/admin/users", { token: state.adminToken });
  const normalVictim = Array.isArray(usersBeforeNormalDelete.body) ? usersBeforeNormalDelete.body.find((u) => u.email === victimNormalEmail) : null;
  const normalDelete = await requestJson("DELETE", `/admin/users/${normalVictim?.id || 99999998}`, { token: state.normalToken });
  const usersAfterNormalDelete = await requestJson("GET", "/admin/users", { token: state.adminToken });
  const stillExists = Array.isArray(usersAfterNormalDelete.body) && usersAfterNormalDelete.body.some((u) => u.email === victimNormalEmail);
  addResult("DT-TC016", "Access denied; user not deleted", `${normalDelete.status} ${normalDelete.bodySummary}; stillExists=${stillExists}`, isDenied(normalDelete) && stillExists, "", { endpoint: `/admin/users/${normalVictim?.id}`, method: "DELETE", response: normalDelete });

  await expectAllowed("DT-TC017", "GET", "/admin/orders", { token: state.adminToken });
  await expectDenied("DT-TC018", "GET", "/admin/orders", {});
  await expectAllowed("DT-TC019", "PUT", `/admin/orders/${state.orderId || 1}/status`, { token: state.adminToken, body: { status: "confirmed" } });
  await expectDenied("DT-TC020", "PUT", `/admin/orders/${state.orderId || 1}/status`, { token: state.normalToken, body: { status: "shipping" } });

  await expectAllowed("DT-TC021", "POST", "/admin/import-products", {
    token: state.adminToken,
    body: { products: [{ name: `FR12 import admin ${runId}`, price: 10000, description: "x", imageUrl: "", category_id: state.categoryId }] },
  });
  await expectDenied("DT-TC022", "POST", "/admin/import-products", {
    token: state.normalToken,
    body: { products: [{ name: `FR12 import normal ${runId}`, price: 10000, description: "x", imageUrl: "", category_id: state.categoryId }] },
  });

  await expectAllowed("DT-TC023", "POST", "/products", {
    token: state.adminToken,
    body: { name: `FR12 admin product ${runId}`, price: 12000, description: "x", imageUrl: "", category_id: state.categoryId },
  });
  await expectDenied("DT-TC024", "POST", "/products", {
    token: state.normalToken,
    body: { name: `FR12 normal product ${runId}`, price: 12000, description: "x", imageUrl: "", category_id: state.categoryId },
  });
  await expectAllowed("DT-TC025", "PUT", `/products/${state.updateProductId || state.productId || 1}`, {
    token: state.adminToken,
    body: { name: `FR12 updated product ${runId}`, price: 22222, description: "updated", imageUrl: "", category_id: state.categoryId },
  });
  await expectDenied("DT-TC026", "DELETE", `/products/${state.deleteProductId || state.productId || 1}`, {});

  await expectAllowed("DT-TC027", "POST", "/categories", { token: state.adminToken, body: { name: `FR12 admin cat ${runId}` } });
  await expectDenied("DT-TC028", "POST", "/categories", { token: state.normalToken, body: { name: `FR12 normal cat ${runId}` } });
  const catForDelete = await requestJson("POST", "/categories", { token: state.adminToken, body: { name: `FR12 delete cat ${runId}` } });
  const allCats = await requestJson("GET", "/categories");
  const deleteCat = Array.isArray(allCats.body) ? allCats.body.find((c) => c.name === `FR12 delete cat ${runId}`) : null;
  await expectDenied("DT-TC029", "DELETE", `/categories/${deleteCat?.id || catForDelete.body?.id || state.categoryId}`, {});

  await expectAllowed("DT-TC030", "GET", "/coupons", { token: state.adminToken });
  await expectDenied("DT-TC031", "GET", "/coupons", { token: state.normalToken });
  await expectDenied("DT-TC032", "GET", "/coupons", {});
  await expectAllowed("DT-TC033", "POST", "/admin/coupons", {
    token: state.adminToken,
    body: { code: `AD${String(runId).slice(-6)}`, type: "percent", discount_value: 10, min_order_amount: 0, expired_at: "2027-01-31", max_uses_per_user: 1 },
  });
  await expectDenied("DT-TC034", "POST", "/admin/coupons", {
    token: state.normalToken,
    body: { code: `NU${String(runId).slice(-6)}`, type: "percent", discount_value: 10, min_order_amount: 0, expired_at: "2027-01-31", max_uses_per_user: 1 },
  });
  await expectAllowed("DT-TC035", "DELETE", `/admin/coupons/${state.couponId || 1}`, { token: state.adminToken });
  const malformed = await requestJson("POST", "/admin/coupons", {
    token: state.normalToken,
    rawBody: "{invalid-json",
  });
  addResult("DT-TC036", "Access denied and no unauthorized coupon creation", `${malformed.status} ${malformed.bodySummary}`, isDenied(malformed), "", { endpoint: "/admin/coupons", method: "POST", response: malformed });

  const invalidId = await requestJson("PUT", "/products/not-a-number", {
    token: state.adminToken,
    body: { name: "Invalid ID Product", price: 22222, description: "x", imageUrl: "", category_id: state.categoryId },
  });
  addResult("DT-TC037", "No product update for non-numeric ID", `${invalidId.status} ${invalidId.bodySummary}`, !isAllowed(invalidId), "", { endpoint: "/products/not-a-number", method: "PUT", response: invalidId });

  const missingProduct = await requestJson("PUT", "/products/99999999", {
    token: state.adminToken,
    body: { name: "Missing ID Product", price: 22222, description: "x", imageUrl: "", category_id: state.categoryId },
  });
  addResult("DT-TC038", "No update for nonexistent product ID", `${missingProduct.status} ${missingProduct.bodySummary}`, !isAllowed(missingProduct), "", { endpoint: "/products/99999999", method: "PUT", response: missingProduct });

  const missingBody = await requestJson("POST", "/products", { token: state.adminToken, body: {} });
  addResult("DT-TC039", "No product created with missing required body", `${missingBody.status} ${missingBody.bodySummary}`, !isAllowed(missingBody), "", { endpoint: "/products", method: "POST", response: missingBody });

  const publicProducts = await requestJson("GET", "/products");
  addResult("DT-TC040", "Public product list accessible without token", `${publicProducts.status} ${publicProducts.bodySummary}`, isAllowed(publicProducts) && Array.isArray(publicProducts.body), "", { endpoint: "/products", method: "GET", response: publicProducts });

  const publicCats = await requestJson("GET", "/categories", { token: state.normalToken });
  addResult("DT-TC041", "Public category list accessible", `${publicCats.status} ${publicCats.bodySummary}`, isAllowed(publicCats) && Array.isArray(publicCats.body), "", { endpoint: "/categories", method: "GET", response: publicCats });

  const unsupported = await requestJson("PATCH", "/admin/users", { token: state.adminToken, body: { test: true } });
  addResult("DT-TC042", "Unsupported method must not expose protected data", `${unsupported.status} ${unsupported.bodySummary}`, !isAllowed(unsupported) || !Array.isArray(unsupported.body), "", { endpoint: "/admin/users", method: "PATCH", response: unsupported });
}

function writeOutputs(setupSummary) {
  const summary = {
    total: results.length,
    passed: results.filter((r) => r.status === "PASS").length,
    failed: results.filter((r) => r.status === "FAIL").length,
    notExecuted: 42 - results.length,
  };
  const output = {
    feature: "FR-12 - Access Control",
    technique: "Domain Testing",
    runId,
    executedAt: new Date().toISOString(),
    setup: setupSummary,
    summary,
    results,
  };
  fs.writeFileSync(path.join(TEST_DIR, "execution-results.json"), JSON.stringify(output, null, 2));

  const rows = results
    .map((r) => `| ${r.tcId} | ${r.expected.replace(/\|/g, "\\|")} | ${r.actual.replace(/\|/g, "\\|")} | ${r.status} | ${r.evidence || ""} |`)
    .join("\n");
  const failed = results.filter((r) => r.status === "FAIL");
  const md = `# EXEC-01 - Domain Test Execution
**Feature:** FR-12 - Access Control  
**Date:** 2026-07-07  
**Skill:** EXEC-01  
**Status:** Completed

---

## Execution Summary

| Total | Passed | Failed | Not Executed |
|-------|--------|--------|--------------|
| ${summary.total} | ${summary.passed} | ${summary.failed} | ${summary.notExecuted} |

---

## Results

| TC ID | Expected | Actual | Status | Evidence |
|-------|----------|--------|--------|----------|
${rows}

---

## Failed Cases

${failed.length ? failed.map((r) => `- ${r.tcId}: expected ${r.expected}; actual ${r.actual}`).join("\n") : "- None"}

---

## Evidence

- Raw execution results: \`tests/FR12/execution-results.json\`
- Execution script: \`playwright/exec_fr12_dt.js\`
- UI screenshots: \`tests/FR12/screenshots/DT-TC001-after.png\` through \`DT-TC007-after.png\`

---

## Notes

- Tests were executed black-box through the Admin UI and documented REST API endpoints.
- Denial was evaluated as HTTP 401 or 403 for API cases because FR-12 does not specify the exact denial status.
- Failed test cases should be verified and converted into bug reports in BUG-01.

Next skill: \`BUG-01\`.
`;
  fs.writeFileSync(path.join(TEST_DIR, "execution.md"), md);
}

async function main() {
  const setupSummary = await ensureSetupData();
  await runUiTests();
  await runApiTests();
  writeOutputs(setupSummary);
  console.log(JSON.stringify({
    runId,
    total: results.length,
    passed: results.filter((r) => r.status === "PASS").length,
    failed: results.filter((r) => r.status === "FAIL").length,
    failedIds: results.filter((r) => r.status === "FAIL").map((r) => r.tcId),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
