const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const TEST_DIR = path.join(ROOT, "tests", "FR12");
const BUG_DIR = path.join(ROOT, "bugs", "FR12");
const SCREENSHOT_DIR = path.join(TEST_DIR, "screenshots");
const API = "http://localhost:3000/api";
const ADMIN_URL = "http://localhost:5174/";
const WEB_URL = "http://localhost:5173/";

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
fs.mkdirSync(BUG_DIR, { recursive: true });

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = await response.text();
  }
  return { status: response.status, ok: response.ok, body };
}

async function ensureNormalUser(runId) {
  const user = {
    name: "FR12 ENV User",
    email: `fr12.env.${runId}@example.com`,
    password: "Password123!",
  };
  const register = await requestJson(`${API}/register`, {
    method: "POST",
    body: JSON.stringify(user),
  });
  const login = await requestJson(`${API}/login`, {
    method: "POST",
    body: JSON.stringify({ email: user.email, password: user.password }),
  });
  return { user, register, login };
}

async function main() {
  const runId = Date.now();
  const normal = await ensureNormalUser(runId);
  const adminLogin = await requestJson(`${API}/login`, {
    method: "POST",
    body: JSON.stringify({
      email: "admin@eshop.com",
      password: "Admin123!",
    }),
  });

  const normalToken = normal.login.body?.token;
  const adminToken = adminLogin.body?.token;

  const apiAccessChecks = [];
  for (const check of [
    { name: "No token", token: null },
    { name: "Normal user token", token: normalToken },
    { name: "Admin token", token: adminToken },
  ]) {
    const headers = check.token
      ? { Authorization: `Bearer ${check.token}` }
      : {};
    const result = await requestJson(`${API}/admin/users`, { headers });
    apiAccessChecks.push({
      name: check.name,
      endpoint: "GET /api/admin/users",
      status: result.status,
      ok: result.ok,
      bodySummary:
        Array.isArray(result.body) ? `array(${result.body.length})` : result.body,
    });
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });

  await page.goto(ADMIN_URL, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, "ENV-admin-login.png"),
    fullPage: true,
  });

  let normalUserAlert = null;
  page.once("dialog", async (dialog) => {
    normalUserAlert = dialog.message();
    await dialog.accept();
  });
  await page.getByPlaceholder("Email").fill(normal.user.email);
  await page.getByPlaceholder("Password").fill(normal.user.password);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, "ENV-normal-user-blocked.png"),
    fullPage: true,
  });

  await page.getByPlaceholder("Email").fill("admin@eshop.com");
  await page.getByPlaceholder("Password").fill("Admin123!");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForLoadState("networkidle");
  await page.getByText("Người dùng", { exact: true }).click();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, "ENV-admin-users.png"),
    fullPage: true,
  });

  const adminState = await page.evaluate(() => ({
    title: document.body.innerText.includes("EShop Admin"),
    visibleText: document.body.innerText,
    adminTokenPresent: Boolean(localStorage.getItem("adminToken")),
  }));

  await browser.close();

  const state = {
    feature: "FR-12 - Access Control",
    backendUrl: "http://localhost:3000",
    frontendAdminUrl: ADMIN_URL,
    frontendWebUrl: WEB_URL,
    runId,
    checks: {
      normalRegister: {
        status: normal.register.status,
        ok: normal.register.ok,
      },
      normalLogin: {
        status: normal.login.status,
        ok: normal.login.ok,
        role: normal.login.body?.user?.role,
      },
      adminLogin: {
        status: adminLogin.status,
        ok: adminLogin.ok,
        role: adminLogin.body?.user?.role,
      },
      apiAccessChecks,
    },
    screenshots: {
      adminLogin: "tests/FR12/screenshots/ENV-admin-login.png",
      normalUserBlocked: "tests/FR12/screenshots/ENV-normal-user-blocked.png",
      adminUsers: "tests/FR12/screenshots/ENV-admin-users.png",
    },
    ui: {
      normalUserAlert,
      adminTokenPresentAfterAdminLogin: adminState.adminTokenPresent,
      adminShellVisibleAfterAdminLogin: adminState.title,
      observedAdminTextExcerpt: adminState.visibleText.slice(0, 1000),
    },
    testData: {
      normalUserEmail: normal.user.email,
      adminEmail: "admin@eshop.com",
    },
  };

  fs.writeFileSync(
    path.join(TEST_DIR, "ENV-01-ui-state.json"),
    JSON.stringify(state, null, 2),
  );
  console.log(JSON.stringify(state, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
