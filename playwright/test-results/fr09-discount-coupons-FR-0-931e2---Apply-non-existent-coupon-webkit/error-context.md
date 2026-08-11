# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr09-discount-coupons.spec.js >> FR-09: Discount Coupons >> TC04 - Apply non-existent coupon
- Location: tests\fr09-discount-coupons.spec.js:143:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.text-red-600')
Expected: visible
Error: strict mode violation: locator('.text-red-600') resolved to 2 elements:
    1) <input type="number" value="500000" class="border p-2 rounded text-red-600 font-bold"/> aka getByRole('spinbutton')
    2) <p class="mt-2 text-red-600 text-sm">Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa</p> aka getByText('Mã giảm giá không tồn tại hoặ')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.text-red-600')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - link "EShop" [ref=e5]:
      - /url: /
    - navigation [ref=e6]:
      - link "Giỏ hàng" [ref=e7]:
        - /url: /cart
      - generic [ref=e8]:
        - link "Chào, Test User" [ref=e9]:
          - /url: /profile
        - button "Thoát" [ref=e10] [cursor=pointer]
  - main [ref=e11]:
    - generic [ref=e12]:
      - heading "Xác Nhận Đơn Hàng" [level=2] [ref=e13]
      - generic [ref=e14]:
        - heading "Sản phẩm:" [level=3] [ref=e15]
        - list
      - generic [ref=e16]:
        - generic [ref=e17]: "Tổng tiền thanh toán (VND):"
        - spinbutton [ref=e18]: "500000"
      - generic [ref=e19]:
        - generic [ref=e20]: Mã Giảm Giá
        - generic [ref=e21]:
          - textbox "Nhập mã giảm giá..." [ref=e22]: NONEXISTENT
          - button "Áp dụng" [ref=e23] [cursor=pointer]
        - paragraph [ref=e24]: Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa
      - generic [ref=e26]: "Tổng thanh toán: 500,000 ₫"
      - button "Xác Nhận Thanh Toán" [ref=e27] [cursor=pointer]
  - contentinfo [ref=e28]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  80  |     await page.waitForLoadState('networkidle');
  81  |     
  82  |     // Set total amount to meet minimum order (SAVE10 requires 300,000)
  83  |     const totalInput = page.locator('input[type="number"]');
  84  |     await totalInput.fill('500000');
  85  |     
  86  |     // Enter coupon code
  87  |     const couponInput = page.locator('input[placeholder="Nhập mã giảm giá..."]');
  88  |     await couponInput.fill('SAVE10');
  89  |     
  90  |     // Click apply button
  91  |     const applyButton = page.locator('button:text("Áp dụng")');
  92  |     await applyButton.click();
  93  |     
  94  |     await page.waitForTimeout(2000);
  95  |     
  96  |     // Verify success message appears
  97  |     const successMessage = page.locator('text=Áp dụng thành công');
  98  |     await expect(successMessage).toBeVisible({ timeout: 5000 });
  99  |   });
  100 | 
  101 |   // TC03: Apply expired coupon (EXPIRED)
  102 |   test('TC03 - Apply expired coupon (EXPIRED)', async ({ page }) => {
  103 |     // Login
  104 |     await page.goto(`${BASE_URL}/login`);
  105 |     const inputs = page.locator('form input[type="text"]');
  106 |     await inputs.nth(0).fill('test@eshop.com');
  107 |     await inputs.nth(1).fill('Test1234!');
  108 |     await page.click('button:text("Sign In")');
  109 |     await page.waitForLoadState('networkidle');
  110 |     
  111 |     // Add product to cart
  112 |     await page.goto(BASE_URL);
  113 |     await page.waitForLoadState('networkidle');
  114 |     
  115 |     const addToCartBtn = page.locator('button:text("Thêm vào giỏ")').first();
  116 |     await addToCartBtn.click();
  117 |     await page.waitForTimeout(1000);
  118 |     
  119 |     // Go to checkout
  120 |     await page.goto(`${BASE_URL}/checkout`);
  121 |     await page.waitForLoadState('networkidle');
  122 |     
  123 |     // Set total amount to meet minimum order
  124 |     const totalInput = page.locator('input[type="number"]');
  125 |     await totalInput.fill('500000');
  126 |     
  127 |     // Enter expired coupon code
  128 |     const couponInput = page.locator('input[placeholder="Nhập mã giảm giá..."]');
  129 |     await couponInput.fill('EXPIRED');
  130 |     
  131 |     // Click apply button
  132 |     const applyButton = page.locator('button:text("Áp dụng")');
  133 |     await applyButton.click();
  134 |     
  135 |     await page.waitForTimeout(2000);
  136 |     
  137 |     // Verify error message appears
  138 |     const errorMessage = page.locator('.text-red-600');
  139 |     await expect(errorMessage).toBeVisible({ timeout: 5000 });
  140 |   });
  141 | 
  142 |   // TC04: Apply non-existent coupon
  143 |   test('TC04 - Apply non-existent coupon', async ({ page }) => {
  144 |     // Login
  145 |     await page.goto(`${BASE_URL}/login`);
  146 |     const inputs = page.locator('form input[type="text"]');
  147 |     await inputs.nth(0).fill('test@eshop.com');
  148 |     await inputs.nth(1).fill('Test1234!');
  149 |     await page.click('button:text("Sign In")');
  150 |     await page.waitForLoadState('networkidle');
  151 |     
  152 |     // Add product to cart
  153 |     await page.goto(BASE_URL);
  154 |     await page.waitForLoadState('networkidle');
  155 |     
  156 |     const addToCartBtn = page.locator('button:text("Thêm vào giỏ")').first();
  157 |     await addToCartBtn.click();
  158 |     await page.waitForTimeout(1000);
  159 |     
  160 |     // Go to checkout
  161 |     await page.goto(`${BASE_URL}/checkout`);
  162 |     await page.waitForLoadState('networkidle');
  163 |     
  164 |     // Set total amount to meet minimum order
  165 |     const totalInput = page.locator('input[type="number"]');
  166 |     await totalInput.fill('500000');
  167 |     
  168 |     // Enter non-existent coupon code
  169 |     const couponInput = page.locator('input[placeholder="Nhập mã giảm giá..."]');
  170 |     await couponInput.fill('NONEXISTENT');
  171 |     
  172 |     // Click apply button
  173 |     const applyButton = page.locator('button:text("Áp dụng")');
  174 |     await applyButton.click();
  175 |     
  176 |     await page.waitForTimeout(2000);
  177 |     
  178 |     // Verify error message appears
  179 |     const errorMessage = page.locator('.text-red-600');
> 180 |     await expect(errorMessage).toBeVisible({ timeout: 5000 });
      |                                ^ Error: expect(locator).toBeVisible() failed
  181 |   });
  182 | 
  183 |   // TC05: Apply coupon with empty code
  184 |   test('TC05 - Apply coupon with empty code', async ({ page }) => {
  185 |     // Login
  186 |     await page.goto(`${BASE_URL}/login`);
  187 |     const inputs = page.locator('form input[type="text"]');
  188 |     await inputs.nth(0).fill('test@eshop.com');
  189 |     await inputs.nth(1).fill('Test1234!');
  190 |     await page.click('button:text("Sign In")');
  191 |     await page.waitForLoadState('networkidle');
  192 |     
  193 |     // Add product to cart
  194 |     await page.goto(BASE_URL);
  195 |     await page.waitForLoadState('networkidle');
  196 |     
  197 |     const addToCartBtn = page.locator('button:text("Thêm vào giỏ")').first();
  198 |     await addToCartBtn.click();
  199 |     await page.waitForTimeout(1000);
  200 |     
  201 |     // Go to checkout
  202 |     await page.goto(`${BASE_URL}/checkout`);
  203 |     await page.waitForLoadState('networkidle');
  204 |     
  205 |     // Leave coupon code empty
  206 |     const couponInput = page.locator('input[placeholder="Nhập mã giảm giá..."]');
  207 |     await couponInput.fill('');
  208 |     
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
```