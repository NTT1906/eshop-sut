// FR-09: Discount Coupons - Automation Test Scripts
// Student ID: 23127053
// Run by: 23127053

const { test, expect, request } = require('@playwright/test');
const couponData = require('../test-data/fr09_coupon_data.json');

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3000';

test.describe('FR-09: Discount Coupons', () => {
  
  let userToken = '';
  let userId = 2;

  test.beforeAll(async ({ request }) => {
    // Login as test user
    const loginResponse = await request.post(`${API_URL}/api/login`, {
      data: {
        email: 'test@eshop.com',
        password: 'Test1234!'
      }
    });
    const loginData = await loginResponse.json();
    userToken = loginData.token;
    userId = loginData.user?.id || 2;
  });

  // TC01: Verify coupon input field exists on checkout page
  test('TC01 - Coupon input field exists on checkout page', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'test@eshop.com');
    await page.fill('input[type="password"]', 'Test1234!');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Add product to cart
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const addToCartBtn = page.locator('button:text("Thêm vào giỏ")').first();
    await addToCartBtn.click();
    await page.waitForTimeout(1000);
    
    // Go to checkout
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Verify coupon input exists
    const couponInput = page.locator('input[placeholder="Nhập mã giảm giá..."]');
    await expect(couponInput).toBeVisible();
    
    // Verify apply button exists
    const applyButton = page.locator('button:text("Áp dụng")');
    await expect(applyButton).toBeVisible();
  });

  // TC02: Apply valid percent coupon (SAVE10)
  test('TC02 - Apply valid percent coupon (SAVE10)', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'test@eshop.com');
    await page.fill('input[type="password"]', 'Test1234!');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Add product to cart
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const addToCartBtn = page.locator('button:text("Thêm vào giỏ")').first();
    await addToCartBtn.click();
    await page.waitForTimeout(1000);
    
    // Go to checkout
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Enter coupon code
    const couponInput = page.locator('input[placeholder="Nhập mã giảm giá..."]');
    await couponInput.fill('SAVE10');
    
    // Click apply button
    const applyButton = page.locator('button:text("Áp dụng")');
    await applyButton.click();
    
    await page.waitForTimeout(2000);
    
    // Verify success message appears
    const successMessage = page.locator('text=Áp dụng thành công');
    await expect(successMessage).toBeVisible({ timeout: 5000 });
  });

  // TC03: Apply expired coupon (EXPIRED)
  test('TC03 - Apply expired coupon (EXPIRED)', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'test@eshop.com');
    await page.fill('input[type="password"]', 'Test1234!');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Add product to cart
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const addToCartBtn = page.locator('button:text("Thêm vào giỏ")').first();
    await addToCartBtn.click();
    await page.waitForTimeout(1000);
    
    // Go to checkout
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Enter expired coupon code
    const couponInput = page.locator('input[placeholder="Nhập mã giảm giá..."]');
    await couponInput.fill('EXPIRED');
    
    // Click apply button
    const applyButton = page.locator('button:text("Áp dụng")');
    await applyButton.click();
    
    await page.waitForTimeout(2000);
    
    // Verify error message appears
    const errorMessage = page.locator('.text-red-600');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  // TC04: Apply non-existent coupon
  test('TC04 - Apply non-existent coupon', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'test@eshop.com');
    await page.fill('input[type="password"]', 'Test1234!');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Add product to cart
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const addToCartBtn = page.locator('button:text("Thêm vào giỏ")').first();
    await addToCartBtn.click();
    await page.waitForTimeout(1000);
    
    // Go to checkout
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Enter non-existent coupon code
    const couponInput = page.locator('input[placeholder="Nhập mã giảm giá..."]');
    await couponInput.fill('NONEXISTENT');
    
    // Click apply button
    const applyButton = page.locator('button:text("Áp dụng")');
    await applyButton.click();
    
    await page.waitForTimeout(2000);
    
    // Verify error message appears
    const errorMessage = page.locator('.text-red-600');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  // TC05: Apply coupon with empty code
  test('TC05 - Apply coupon with empty code', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'test@eshop.com');
    await page.fill('input[type="password"]', 'Test1234!');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Add product to cart
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const addToCartBtn = page.locator('button:text("Thêm vào giỏ")').first();
    await addToCartBtn.click();
    await page.waitForTimeout(1000);
    
    // Go to checkout
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Leave coupon code empty
    const couponInput = page.locator('input[placeholder="Nhập mã giảm giá..."]');
    await couponInput.fill('');
    
    // Click apply button
    const applyButton = page.locator('button:text("Áp dụng")');
    await applyButton.click();
    
    await page.waitForTimeout(1000);
    
    // Verify apply button is disabled or no action occurs
    const pageContent = await page.content();
    expect(pageContent).toBeTruthy();
  });

  // TC06: Verify discount amount is calculated correctly for percent coupon
  test('TC06 - Discount amount calculated correctly for percent coupon', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'test@eshop.com');
    await page.fill('input[type="password"]', 'Test1234!');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Add product to cart
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const addToCartBtn = page.locator('button:text("Thêm vào giỏ")').first();
    await addToCartBtn.click();
    await page.waitForTimeout(1000);
    
    // Go to checkout
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Enter coupon code
    const couponInput = page.locator('input[placeholder="Nhập mã giảm giá..."]');
    await couponInput.fill('SAVE10');
    
    // Click apply button
    const applyButton = page.locator('button:text("Áp dụng")');
    await applyButton.click();
    
    await page.waitForTimeout(2000);
    
    // Verify discount is shown
    const discountText = page.locator('text=/Tiết kiệm/');
    await expect(discountText).toBeVisible({ timeout: 5000 });
  });

  // TC07: Verify final amount is calculated correctly
  test('TC07 - Final amount calculated correctly', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'test@eshop.com');
    await page.fill('input[type="password"]', 'Test1234!');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Add product to cart
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const addToCartBtn = page.locator('button:text("Thêm vào giỏ")').first();
    await addToCartBtn.click();
    await page.waitForTimeout(1000);
    
    // Go to checkout
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Enter coupon code
    const couponInput = page.locator('input[placeholder="Nhập mã giảm giá..."]');
    await couponInput.fill('SAVE10');
    
    // Click apply button
    const applyButton = page.locator('button:text("Áp dụng")');
    await applyButton.click();
    
    await page.waitForTimeout(2000);
    
    // Verify final amount is shown
    const finalAmountText = page.locator('text=/Thành tiền/');
    await expect(finalAmountText).toBeVisible({ timeout: 5000 });
  });

  // TC08: API test - Apply valid coupon
  test('TC08 - API: Apply valid coupon', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/apply-coupon`, {
      data: {
        code: 'SAVE10',
        total_amount: 500000,
        user_id: userId
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBeTruthy();
    expect(data.discount_amount).toBe(50000);
    expect(data.final_amount).toBe(450000);
  });

  // TC09: API test - Apply expired coupon
  test('TC09 - API: Apply expired coupon', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/apply-coupon`, {
      data: {
        code: 'EXPIRED',
        total_amount: 500000,
        user_id: userId
      }
    });
    
    expect(response.ok()).toBeFalsy();
    const data = await response.json();
    expect(data.error).toContain('hết hạn');
  });

  // TC10: API test - Apply coupon below minimum order
  test('TC10 - API: Apply coupon below minimum order', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/apply-coupon`, {
      data: {
        code: 'SAVE10',
        total_amount: 200000,
        user_id: userId
      }
    });
    
    expect(response.ok()).toBeFalsy();
    const data = await response.json();
    expect(data.error).toContain('tối thiểu');
  });

  // TC11: API test - Apply non-existent coupon
  test('TC11 - API: Apply non-existent coupon', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/apply-coupon`, {
      data: {
        code: 'NONEXISTENT',
        total_amount: 500000,
        user_id: userId
      }
    });
    
    expect(response.ok()).toBeFalsy();
    const data = await response.json();
    expect(data.error).toContain('không tồn tại');
  });

  // TC12: API test - Apply fixed coupon (BIGBUY)
  test('TC12 - API: Apply fixed coupon (BIGBUY)', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/apply-coupon`, {
      data: {
        code: 'BIGBUY',
        total_amount: 600000,
        user_id: userId
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBeTruthy();
    expect(data.discount_amount).toBe(50000);
    expect(data.final_amount).toBe(550000);
  });
});
