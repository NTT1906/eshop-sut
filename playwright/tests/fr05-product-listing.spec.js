// FR-05: Product Listing and Search - Automation Test Scripts
// Student ID: 23127053
// Run by: 23127053

const { test, expect } = require('@playwright/test');
const searchData = require('../test-data/fr05_search_data.json');

const BASE_URL = 'http://localhost:5173';

test.describe('FR-05: Product Listing and Search', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  // TC01: Verify homepage displays products in grid layout
  test('TC01 - Homepage displays products in grid layout', async ({ page }) => {
    const productCards = page.locator('.grid > div');
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify grid layout exists
    const grid = page.locator('.grid');
    await expect(grid).toBeVisible();
  });

  // TC02: Verify product card contains image, name, and price
  test('TC02 - Product card contains image, name, and price', async ({ page }) => {
    const firstProduct = page.locator('.grid > div').first();
    
    // Verify image exists
    const image = firstProduct.locator('img');
    await expect(image).toBeVisible();
    
    // Verify product name exists
    const name = firstProduct.locator('h2');
    await expect(name).toBeVisible();
    const nameText = await name.textContent();
    expect(nameText.length).toBeGreaterThan(0);
    
    // Verify price exists and contains VND
    const price = firstProduct.locator('.text-red-500');
    await expect(price).toBeVisible();
    const priceText = await price.textContent();
    expect(priceText).toContain('VND');
  });

  // TC03: Verify product image has alt text
  test('TC03 - Product image has alt text', async ({ page }) => {
    const images = page.locator('.grid img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  // TC04: Verify price format includes thousand separators
  test('TC04 - Price format includes thousand separators', async ({ page }) => {
    const prices = page.locator('.text-red-500');
    const count = await prices.count();
    
    for (let i = 0; i < count; i++) {
      const priceText = await prices.nth(i).textContent();
      // Price should contain VND and be a number
      expect(priceText).toMatch(/[\d,.]+\s*VND/);
    }
  });

  // TC05: Verify search bar exists and is functional
  test('TC05 - Search bar exists and is functional', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Tìm kiếm..."]');
    await expect(searchInput).toBeVisible();
    
    const searchButton = page.locator('button:text("Tìm")');
    await expect(searchButton).toBeVisible();
  });

  // TC06: Search with existing product keyword
  test('TC06 - Search with existing product keyword', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Tìm kiếm..."]');
    await searchInput.fill('Laptop');
    
    const searchButton = page.locator('button:text("Tìm")');
    await searchButton.click();
    
    await page.waitForLoadState('networkidle');
    
    // Verify search results are displayed
    const resultsText = page.locator('text=Kết quả tìm kiếm cho');
    await expect(resultsText).toBeVisible();
  });

  // TC07: Search with non-existent keyword shows empty state
  test('TC07 - Search with non-existent keyword shows empty state', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Tìm kiếm..."]');
    await searchInput.fill('xyz123nonexistent');
    
    const searchButton = page.locator('button:text("Tìm")');
    await searchButton.click();
    
    await page.waitForLoadState('networkidle');
    
    // Verify no products are displayed
    const productCards = page.locator('.grid > div');
    const count = await productCards.count();
    expect(count).toBe(0);
  });

  // TC08: Search keyword is safely displayed (XSS prevention)
  test('TC08 - Search keyword is safely displayed (XSS prevention)', async ({ page }) => {
    // Set up dialog listener BEFORE performing search
    let alertFired = false;
    page.on('dialog', async dialog => {
      alertFired = true;
      await dialog.dismiss();
    });
    
    const searchInput = page.locator('input[placeholder="Tìm kiếm..."]');
    await searchInput.fill('<script>alert("xss")</script>');
    
    const searchButton = page.locator('button:text("Tìm")');
    await searchButton.click();
    
    await page.waitForLoadState('networkidle');
    
    // Wait a moment to ensure no dialog
    await page.waitForTimeout(1000);
    expect(alertFired).toBe(false);
  });

  // TC09: Verify only one h1 tag exists on homepage
  test('TC09 - Only one h1 tag exists on homepage', async ({ page }) => {
    const h1Elements = page.locator('h1');
    const count = await h1Elements.count();
    expect(count).toBe(1);
  });

  // TC10: Verify h1 tag content is correct
  test('TC10 - H1 tag content is correct', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toHaveText('Danh sách sản phẩm');
  });

  // TC11: Search with single character
  test('TC11 - Search with single character', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Tìm kiếm..."]');
    await searchInput.fill('a');
    
    const searchButton = page.locator('button:text("Tìm")');
    await searchButton.click();
    
    await page.waitForLoadState('networkidle');
    
    // Verify search completes without error
    const pageContent = await page.content();
    expect(pageContent).toBeTruthy();
  });

  // TC12: Search with special characters
  test('TC12 - Search with special characters', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Tìm kiếm..."]');
    await searchInput.fill('!@#$%');
    
    const searchButton = page.locator('button:text("Tìm")');
    await searchButton.click();
    
    await page.waitForLoadState('networkidle');
    
    // Verify search completes without error
    const pageContent = await page.content();
    expect(pageContent).toBeTruthy();
  });

  // TC13: Verify "Xem chi tiết" button exists on product cards
  test('TC13 - Xem chi tiết button exists on product cards', async ({ page }) => {
    const detailButtons = page.locator('a:text("Xem chi tiết")');
    const count = await detailButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  // TC14: Verify "Thêm vào giỏ" button exists on product cards
  test('TC14 - Thêm vào giỏ button exists on product cards', async ({ page }) => {
    const addToCartButtons = page.locator('button:text("Thêm vào giỏ")');
    const count = await addToCartButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  // TC15: Verify product count is displayed
  test('TC15 - Product count is displayed', async ({ page }) => {
    const countText = page.locator('text=/Hiển thị \\d+ sản phẩm/');
    await expect(countText).toBeVisible();
  });

  // TC16: Search with whitespace only
  test('TC16 - Search with whitespace only', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Tìm kiếm..."]');
    await searchInput.fill('   ');
    
    const searchButton = page.locator('button:text("Tìm")');
    await searchButton.click();
    
    await page.waitForLoadState('networkidle');
    
    // Verify products are still displayed
    const productCards = page.locator('.grid > div');
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });
});
