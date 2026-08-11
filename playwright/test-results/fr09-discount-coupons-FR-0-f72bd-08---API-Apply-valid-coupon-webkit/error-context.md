# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr09-discount-coupons.spec.js >> FR-09: Discount Coupons >> TC08 - API: Apply valid coupon
- Location: tests\fr09-discount-coupons.spec.js:297:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 50000
Received: -4500000
```

# Test source

```ts
  209 |     // Verify apply button is disabled when input is empty
  210 |     const applyButton = page.locator('button:text("Áp dụng")');
  211 |     await expect(applyButton).toBeDisabled();
  212 |   });
  213 | 
  214 |   // TC06: Verify discount amount is calculated correctly for percent coupon
  215 |   test('TC06 - Discount amount calculated correctly for percent coupon', async ({ page }) => {
  216 |     // Login
  217 |     await page.goto(`${BASE_URL}/login`);
  218 |     const inputs = page.locator('form input[type="text"]');
  219 |     await inputs.nth(0).fill('test@eshop.com');
  220 |     await inputs.nth(1).fill('Test1234!');
  221 |     await page.click('button:text("Sign In")');
  222 |     await page.waitForLoadState('networkidle');
  223 |     
  224 |     // Add product to cart
  225 |     await page.goto(BASE_URL);
  226 |     await page.waitForLoadState('networkidle');
  227 |     
  228 |     const addToCartBtn = page.locator('button:text("Thêm vào giỏ")').first();
  229 |     await addToCartBtn.click();
  230 |     await page.waitForTimeout(1000);
  231 |     
  232 |     // Go to checkout
  233 |     await page.goto(`${BASE_URL}/checkout`);
  234 |     await page.waitForLoadState('networkidle');
  235 |     
  236 |     // Set total amount to meet minimum order (SAVE10 requires 300,000)
  237 |     const totalInput = page.locator('input[type="number"]');
  238 |     await totalInput.fill('500000');
  239 |     
  240 |     // Enter coupon code
  241 |     const couponInput = page.locator('input[placeholder="Nhập mã giảm giá..."]');
  242 |     await couponInput.fill('SAVE10');
  243 |     
  244 |     // Click apply button
  245 |     const applyButton = page.locator('button:text("Áp dụng")');
  246 |     await applyButton.click();
  247 |     
  248 |     await page.waitForTimeout(2000);
  249 |     
  250 |     // Verify discount is shown
  251 |     const discountText = page.locator('text=/Tiết kiệm/');
  252 |     await expect(discountText).toBeVisible({ timeout: 5000 });
  253 |   });
  254 | 
  255 |   // TC07: Verify final amount is calculated correctly
  256 |   test('TC07 - Final amount calculated correctly', async ({ page }) => {
  257 |     // Login
  258 |     await page.goto(`${BASE_URL}/login`);
  259 |     const inputs = page.locator('form input[type="text"]');
  260 |     await inputs.nth(0).fill('test@eshop.com');
  261 |     await inputs.nth(1).fill('Test1234!');
  262 |     await page.click('button:text("Sign In")');
  263 |     await page.waitForLoadState('networkidle');
  264 |     
  265 |     // Add product to cart
  266 |     await page.goto(BASE_URL);
  267 |     await page.waitForLoadState('networkidle');
  268 |     
  269 |     const addToCartBtn = page.locator('button:text("Thêm vào giỏ")').first();
  270 |     await addToCartBtn.click();
  271 |     await page.waitForTimeout(1000);
  272 |     
  273 |     // Go to checkout
  274 |     await page.goto(`${BASE_URL}/checkout`);
  275 |     await page.waitForLoadState('networkidle');
  276 |     
  277 |     // Set total amount to meet minimum order (SAVE10 requires 300,000)
  278 |     const totalInput = page.locator('input[type="number"]');
  279 |     await totalInput.fill('500000');
  280 |     
  281 |     // Enter coupon code
  282 |     const couponInput = page.locator('input[placeholder="Nhập mã giảm giá..."]');
  283 |     await couponInput.fill('SAVE10');
  284 |     
  285 |     // Click apply button
  286 |     const applyButton = page.locator('button:text("Áp dụng")');
  287 |     await applyButton.click();
  288 |     
  289 |     await page.waitForTimeout(2000);
  290 |     
  291 |     // Verify final amount is shown
  292 |     const finalAmountText = page.locator('text=/Thành tiền/');
  293 |     await expect(finalAmountText).toBeVisible({ timeout: 5000 });
  294 |   });
  295 | 
  296 |   // TC08: API test - Apply valid coupon
  297 |   test('TC08 - API: Apply valid coupon', async ({ request }) => {
  298 |     const response = await request.post(`${API_URL}/api/apply-coupon`, {
  299 |       data: {
  300 |         code: 'SAVE10',
  301 |         total_amount: 500000,
  302 |         user_id: userId
  303 |       }
  304 |     });
  305 |     
  306 |     expect(response.ok()).toBeTruthy();
  307 |     const data = await response.json();
  308 |     expect(data.success).toBeTruthy();
> 309 |     expect(data.discount_amount).toBe(50000);
      |                                  ^ Error: expect(received).toBe(expected) // Object.is equality
  310 |     expect(data.final_amount).toBe(450000);
  311 |   });
  312 | 
  313 |   // TC09: API test - Apply expired coupon
  314 |   test('TC09 - API: Apply expired coupon', async ({ request }) => {
  315 |     const response = await request.post(`${API_URL}/api/apply-coupon`, {
  316 |       data: {
  317 |         code: 'EXPIRED',
  318 |         total_amount: 500000,
  319 |         user_id: userId
  320 |       }
  321 |     });
  322 |     
  323 |     expect(response.ok()).toBeFalsy();
  324 |     const data = await response.json();
  325 |     expect(data.error).toContain('hết hạn');
  326 |   });
  327 | 
  328 |   // TC10: API test - Apply coupon below minimum order
  329 |   test('TC10 - API: Apply coupon below minimum order', async ({ request }) => {
  330 |     const response = await request.post(`${API_URL}/api/apply-coupon`, {
  331 |       data: {
  332 |         code: 'SAVE10',
  333 |         total_amount: 200000,
  334 |         user_id: userId
  335 |       }
  336 |     });
  337 |     
  338 |     expect(response.ok()).toBeFalsy();
  339 |     const data = await response.json();
  340 |     expect(data.error).toContain('tối thiểu');
  341 |   });
  342 | 
  343 |   // TC11: API test - Apply non-existent coupon
  344 |   test('TC11 - API: Apply non-existent coupon', async ({ request }) => {
  345 |     const response = await request.post(`${API_URL}/api/apply-coupon`, {
  346 |       data: {
  347 |         code: 'NONEXISTENT',
  348 |         total_amount: 500000,
  349 |         user_id: userId
  350 |       }
  351 |     });
  352 |     
  353 |     expect(response.ok()).toBeFalsy();
  354 |     const data = await response.json();
  355 |     expect(data.error).toContain('không tồn tại');
  356 |   });
  357 | 
  358 |   // TC12: API test - Apply fixed coupon (BIGBUY)
  359 |   test('TC12 - API: Apply fixed coupon (BIGBUY)', async ({ request }) => {
  360 |     const response = await request.post(`${API_URL}/api/apply-coupon`, {
  361 |       data: {
  362 |         code: 'BIGBUY',
  363 |         total_amount: 600000,
  364 |         user_id: userId
  365 |       }
  366 |     });
  367 |     
  368 |     expect(response.ok()).toBeTruthy();
  369 |     const data = await response.json();
  370 |     expect(data.success).toBeTruthy();
  371 |     expect(data.discount_amount).toBe(50000);
  372 |     expect(data.final_amount).toBe(550000);
  373 |   });
  374 | });
  375 | 
```