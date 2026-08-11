# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr16-product-import.spec.js >> FR-16: Product Import from CSV >> TC15 - Import button is disabled before file selection
- Location: tests\fr16-product-import.spec.js:365:3

# Error details

```
Error: expect(locator).toBeDisabled() failed

Locator: locator('button:text="Import 0 sản phẩm"')
Expected: disabled
Error: Unknown engine "button:text" while parsing selector button:text="Import 0 sản phẩm"

Call log:
  - Expect "toBeDisabled" with timeout 10000ms
  - waiting for locator('button:text="Import 0 sản phẩm"')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - heading "EShop Admin" [level=1] [ref=e5]
    - list [ref=e6]:
      - listitem [ref=e7] [cursor=pointer]: Dashboard
      - listitem [ref=e8] [cursor=pointer]: Danh mục
      - listitem [ref=e9] [cursor=pointer]: Sản phẩm
      - listitem [ref=e10] [cursor=pointer]: Mã Giảm Giá
      - listitem [ref=e11] [cursor=pointer]: Đơn hàng
      - listitem [ref=e12] [cursor=pointer]: Người dùng
      - listitem [ref=e13] [cursor=pointer]: Đăng xuất
  - generic [ref=e15]:
    - heading "Quản lý Sản phẩm" [level=2] [ref=e16]
    - generic [ref=e17]:
      - generic [ref=e18]:
        - heading "📂 Import sản phẩm từ CSV" [level=3] [ref=e19]
        - link "Tải file mẫu (template.csv)" [ref=e20]:
          - /url: data:text/csv;charset=utf-8,name,price,description,imageUrl,category_id%0ATên sản phẩm mẫu,100000,Mô tả sản phẩm,https://placehold.co/300,1
      - generic [ref=e21]:
        - button "Choose File" [ref=e22]
        - button "Import 0 sản phẩm" [disabled] [ref=e23]
    - generic [ref=e24]:
      - heading "Thêm sản phẩm mới" [level=3] [ref=e25]
      - generic [ref=e26]:
        - textbox "Tên sản phẩm" [ref=e27]
        - spinbutton [ref=e28]
        - textbox "URL Ảnh" [ref=e29]
        - textbox "Mô tả" [ref=e30]
        - combobox [ref=e31]:
          - option "Điện thoại" [selected]
          - option "Laptop"
          - option "Phụ kiện"
      - button "Lưu sản phẩm" [ref=e32] [cursor=pointer]
    - table [ref=e33]:
      - rowgroup [ref=e34]:
        - row "Ảnh Tên SP Giá Hành động" [ref=e35]:
          - columnheader "Ảnh" [ref=e36]
          - columnheader "Tên SP" [ref=e37]
          - columnheader "Giá" [ref=e38]
          - columnheader "Hành động" [ref=e39]
      - rowgroup [ref=e40]:
        - row "iPhone 15 Pro Max iPhone 15 Pro Max 30000000 ₫ Sửa Xóa" [ref=e41]:
          - cell "iPhone 15 Pro Max" [ref=e42]:
            - img "iPhone 15 Pro Max" [ref=e43]
          - cell "iPhone 15 Pro Max" [ref=e44]
          - cell "30000000 ₫" [ref=e45]
          - cell "Sửa Xóa" [ref=e46]:
            - button "Sửa" [ref=e47] [cursor=pointer]
            - button "Xóa" [ref=e48] [cursor=pointer]
        - row "Samsung Galaxy S24 Ultra Samsung Galaxy S24 Ultra 28000000 ₫ Sửa Xóa" [ref=e49]:
          - cell "Samsung Galaxy S24 Ultra" [ref=e50]:
            - img "Samsung Galaxy S24 Ultra" [ref=e51]
          - cell "Samsung Galaxy S24 Ultra" [ref=e52]
          - cell "28000000 ₫" [ref=e53]
          - cell "Sửa Xóa" [ref=e54]:
            - button "Sửa" [ref=e55] [cursor=pointer]
            - button "Xóa" [ref=e56] [cursor=pointer]
        - row "MacBook Pro M3 MacBook Pro M3 45000000 ₫ Sửa Xóa" [ref=e57]:
          - cell "MacBook Pro M3" [ref=e58]:
            - img "MacBook Pro M3" [ref=e59]
          - cell "MacBook Pro M3" [ref=e60]
          - cell "45000000 ₫" [ref=e61]
          - cell "Sửa Xóa" [ref=e62]:
            - button "Sửa" [ref=e63] [cursor=pointer]
            - button "Xóa" [ref=e64] [cursor=pointer]
        - row "Tai nghe AirPods Pro 2 Tai nghe AirPods Pro 2 6000000 ₫ Sửa Xóa" [ref=e65]:
          - cell "Tai nghe AirPods Pro 2" [ref=e66]:
            - img "Tai nghe AirPods Pro 2" [ref=e67]
          - cell "Tai nghe AirPods Pro 2" [ref=e68]
          - cell "6000000 ₫" [ref=e69]
          - cell "Sửa Xóa" [ref=e70]:
            - button "Sửa" [ref=e71] [cursor=pointer]
            - button "Xóa" [ref=e72] [cursor=pointer]
        - row "Bàn phím cơ Keychron Q1 Bàn phím cơ Keychron Q1 4000000 ₫ Sửa Xóa" [ref=e73]:
          - cell "Bàn phím cơ Keychron Q1" [ref=e74]:
            - img "Bàn phím cơ Keychron Q1" [ref=e75]
          - cell "Bàn phím cơ Keychron Q1" [ref=e76]
          - cell "4000000 ₫" [ref=e77]
          - cell "Sửa Xóa" [ref=e78]:
            - button "Sửa" [ref=e79] [cursor=pointer]
            - button "Xóa" [ref=e80] [cursor=pointer]
        - row "Test Product 1 Test Product 1 100000 ₫ Sửa Xóa" [ref=e81]:
          - cell "Test Product 1" [ref=e82]:
            - img "Test Product 1" [ref=e83]
          - cell "Test Product 1" [ref=e84]
          - cell "100000 ₫" [ref=e85]
          - cell "Sửa Xóa" [ref=e86]:
            - button "Sửa" [ref=e87] [cursor=pointer]
            - button "Xóa" [ref=e88] [cursor=pointer]
        - row "Test Product 2 Test Product 2 200000 ₫ Sửa Xóa" [ref=e89]:
          - cell "Test Product 2" [ref=e90]:
            - img "Test Product 2" [ref=e91]
          - cell "Test Product 2" [ref=e92]
          - cell "200000 ₫" [ref=e93]
          - cell "Sửa Xóa" [ref=e94]:
            - button "Sửa" [ref=e95] [cursor=pointer]
            - button "Xóa" [ref=e96] [cursor=pointer]
        - row "Test Product Test Product -100000 ₫ Sửa Xóa" [ref=e97]:
          - cell "Test Product" [ref=e98]:
            - img "Test Product" [ref=e99]
          - cell "Test Product" [ref=e100]
          - cell "-100000 ₫" [ref=e101]
          - cell "Sửa Xóa" [ref=e102]:
            - button "Sửa" [ref=e103] [cursor=pointer]
            - button "Xóa" [ref=e104] [cursor=pointer]
        - row "Test Product 1 Test Product 1 100000 ₫ Sửa Xóa" [ref=e105]:
          - cell "Test Product 1" [ref=e106]:
            - img "Test Product 1" [ref=e107]
          - cell "Test Product 1" [ref=e108]
          - cell "100000 ₫" [ref=e109]
          - cell "Sửa Xóa" [ref=e110]:
            - button "Sửa" [ref=e111] [cursor=pointer]
            - button "Xóa" [ref=e112] [cursor=pointer]
        - row "Test Product 2 Test Product 2 200000 ₫ Sửa Xóa" [ref=e113]:
          - cell "Test Product 2" [ref=e114]:
            - img "Test Product 2" [ref=e115]
          - cell "Test Product 2" [ref=e116]
          - cell "200000 ₫" [ref=e117]
          - cell "Sửa Xóa" [ref=e118]:
            - button "Sửa" [ref=e119] [cursor=pointer]
            - button "Xóa" [ref=e120] [cursor=pointer]
        - row "Test Product Test Product -100000 ₫ Sửa Xóa" [ref=e121]:
          - cell "Test Product" [ref=e122]:
            - img "Test Product" [ref=e123]
          - cell "Test Product" [ref=e124]
          - cell "-100000 ₫" [ref=e125]
          - cell "Sửa Xóa" [ref=e126]:
            - button "Sửa" [ref=e127] [cursor=pointer]
            - button "Xóa" [ref=e128] [cursor=pointer]
        - row "Test Product 1 Test Product 1 100000 ₫ Sửa Xóa" [ref=e129]:
          - cell "Test Product 1" [ref=e130]:
            - img "Test Product 1" [ref=e131]
          - cell "Test Product 1" [ref=e132]
          - cell "100000 ₫" [ref=e133]
          - cell "Sửa Xóa" [ref=e134]:
            - button "Sửa" [ref=e135] [cursor=pointer]
            - button "Xóa" [ref=e136] [cursor=pointer]
        - row "Test Product 2 Test Product 2 200000 ₫ Sửa Xóa" [ref=e137]:
          - cell "Test Product 2" [ref=e138]:
            - img "Test Product 2" [ref=e139]
          - cell "Test Product 2" [ref=e140]
          - cell "200000 ₫" [ref=e141]
          - cell "Sửa Xóa" [ref=e142]:
            - button "Sửa" [ref=e143] [cursor=pointer]
            - button "Xóa" [ref=e144] [cursor=pointer]
        - row "Test Product Test Product -100000 ₫ Sửa Xóa" [ref=e145]:
          - cell "Test Product" [ref=e146]:
            - img "Test Product" [ref=e147]
          - cell "Test Product" [ref=e148]
          - cell "-100000 ₫" [ref=e149]
          - cell "Sửa Xóa" [ref=e150]:
            - button "Sửa" [ref=e151] [cursor=pointer]
            - button "Xóa" [ref=e152] [cursor=pointer]
        - row "Test Product 1 Test Product 1 100000 ₫ Sửa Xóa" [ref=e153]:
          - cell "Test Product 1" [ref=e154]:
            - img "Test Product 1" [ref=e155]
          - cell "Test Product 1" [ref=e156]
          - cell "100000 ₫" [ref=e157]
          - cell "Sửa Xóa" [ref=e158]:
            - button "Sửa" [ref=e159] [cursor=pointer]
            - button "Xóa" [ref=e160] [cursor=pointer]
        - row "Test Product 2 Test Product 2 200000 ₫ Sửa Xóa" [ref=e161]:
          - cell "Test Product 2" [ref=e162]:
            - img "Test Product 2" [ref=e163]
          - cell "Test Product 2" [ref=e164]
          - cell "200000 ₫" [ref=e165]
          - cell "Sửa Xóa" [ref=e166]:
            - button "Sửa" [ref=e167] [cursor=pointer]
            - button "Xóa" [ref=e168] [cursor=pointer]
        - row "Test Product Test Product -100000 ₫ Sửa Xóa" [ref=e169]:
          - cell "Test Product" [ref=e170]:
            - img "Test Product" [ref=e171]
          - cell "Test Product" [ref=e172]
          - cell "-100000 ₫" [ref=e173]
          - cell "Sửa Xóa" [ref=e174]:
            - button "Sửa" [ref=e175] [cursor=pointer]
            - button "Xóa" [ref=e176] [cursor=pointer]
        - row "Test Product 1 Test Product 1 100000 ₫ Sửa Xóa" [ref=e177]:
          - cell "Test Product 1" [ref=e178]:
            - img "Test Product 1" [ref=e179]
          - cell "Test Product 1" [ref=e180]
          - cell "100000 ₫" [ref=e181]
          - cell "Sửa Xóa" [ref=e182]:
            - button "Sửa" [ref=e183] [cursor=pointer]
            - button "Xóa" [ref=e184] [cursor=pointer]
        - row "Test Product 2 Test Product 2 200000 ₫ Sửa Xóa" [ref=e185]:
          - cell "Test Product 2" [ref=e186]:
            - img "Test Product 2" [ref=e187]
          - cell "Test Product 2" [ref=e188]
          - cell "200000 ₫" [ref=e189]
          - cell "Sửa Xóa" [ref=e190]:
            - button "Sửa" [ref=e191] [cursor=pointer]
            - button "Xóa" [ref=e192] [cursor=pointer]
        - row "Test Product Test Product -100000 ₫ Sửa Xóa" [ref=e193]:
          - cell "Test Product" [ref=e194]:
            - img "Test Product" [ref=e195]
          - cell "Test Product" [ref=e196]
          - cell "-100000 ₫" [ref=e197]
          - cell "Sửa Xóa" [ref=e198]:
            - button "Sửa" [ref=e199] [cursor=pointer]
            - button "Xóa" [ref=e200] [cursor=pointer]
        - row "Test Product 1 Test Product 1 100000 ₫ Sửa Xóa" [ref=e201]:
          - cell "Test Product 1" [ref=e202]:
            - img "Test Product 1" [ref=e203]
          - cell "Test Product 1" [ref=e204]
          - cell "100000 ₫" [ref=e205]
          - cell "Sửa Xóa" [ref=e206]:
            - button "Sửa" [ref=e207] [cursor=pointer]
            - button "Xóa" [ref=e208] [cursor=pointer]
        - row "Test Product 2 Test Product 2 200000 ₫ Sửa Xóa" [ref=e209]:
          - cell "Test Product 2" [ref=e210]:
            - img "Test Product 2" [ref=e211]
          - cell "Test Product 2" [ref=e212]
          - cell "200000 ₫" [ref=e213]
          - cell "Sửa Xóa" [ref=e214]:
            - button "Sửa" [ref=e215] [cursor=pointer]
            - button "Xóa" [ref=e216] [cursor=pointer]
        - row "Test Product Test Product -100000 ₫ Sửa Xóa" [ref=e217]:
          - cell "Test Product" [ref=e218]:
            - img "Test Product" [ref=e219]
          - cell "Test Product" [ref=e220]
          - cell "-100000 ₫" [ref=e221]
          - cell "Sửa Xóa" [ref=e222]:
            - button "Sửa" [ref=e223] [cursor=pointer]
            - button "Xóa" [ref=e224] [cursor=pointer]
        - row "Test Product 1 Test Product 1 100000 ₫ Sửa Xóa" [ref=e225]:
          - cell "Test Product 1" [ref=e226]:
            - img "Test Product 1" [ref=e227]
          - cell "Test Product 1" [ref=e228]
          - cell "100000 ₫" [ref=e229]
          - cell "Sửa Xóa" [ref=e230]:
            - button "Sửa" [ref=e231] [cursor=pointer]
            - button "Xóa" [ref=e232] [cursor=pointer]
        - row "Test Product 2 Test Product 2 200000 ₫ Sửa Xóa" [ref=e233]:
          - cell "Test Product 2" [ref=e234]:
            - img "Test Product 2" [ref=e235]
          - cell "Test Product 2" [ref=e236]
          - cell "200000 ₫" [ref=e237]
          - cell "Sửa Xóa" [ref=e238]:
            - button "Sửa" [ref=e239] [cursor=pointer]
            - button "Xóa" [ref=e240] [cursor=pointer]
        - row "Test Product Test Product -100000 ₫ Sửa Xóa" [ref=e241]:
          - cell "Test Product" [ref=e242]:
            - img "Test Product" [ref=e243]
          - cell "Test Product" [ref=e244]
          - cell "-100000 ₫" [ref=e245]
          - cell "Sửa Xóa" [ref=e246]:
            - button "Sửa" [ref=e247] [cursor=pointer]
            - button "Xóa" [ref=e248] [cursor=pointer]
        - row "Test Product 1 Test Product 1 100000 ₫ Sửa Xóa" [ref=e249]:
          - cell "Test Product 1" [ref=e250]:
            - img "Test Product 1" [ref=e251]
          - cell "Test Product 1" [ref=e252]
          - cell "100000 ₫" [ref=e253]
          - cell "Sửa Xóa" [ref=e254]:
            - button "Sửa" [ref=e255] [cursor=pointer]
            - button "Xóa" [ref=e256] [cursor=pointer]
        - row "Test Product 2 Test Product 2 200000 ₫ Sửa Xóa" [ref=e257]:
          - cell "Test Product 2" [ref=e258]:
            - img "Test Product 2" [ref=e259]
          - cell "Test Product 2" [ref=e260]
          - cell "200000 ₫" [ref=e261]
          - cell "Sửa Xóa" [ref=e262]:
            - button "Sửa" [ref=e263] [cursor=pointer]
            - button "Xóa" [ref=e264] [cursor=pointer]
        - row "Test Product Test Product -100000 ₫ Sửa Xóa" [ref=e265]:
          - cell "Test Product" [ref=e266]:
            - img "Test Product" [ref=e267]
          - cell "Test Product" [ref=e268]
          - cell "-100000 ₫" [ref=e269]
          - cell "Sửa Xóa" [ref=e270]:
            - button "Sửa" [ref=e271] [cursor=pointer]
            - button "Xóa" [ref=e272] [cursor=pointer]
```

