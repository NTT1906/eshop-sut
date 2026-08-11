# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr05-product-listing.spec.js >> FR-05: Product Listing and Search >> TC10 - H1 tag content is correct
- Location: tests\fr05-product-listing.spec.js:142:3

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('h1')
Expected: "Danh sách sản phẩm"
Error: strict mode violation: locator('h1') resolved to 2 elements:
    1) <h1 class="text-3xl font-bold">Danh sách sản phẩm</h1> aka getByRole('heading', { name: 'Danh sách sản phẩm' })
    2) <h1 class="text-center text-gray-400 mt-8 text-sm">Hiển thị 26 sản phẩm</h1> aka getByRole('heading', { name: 'Hiển thị 26 sản phẩm' })

Call log:
  - Expect "toHaveText" with timeout 10000ms
  - waiting for locator('h1')

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
      - link "Đăng nhập" [ref=e8]:
        - /url: /login
      - link "Đăng ký" [ref=e9]:
        - /url: /register
  - main [ref=e10]:
    - generic [ref=e11]:
      - generic [ref=e12]:
        - heading "Danh sách sản phẩm" [level=1] [ref=e13]
        - generic [ref=e14]:
          - textbox "Tìm kiếm..." [ref=e15]
          - button "Tìm" [ref=e16] [cursor=pointer]
      - generic [ref=e17]:
        - generic [ref=e18]:
          - heading "iPhone 15 Pro Max" [level=2] [ref=e19]
          - paragraph [ref=e20]: 30,000,000 VND
          - generic [ref=e21]:
            - link "Xem chi tiết" [ref=e22]:
              - /url: /product/1
            - button "Thêm vào giỏ" [ref=e23] [cursor=pointer]
        - generic [ref=e24]:
          - heading "Samsung Galaxy S24 Ultra" [level=2] [ref=e25]
          - paragraph [ref=e26]: 28,000,000 VND
          - generic [ref=e27]:
            - link "Xem chi tiết" [ref=e28]:
              - /url: /product/2
            - button "Thêm vào giỏ" [ref=e29] [cursor=pointer]
        - generic [ref=e30]:
          - heading "MacBook Pro M3" [level=2] [ref=e31]
          - paragraph [ref=e32]: 45,000,000 VND
          - generic [ref=e33]:
            - link "Xem chi tiết" [ref=e34]:
              - /url: /product/3
            - button "Thêm vào giỏ" [ref=e35] [cursor=pointer]
        - generic [ref=e36]:
          - heading "Tai nghe AirPods Pro 2" [level=2] [ref=e37]
          - paragraph [ref=e38]: 6,000,000 VND
          - generic [ref=e39]:
            - link "Xem chi tiết" [ref=e40]:
              - /url: /product/4
            - button "Thêm vào giỏ" [ref=e41] [cursor=pointer]
        - generic [ref=e42]:
          - heading "Bàn phím cơ Keychron Q1" [level=2] [ref=e43]
          - paragraph [ref=e44]: 4,000,000 VND
          - generic [ref=e45]:
            - link "Xem chi tiết" [ref=e46]:
              - /url: /product/5
            - button "Thêm vào giỏ" [ref=e47] [cursor=pointer]
        - generic [ref=e48]:
          - heading "Test Product 1" [level=2] [ref=e49]
          - paragraph [ref=e50]: 100,000 VND
          - generic [ref=e51]:
            - link "Xem chi tiết" [ref=e52]:
              - /url: /product/6
            - button "Thêm vào giỏ" [ref=e53] [cursor=pointer]
        - generic [ref=e54]:
          - heading "Test Product 2" [level=2] [ref=e55]
          - paragraph [ref=e56]: 200,000 VND
          - generic [ref=e57]:
            - link "Xem chi tiết" [ref=e58]:
              - /url: /product/7
            - button "Thêm vào giỏ" [ref=e59] [cursor=pointer]
        - generic [ref=e60]:
          - heading "Test Product" [level=2] [ref=e61]
          - paragraph [ref=e62]: "-100,000 VND"
          - generic [ref=e63]:
            - link "Xem chi tiết" [ref=e64]:
              - /url: /product/8
            - button "Thêm vào giỏ" [ref=e65] [cursor=pointer]
        - generic [ref=e66]:
          - heading "Test Product 1" [level=2] [ref=e67]
          - paragraph [ref=e68]: 100,000 VND
          - generic [ref=e69]:
            - link "Xem chi tiết" [ref=e70]:
              - /url: /product/9
            - button "Thêm vào giỏ" [ref=e71] [cursor=pointer]
        - generic [ref=e72]:
          - heading "Test Product 2" [level=2] [ref=e73]
          - paragraph [ref=e74]: 200,000 VND
          - generic [ref=e75]:
            - link "Xem chi tiết" [ref=e76]:
              - /url: /product/10
            - button "Thêm vào giỏ" [ref=e77] [cursor=pointer]
        - generic [ref=e78]:
          - heading "Test Product" [level=2] [ref=e79]
          - paragraph [ref=e80]: "-100,000 VND"
          - generic [ref=e81]:
            - link "Xem chi tiết" [ref=e82]:
              - /url: /product/11
            - button "Thêm vào giỏ" [ref=e83] [cursor=pointer]
        - generic [ref=e84]:
          - heading "Test Product 1" [level=2] [ref=e85]
          - paragraph [ref=e86]: 100,000 VND
          - generic [ref=e87]:
            - link "Xem chi tiết" [ref=e88]:
              - /url: /product/12
            - button "Thêm vào giỏ" [ref=e89] [cursor=pointer]
        - generic [ref=e90]:
          - heading "Test Product 2" [level=2] [ref=e91]
          - paragraph [ref=e92]: 200,000 VND
          - generic [ref=e93]:
            - link "Xem chi tiết" [ref=e94]:
              - /url: /product/13
            - button "Thêm vào giỏ" [ref=e95] [cursor=pointer]
        - generic [ref=e96]:
          - heading "Test Product" [level=2] [ref=e97]
          - paragraph [ref=e98]: "-100,000 VND"
          - generic [ref=e99]:
            - link "Xem chi tiết" [ref=e100]:
              - /url: /product/14
            - button "Thêm vào giỏ" [ref=e101] [cursor=pointer]
        - generic [ref=e102]:
          - heading "Test Product 1" [level=2] [ref=e103]
          - paragraph [ref=e104]: 100,000 VND
          - generic [ref=e105]:
            - link "Xem chi tiết" [ref=e106]:
              - /url: /product/15
            - button "Thêm vào giỏ" [ref=e107] [cursor=pointer]
        - generic [ref=e108]:
          - heading "Test Product 2" [level=2] [ref=e109]
          - paragraph [ref=e110]: 200,000 VND
          - generic [ref=e111]:
            - link "Xem chi tiết" [ref=e112]:
              - /url: /product/16
            - button "Thêm vào giỏ" [ref=e113] [cursor=pointer]
        - generic [ref=e114]:
          - heading "Test Product" [level=2] [ref=e115]
          - paragraph [ref=e116]: "-100,000 VND"
          - generic [ref=e117]:
            - link "Xem chi tiết" [ref=e118]:
              - /url: /product/17
            - button "Thêm vào giỏ" [ref=e119] [cursor=pointer]
        - generic [ref=e120]:
          - heading "Test Product 1" [level=2] [ref=e121]
          - paragraph [ref=e122]: 100,000 VND
          - generic [ref=e123]:
            - link "Xem chi tiết" [ref=e124]:
              - /url: /product/18
            - button "Thêm vào giỏ" [ref=e125] [cursor=pointer]
        - generic [ref=e126]:
          - heading "Test Product 2" [level=2] [ref=e127]
          - paragraph [ref=e128]: 200,000 VND
          - generic [ref=e129]:
            - link "Xem chi tiết" [ref=e130]:
              - /url: /product/19
            - button "Thêm vào giỏ" [ref=e131] [cursor=pointer]
        - generic [ref=e132]:
          - heading "Test Product" [level=2] [ref=e133]
          - paragraph [ref=e134]: "-100,000 VND"
          - generic [ref=e135]:
            - link "Xem chi tiết" [ref=e136]:
              - /url: /product/20
            - button "Thêm vào giỏ" [ref=e137] [cursor=pointer]
        - generic [ref=e138]:
          - heading "Test Product 1" [level=2] [ref=e139]
          - paragraph [ref=e140]: 100,000 VND
          - generic [ref=e141]:
            - link "Xem chi tiết" [ref=e142]:
              - /url: /product/21
            - button "Thêm vào giỏ" [ref=e143] [cursor=pointer]
        - generic [ref=e144]:
          - heading "Test Product 2" [level=2] [ref=e145]
          - paragraph [ref=e146]: 200,000 VND
          - generic [ref=e147]:
            - link "Xem chi tiết" [ref=e148]:
              - /url: /product/22
            - button "Thêm vào giỏ" [ref=e149] [cursor=pointer]
        - generic [ref=e150]:
          - heading "Test Product" [level=2] [ref=e151]
          - paragraph [ref=e152]: "-100,000 VND"
          - generic [ref=e153]:
            - link "Xem chi tiết" [ref=e154]:
              - /url: /product/23
            - button "Thêm vào giỏ" [ref=e155] [cursor=pointer]
        - generic [ref=e156]:
          - heading "Test Product 1" [level=2] [ref=e157]
          - paragraph [ref=e158]: 100,000 VND
          - generic [ref=e159]:
            - link "Xem chi tiết" [ref=e160]:
              - /url: /product/24
            - button "Thêm vào giỏ" [ref=e161] [cursor=pointer]
        - generic [ref=e162]:
          - heading "Test Product 2" [level=2] [ref=e163]
          - paragraph [ref=e164]: 200,000 VND
          - generic [ref=e165]:
            - link "Xem chi tiết" [ref=e166]:
              - /url: /product/25
            - button "Thêm vào giỏ" [ref=e167] [cursor=pointer]
        - generic [ref=e168]:
          - heading "Test Product" [level=2] [ref=e169]
          - paragraph [ref=e170]: "-100,000 VND"
          - generic [ref=e171]:
            - link "Xem chi tiết" [ref=e172]:
              - /url: /product/26
            - button "Thêm vào giỏ" [ref=e173] [cursor=pointer]
      - heading "Hiển thị 26 sản phẩm" [level=1] [ref=e174]
  - contentinfo [ref=e175]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  44  |     await expect(price).toBeVisible();
  45  |     const priceText = await price.textContent();
  46  |     expect(priceText).toContain('VND');
  47  |   });
  48  | 
  49  |   // TC03: Verify product image has alt text
  50  |   test('TC03 - Product image has alt text', async ({ page }) => {
  51  |     const images = page.locator('.grid img');
  52  |     const count = await images.count();
  53  |     
  54  |     for (let i = 0; i < count; i++) {
  55  |       const alt = await images.nth(i).getAttribute('alt');
  56  |       expect(alt).not.toBeNull();
  57  |     }
  58  |   });
  59  | 
  60  |   // TC04: Verify price format includes thousand separators
  61  |   test('TC04 - Price format includes thousand separators', async ({ page }) => {
  62  |     const prices = page.locator('.text-red-500');
  63  |     const count = await prices.count();
  64  |     
  65  |     for (let i = 0; i < count; i++) {
  66  |       const priceText = await prices.nth(i).textContent();
  67  |       // Price should contain VND and be a number
  68  |       expect(priceText).toMatch(/[\d,.]+\s*VND/);
  69  |     }
  70  |   });
  71  | 
  72  |   // TC05: Verify search bar exists and is functional
  73  |   test('TC05 - Search bar exists and is functional', async ({ page }) => {
  74  |     const searchInput = page.locator('input[placeholder="Tìm kiếm..."]');
  75  |     await expect(searchInput).toBeVisible();
  76  |     
  77  |     const searchButton = page.locator('button:text("Tìm")');
  78  |     await expect(searchButton).toBeVisible();
  79  |   });
  80  | 
  81  |   // TC06: Search with existing product keyword
  82  |   test('TC06 - Search with existing product keyword', async ({ page }) => {
  83  |     const searchInput = page.locator('input[placeholder="Tìm kiếm..."]');
  84  |     await searchInput.fill('Laptop');
  85  |     
  86  |     const searchButton = page.locator('button:text("Tìm")');
  87  |     await searchButton.click();
  88  |     
  89  |     await page.waitForLoadState('networkidle');
  90  |     
  91  |     // Verify search results are displayed
  92  |     const resultsText = page.locator('text=Kết quả tìm kiếm cho');
  93  |     await expect(resultsText).toBeVisible();
  94  |   });
  95  | 
  96  |   // TC07: Search with non-existent keyword shows empty state
  97  |   test('TC07 - Search with non-existent keyword shows empty state', async ({ page }) => {
  98  |     const searchInput = page.locator('input[placeholder="Tìm kiếm..."]');
  99  |     await searchInput.fill('xyz123nonexistent');
  100 |     
  101 |     const searchButton = page.locator('button:text("Tìm")');
  102 |     await searchButton.click();
  103 |     
  104 |     await page.waitForLoadState('networkidle');
  105 |     
  106 |     // Verify no products are displayed
  107 |     const productCards = page.locator('.grid > div');
  108 |     const count = await productCards.count();
  109 |     expect(count).toBe(0);
  110 |   });
  111 | 
  112 |   // TC08: Search keyword is safely displayed (XSS prevention)
  113 |   test('TC08 - Search keyword is safely displayed (XSS prevention)', async ({ page }) => {
  114 |     // Set up dialog listener BEFORE performing search
  115 |     let alertFired = false;
  116 |     page.on('dialog', async dialog => {
  117 |       alertFired = true;
  118 |       await dialog.dismiss();
  119 |     });
  120 |     
  121 |     const searchInput = page.locator('input[placeholder="Tìm kiếm..."]');
  122 |     await searchInput.fill('<script>alert("xss")</script>');
  123 |     
  124 |     const searchButton = page.locator('button:text("Tìm")');
  125 |     await searchButton.click();
  126 |     
  127 |     await page.waitForLoadState('networkidle');
  128 |     
  129 |     // Wait a moment to ensure no dialog
  130 |     await page.waitForTimeout(1000);
  131 |     expect(alertFired).toBe(false);
  132 |   });
  133 | 
  134 |   // TC09: Verify only one h1 tag exists on homepage
  135 |   test('TC09 - Only one h1 tag exists on homepage', async ({ page }) => {
  136 |     const h1Elements = page.locator('h1');
  137 |     const count = await h1Elements.count();
  138 |     expect(count).toBe(1);
  139 |   });
  140 | 
  141 |   // TC10: Verify h1 tag content is correct
  142 |   test('TC10 - H1 tag content is correct', async ({ page }) => {
  143 |     const h1 = page.locator('h1');
> 144 |     await expect(h1).toHaveText('Danh sách sản phẩm');
      |                      ^ Error: expect(locator).toHaveText(expected) failed
  145 |   });
  146 | 
  147 |   // TC11: Search with single character
  148 |   test('TC11 - Search with single character', async ({ page }) => {
  149 |     const searchInput = page.locator('input[placeholder="Tìm kiếm..."]');
  150 |     await searchInput.fill('a');
  151 |     
  152 |     const searchButton = page.locator('button:text("Tìm")');
  153 |     await searchButton.click();
  154 |     
  155 |     await page.waitForLoadState('networkidle');
  156 |     
  157 |     // Verify search completes without error
  158 |     const pageContent = await page.content();
  159 |     expect(pageContent).toBeTruthy();
  160 |   });
  161 | 
  162 |   // TC12: Search with special characters
  163 |   test('TC12 - Search with special characters', async ({ page }) => {
  164 |     const searchInput = page.locator('input[placeholder="Tìm kiếm..."]');
  165 |     await searchInput.fill('!@#$%');
  166 |     
  167 |     const searchButton = page.locator('button:text("Tìm")');
  168 |     await searchButton.click();
  169 |     
  170 |     await page.waitForLoadState('networkidle');
  171 |     
  172 |     // Verify search completes without error
  173 |     const pageContent = await page.content();
  174 |     expect(pageContent).toBeTruthy();
  175 |   });
  176 | 
  177 |   // TC13: Verify "Xem chi tiết" button exists on product cards
  178 |   test('TC13 - Xem chi tiết button exists on product cards', async ({ page }) => {
  179 |     const detailButtons = page.locator('a:text("Xem chi tiết")');
  180 |     const count = await detailButtons.count();
  181 |     expect(count).toBeGreaterThan(0);
  182 |   });
  183 | 
  184 |   // TC14: Verify "Thêm vào giỏ" button exists on product cards
  185 |   test('TC14 - Thêm vào giỏ button exists on product cards', async ({ page }) => {
  186 |     const addToCartButtons = page.locator('button:text("Thêm vào giỏ")');
  187 |     const count = await addToCartButtons.count();
  188 |     expect(count).toBeGreaterThan(0);
  189 |   });
  190 | 
  191 |   // TC15: Verify product count is displayed
  192 |   test('TC15 - Product count is displayed', async ({ page }) => {
  193 |     const countText = page.locator('text=/Hiển thị \\d+ sản phẩm/');
  194 |     await expect(countText).toBeVisible();
  195 |   });
  196 | 
  197 |   // TC16: Search with whitespace only
  198 |   test('TC16 - Search with whitespace only', async ({ page }) => {
  199 |     const searchInput = page.locator('input[placeholder="Tìm kiếm..."]');
  200 |     await searchInput.fill('   ');
  201 |     
  202 |     const searchButton = page.locator('button:text("Tìm")');
  203 |     await searchButton.click();
  204 |     
  205 |     await page.waitForLoadState('networkidle');
  206 |     
  207 |     // Verify products are still displayed
  208 |     const productCards = page.locator('.grid > div');
  209 |     const count = await productCards.count();
  210 |     expect(count).toBeGreaterThan(0);
  211 |   });
  212 | });
  213 | 
```