# Test source

```ts
  279 |       data: {
  280 |         products: []
  281 |       }
  282 |     });
  283 |     
  284 |     expect(response.ok()).toBeFalsy();
  285 |     const data = await response.json();
  286 |     expect(data.error).toContain('Không có dữ liệu');
  287 |   });
  288 | 
  289 |   // TC12: API test - Import without authentication
  290 |   test('TC12 - API: Import without authentication', async ({ request }) => {
  291 |     const response = await request.post(`${API_URL}/api/admin/import-products`, {
  292 |       data: {
  293 |         products: [
  294 |           {
  295 |             name: 'Test Product',
  296 |             price: 100000,
  297 |             description: 'Test description',
  298 |             imageUrl: 'https://placehold.co/300',
  299 |             category_id: 1
  300 |           }
  301 |         ]
  302 |       }
  303 |     });
  304 |     
  305 |     expect(response.ok()).toBeFalsy();
  306 |   });
  307 | 
  308 |   // TC13: Verify import button shows count of products
  309 |   test('TC13 - Import button shows count of products', async ({ page }) => {
  310 |     // Login as admin - use placeholder selectors (SUT has type="text" bug)
  311 |     await page.goto(BASE_URL);
  312 |     await page.fill('input[placeholder="Email"]', 'admin@eshop.com');
  313 |     await page.fill('input[type="password"]', 'Admin123!');
  314 |     await page.click('button:text("Login")');
  315 |     await page.waitForLoadState('networkidle');
  316 |     
  317 |     // Navigate to products tab
  318 |     await page.click('text=Sản phẩm');
  319 |     await page.waitForTimeout(1000);
  320 |     
  321 |     // Upload CSV file
  322 |     const fileInput = page.locator('input[type="file"]');
  323 |     await fileInput.setInputFiles(path.join(__dirname, '../test-data/fr16_valid_products.csv'));
  324 |     
  325 |     await page.waitForTimeout(1000);
  326 |     
  327 |     // Verify import button shows count
  328 |     const importButton = page.locator('button:text("Import 5 sản phẩm")');
  329 |     await expect(importButton).toBeVisible();
  330 |     const buttonText = await importButton.textContent();
  331 |     expect(buttonText).toMatch(/Import \d+ sản phẩm/);
  332 |   });
  333 | 
  334 |   // TC14: Verify preview table shows all columns
  335 |   test('TC14 - Preview table shows all columns', async ({ page }) => {
  336 |     // Login as admin - use placeholder selectors (SUT has type="text" bug)
  337 |     await page.goto(BASE_URL);
  338 |     await page.fill('input[placeholder="Email"]', 'admin@eshop.com');
  339 |     await page.fill('input[type="password"]', 'Admin123!');
  340 |     await page.click('button:text("Login")');
  341 |     await page.waitForLoadState('networkidle');
  342 |     
  343 |     // Navigate to products tab
  344 |     await page.click('text=Sản phẩm');
  345 |     await page.waitForTimeout(1000);
  346 |     
  347 |     // Upload CSV file
  348 |     const fileInput = page.locator('input[type="file"]');
  349 |     await fileInput.setInputFiles(path.join(__dirname, '../test-data/fr16_valid_products.csv'));
  350 |     
  351 |     await page.waitForTimeout(1000);
  352 |     
  353 |     // Verify preview table headers
  354 |     const nameHeader = page.locator('th:text("name")');
  355 |     await expect(nameHeader).toBeVisible();
  356 |     
  357 |     const priceHeader = page.locator('th:text("price")');
  358 |     await expect(priceHeader).toBeVisible();
  359 |     
  360 |     const descriptionHeader = page.locator('th:text("description")');
  361 |     await expect(descriptionHeader).toBeVisible();
  362 |   });
  363 | 
  364 |   // TC15: Verify import button is disabled before file selection
  365 |   test('TC15 - Import button is disabled before file selection', async ({ page }) => {
  366 |     // Login as admin - use placeholder selectors (SUT has type="text" bug)
  367 |     await page.goto(BASE_URL);
  368 |     await page.fill('input[placeholder="Email"]', 'admin@eshop.com');
  369 |     await page.fill('input[type="password"]', 'Admin123!');
  370 |     await page.click('button:text("Login")');
  371 |     await page.waitForLoadState('networkidle');
  372 |     
  373 |     // Navigate to products tab
  374 |     await page.click('text=Sản phẩm');
  375 |     await page.waitForTimeout(1000);
  376 |     
  377 |     // Verify import button is disabled
  378 |     const importButton = page.locator('button:text="Import 0 sản phẩm"');
> 379 |     await expect(importButton).toBeDisabled();
      |                                ^ Error: expect(locator).toBeDisabled() failed
  380 |   });
  381 | 
  382 |   // TC16: Verify CSV file with comma-containing fields
  383 |   test('TC16 - Verify CSV file with comma-containing fields', async ({ page }) => {
  384 |     // Login as admin - use placeholder selectors (SUT has type="text" bug)
  385 |     await page.goto(BASE_URL);
  386 |     await page.fill('input[placeholder="Email"]', 'admin@eshop.com');
  387 |     await page.fill('input[type="password"]', 'Admin123!');
  388 |     await page.click('button:text("Login")');
  389 |     await page.waitForLoadState('networkidle');
  390 |     
  391 |     // Navigate to products tab
  392 |     await page.click('text=Sản phẩm');
  393 |     await page.waitForTimeout(1000);
  394 |     
  395 |     // Upload CSV file with comma-containing fields
  396 |     const fileInput = page.locator('input[type="file"]');
  397 |     await fileInput.setInputFiles(path.join(__dirname, '../test-data/fr16_comma_fields.csv'));
  398 |     
  399 |     await page.waitForTimeout(1000);
  400 |     
  401 |     // Verify preview shows correct data
  402 |     const previewText = page.locator('text=/Xem trước/');
  403 |     await expect(previewText).toBeVisible({ timeout: 5000 });
  404 |   });
  405 | });
  406 | 
```