# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr16-product-import.spec.js >> FR-16: Product Import from CSV >> TC05 - Import valid CSV file
- Location: tests\fr16-product-import.spec.js:106:3

# Error details

```
Error: locator.click: Unknown engine "button:text" while parsing selector button:text=/Import \d+ sản phẩm/
Call log:
  - waiting for locator('button:text=/Import \\d+ sản phẩm/')

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
        - button "Import 5 sản phẩm" [ref=e23] [cursor=pointer]
      - generic [ref=e24]:
        - paragraph [ref=e25]: "Xem trước (5 dòng):"
        - table [ref=e27]:
          - rowgroup [ref=e28]:
            - row "name price description imageUrl category_id" [ref=e29]:
              - columnheader "name" [ref=e30]
              - columnheader "price" [ref=e31]
              - columnheader "description" [ref=e32]
              - columnheader "imageUrl" [ref=e33]
              - columnheader "category_id" [ref=e34]
          - rowgroup [ref=e35]:
            - row "Áo sơ mi nam 250000 Áo sơ mi cotton cao cấp https://placehold.co/300 1" [ref=e36]:
              - cell "Áo sơ mi nam" [ref=e37]
              - cell "250000" [ref=e38]
              - cell "Áo sơ mi cotton cao cấp" [ref=e39]
              - cell "https://placehold.co/300" [ref=e40]
              - cell "1" [ref=e41]
            - row "Quần jean nữ 350000 Quần jean ống rộng thời trang https://placehold.co/300 2" [ref=e42]:
              - cell "Quần jean nữ" [ref=e43]
              - cell "350000" [ref=e44]
              - cell "Quần jean ống rộng thời trang" [ref=e45]
              - cell "https://placehold.co/300" [ref=e46]
              - cell "2" [ref=e47]
            - row "Giày thể thao 450000 Giày sneaker phong cách https://placehold.co/300 3" [ref=e48]:
              - cell "Giày thể thao" [ref=e49]
              - cell "450000" [ref=e50]
              - cell "Giày sneaker phong cách" [ref=e51]
              - cell "https://placehold.co/300" [ref=e52]
              - cell "3" [ref=e53]
            - row "Túi xách da 550000 Túi xách da thật cao cấp https://placehold.co/300 4" [ref=e54]:
              - cell "Túi xách da" [ref=e55]
              - cell "550000" [ref=e56]
              - cell "Túi xách da thật cao cấp" [ref=e57]
              - cell "https://placehold.co/300" [ref=e58]
              - cell "4" [ref=e59]
            - row "Đồng hồ nam 1200000 Đồng hồ cơ automatic https://placehold.co/300 5" [ref=e60]:
              - cell "Đồng hồ nam" [ref=e61]
              - cell "1200000" [ref=e62]
              - cell "Đồng hồ cơ automatic" [ref=e63]
              - cell "https://placehold.co/300" [ref=e64]
              - cell "5" [ref=e65]
    - generic [ref=e66]:
      - heading "Thêm sản phẩm mới" [level=3] [ref=e67]
      - generic [ref=e68]:
        - textbox "Tên sản phẩm" [ref=e69]
        - spinbutton [ref=e70]
        - textbox "URL Ảnh" [ref=e71]
        - textbox "Mô tả" [ref=e72]
        - combobox [ref=e73]:
          - option "Điện thoại" [selected]
          - option "Laptop"
          - option "Phụ kiện"
      - button "Lưu sản phẩm" [ref=e74] [cursor=pointer]
    - table [ref=e75]:
      - rowgroup [ref=e76]:
        - row "Ảnh Tên SP Giá Hành động" [ref=e77]:
          - columnheader "Ảnh" [ref=e78]
          - columnheader "Tên SP" [ref=e79]
          - columnheader "Giá" [ref=e80]
          - columnheader "Hành động" [ref=e81]
      - rowgroup [ref=e82]:
        - row "iPhone 15 Pro Max iPhone 15 Pro Max 30000000 ₫ Sửa Xóa" [ref=e83]:
          - cell "iPhone 15 Pro Max" [ref=e84]:
            - img "iPhone 15 Pro Max" [ref=e85]
          - cell "iPhone 15 Pro Max" [ref=e86]
          - cell "30000000 ₫" [ref=e87]
          - cell "Sửa Xóa" [ref=e88]:
            - button "Sửa" [ref=e89] [cursor=pointer]
            - button "Xóa" [ref=e90] [cursor=pointer]
        - row "Samsung Galaxy S24 Ultra Samsung Galaxy S24 Ultra 28000000 ₫ Sửa Xóa" [ref=e91]:
          - cell "Samsung Galaxy S24 Ultra" [ref=e92]:
            - img "Samsung Galaxy S24 Ultra" [ref=e93]
          - cell "Samsung Galaxy S24 Ultra" [ref=e94]
          - cell "28000000 ₫" [ref=e95]
          - cell "Sửa Xóa" [ref=e96]:
            - button "Sửa" [ref=e97] [cursor=pointer]
            - button "Xóa" [ref=e98] [cursor=pointer]
        - row "MacBook Pro M3 MacBook Pro M3 45000000 ₫ Sửa Xóa" [ref=e99]:
          - cell "MacBook Pro M3" [ref=e100]:
            - img "MacBook Pro M3" [ref=e101]
          - cell "MacBook Pro M3" [ref=e102]
          - cell "45000000 ₫" [ref=e103]
          - cell "Sửa Xóa" [ref=e104]:
            - button "Sửa" [ref=e105] [cursor=pointer]
            - button "Xóa" [ref=e106] [cursor=pointer]
        - row "Tai nghe AirPods Pro 2 Tai nghe AirPods Pro 2 6000000 ₫ Sửa Xóa" [ref=e107]:
          - cell "Tai nghe AirPods Pro 2" [ref=e108]:
            - img "Tai nghe AirPods Pro 2" [ref=e109]
          - cell "Tai nghe AirPods Pro 2" [ref=e110]
          - cell "6000000 ₫" [ref=e111]
          - cell "Sửa Xóa" [ref=e112]:
            - button "Sửa" [ref=e113] [cursor=pointer]
            - button "Xóa" [ref=e114] [cursor=pointer]
        - row "Bàn phím cơ Keychron Q1 Bàn phím cơ Keychron Q1 4000000 ₫ Sửa Xóa" [ref=e115]:
          - cell "Bàn phím cơ Keychron Q1" [ref=e116]:
            - img "Bàn phím cơ Keychron Q1" [ref=e117]
          - cell "Bàn phím cơ Keychron Q1" [ref=e118]
          - cell "4000000 ₫" [ref=e119]
          - cell "Sửa Xóa" [ref=e120]:
            - button "Sửa" [ref=e121] [cursor=pointer]
            - button "Xóa" [ref=e122] [cursor=pointer]
        - row "Test Product 1 Test Product 1 100000 ₫ Sửa Xóa" [ref=e123]:
          - cell "Test Product 1" [ref=e124]:
            - img "Test Product 1" [ref=e125]
          - cell "Test Product 1" [ref=e126]
          - cell "100000 ₫" [ref=e127]
          - cell "Sửa Xóa" [ref=e128]:
            - button "Sửa" [ref=e129] [cursor=pointer]
            - button "Xóa" [ref=e130] [cursor=pointer]
        - row "Test Product 2 Test Product 2 200000 ₫ Sửa Xóa" [ref=e131]:
          - cell "Test Product 2" [ref=e132]:
            - img "Test Product 2" [ref=e133]
          - cell "Test Product 2" [ref=e134]
          - cell "200000 ₫" [ref=e135]
          - cell "Sửa Xóa" [ref=e136]:
            - button "Sửa" [ref=e137] [cursor=pointer]
            - button "Xóa" [ref=e138] [cursor=pointer]
        - row "Test Product Test Product -100000 ₫ Sửa Xóa" [ref=e139]:
          - cell "Test Product" [ref=e140]:
            - img "Test Product" [ref=e141]
          - cell "Test Product" [ref=e142]
          - cell "-100000 ₫" [ref=e143]
          - cell "Sửa Xóa" [ref=e144]:
            - button "Sửa" [ref=e145] [cursor=pointer]
            - button "Xóa" [ref=e146] [cursor=pointer]
        - row "Test Product 1 Test Product 1 100000 ₫ Sửa Xóa" [ref=e147]:
          - cell "Test Product 1" [ref=e148]:
            - img "Test Product 1" [ref=e149]
          - cell "Test Product 1" [ref=e150]
          - cell "100000 ₫" [ref=e151]
          - cell "Sửa Xóa" [ref=e152]:
            - button "Sửa" [ref=e153] [cursor=pointer]
            - button "Xóa" [ref=e154] [cursor=pointer]
        - row "Test Product 2 Test Product 2 200000 ₫ Sửa Xóa" [ref=e155]:
          - cell "Test Product 2" [ref=e156]:
            - img "Test Product 2" [ref=e157]
          - cell "Test Product 2" [ref=e158]
          - cell "200000 ₫" [ref=e159]
          - cell "Sửa Xóa" [ref=e160]:
            - button "Sửa" [ref=e161] [cursor=pointer]
            - button "Xóa" [ref=e162] [cursor=pointer]
        - row "Test Product Test Product -100000 ₫ Sửa Xóa" [ref=e163]:
          - cell "Test Product" [ref=e164]:
            - img "Test Product" [ref=e165]
          - cell "Test Product" [ref=e166]
          - cell "-100000 ₫" [ref=e167]
          - cell "Sửa Xóa" [ref=e168]:
            - button "Sửa" [ref=e169] [cursor=pointer]
            - button "Xóa" [ref=e170] [cursor=pointer]
        - row "Test Product 1 Test Product 1 100000 ₫ Sửa Xóa" [ref=e171]:
          - cell "Test Product 1" [ref=e172]:
            - img "Test Product 1" [ref=e173]
          - cell "Test Product 1" [ref=e174]
          - cell "100000 ₫" [ref=e175]
          - cell "Sửa Xóa" [ref=e176]:
            - button "Sửa" [ref=e177] [cursor=pointer]
            - button "Xóa" [ref=e178] [cursor=pointer]
        - row "Test Product 2 Test Product 2 200000 ₫ Sửa Xóa" [ref=e179]:
          - cell "Test Product 2" [ref=e180]:
            - img "Test Product 2" [ref=e181]
          - cell "Test Product 2" [ref=e182]
          - cell "200000 ₫" [ref=e183]
          - cell "Sửa Xóa" [ref=e184]:
            - button "Sửa" [ref=e185] [cursor=pointer]
            - button "Xóa" [ref=e186] [cursor=pointer]
        - row "Test Product Test Product -100000 ₫ Sửa Xóa" [ref=e187]:
          - cell "Test Product" [ref=e188]:
            - img "Test Product" [ref=e189]
          - cell "Test Product" [ref=e190]
          - cell "-100000 ₫" [ref=e191]
          - cell "Sửa Xóa" [ref=e192]:
            - button "Sửa" [ref=e193] [cursor=pointer]
            - button "Xóa" [ref=e194] [cursor=pointer]
        - row "Test Product 1 Test Product 1 100000 ₫ Sửa Xóa" [ref=e195]:
          - cell "Test Product 1" [ref=e196]:
            - img "Test Product 1" [ref=e197]
          - cell "Test Product 1" [ref=e198]
          - cell "100000 ₫" [ref=e199]
          - cell "Sửa Xóa" [ref=e200]:
            - button "Sửa" [ref=e201] [cursor=pointer]
            - button "Xóa" [ref=e202] [cursor=pointer]
        - row "Test Product 2 Test Product 2 200000 ₫ Sửa Xóa" [ref=e203]:
          - cell "Test Product 2" [ref=e204]:
            - img "Test Product 2" [ref=e205]
          - cell "Test Product 2" [ref=e206]
          - cell "200000 ₫" [ref=e207]
          - cell "Sửa Xóa" [ref=e208]:
            - button "Sửa" [ref=e209] [cursor=pointer]
            - button "Xóa" [ref=e210] [cursor=pointer]
        - row "Test Product Test Product -100000 ₫ Sửa Xóa" [ref=e211]:
          - cell "Test Product" [ref=e212]:
            - img "Test Product" [ref=e213]
          - cell "Test Product" [ref=e214]
          - cell "-100000 ₫" [ref=e215]
          - cell "Sửa Xóa" [ref=e216]:
            - button "Sửa" [ref=e217] [cursor=pointer]
            - button "Xóa" [ref=e218] [cursor=pointer]
        - row "Test Product 1 Test Product 1 100000 ₫ Sửa Xóa" [ref=e219]:
          - cell "Test Product 1" [ref=e220]:
            - img "Test Product 1" [ref=e221]
          - cell "Test Product 1" [ref=e222]
          - cell "100000 ₫" [ref=e223]
          - cell "Sửa Xóa" [ref=e224]:
            - button "Sửa" [ref=e225] [cursor=pointer]
            - button "Xóa" [ref=e226] [cursor=pointer]
        - row "Test Product 2 Test Product 2 200000 ₫ Sửa Xóa" [ref=e227]:
          - cell "Test Product 2" [ref=e228]:
            - img "Test Product 2" [ref=e229]
          - cell "Test Product 2" [ref=e230]
          - cell "200000 ₫" [ref=e231]
          - cell "Sửa Xóa" [ref=e232]:
            - button "Sửa" [ref=e233] [cursor=pointer]
            - button "Xóa" [ref=e234] [cursor=pointer]
        - row "Test Product Test Product -100000 ₫ Sửa Xóa" [ref=e235]:
          - cell "Test Product" [ref=e236]:
            - img "Test Product" [ref=e237]
          - cell "Test Product" [ref=e238]
          - cell "-100000 ₫" [ref=e239]
          - cell "Sửa Xóa" [ref=e240]:
            - button "Sửa" [ref=e241] [cursor=pointer]
            - button "Xóa" [ref=e242] [cursor=pointer]
        - row "Test Product 1 Test Product 1 100000 ₫ Sửa Xóa" [ref=e243]:
          - cell "Test Product 1" [ref=e244]:
            - img "Test Product 1" [ref=e245]
          - cell "Test Product 1" [ref=e246]
          - cell "100000 ₫" [ref=e247]
          - cell "Sửa Xóa" [ref=e248]:
            - button "Sửa" [ref=e249] [cursor=pointer]
            - button "Xóa" [ref=e250] [cursor=pointer]
        - row "Test Product 2 Test Product 2 200000 ₫ Sửa Xóa" [ref=e251]:
          - cell "Test Product 2" [ref=e252]:
            - img "Test Product 2" [ref=e253]
          - cell "Test Product 2" [ref=e254]
          - cell "200000 ₫" [ref=e255]
          - cell "Sửa Xóa" [ref=e256]:
            - button "Sửa" [ref=e257] [cursor=pointer]
            - button "Xóa" [ref=e258] [cursor=pointer]
        - row "Test Product Test Product -100000 ₫ Sửa Xóa" [ref=e259]:
          - cell "Test Product" [ref=e260]:
            - img "Test Product" [ref=e261]
          - cell "Test Product" [ref=e262]
          - cell "-100000 ₫" [ref=e263]
          - cell "Sửa Xóa" [ref=e264]:
            - button "Sửa" [ref=e265] [cursor=pointer]
            - button "Xóa" [ref=e266] [cursor=pointer]
        - row "Test Product 1 Test Product 1 100000 ₫ Sửa Xóa" [ref=e267]:
          - cell "Test Product 1" [ref=e268]:
            - img "Test Product 1" [ref=e269]
          - cell "Test Product 1" [ref=e270]
          - cell "100000 ₫" [ref=e271]
          - cell "Sửa Xóa" [ref=e272]:
            - button "Sửa" [ref=e273] [cursor=pointer]
            - button "Xóa" [ref=e274] [cursor=pointer]
        - row "Test Product 2 Test Product 2 200000 ₫ Sửa Xóa" [ref=e275]:
          - cell "Test Product 2" [ref=e276]:
            - img "Test Product 2" [ref=e277]
          - cell "Test Product 2" [ref=e278]
          - cell "200000 ₫" [ref=e279]
          - cell "Sửa Xóa" [ref=e280]:
            - button "Sửa" [ref=e281] [cursor=pointer]
            - button "Xóa" [ref=e282] [cursor=pointer]
        - row "Test Product Test Product -100000 ₫ Sửa Xóa" [ref=e283]:
          - cell "Test Product" [ref=e284]:
            - img "Test Product" [ref=e285]
          - cell "Test Product" [ref=e286]
          - cell "-100000 ₫" [ref=e287]
          - cell "Sửa Xóa" [ref=e288]:
            - button "Sửa" [ref=e289] [cursor=pointer]
            - button "Xóa" [ref=e290] [cursor=pointer]
```

# Test source

```ts
  26  | 
  27  |   // TC01: Verify CSV import section exists in admin panel
  28  |   test('TC01 - CSV import section exists in admin panel', async ({ page }) => {
  29  |     // Login as admin - use placeholder selectors (SUT has type="text" bug)
  30  |     await page.goto(BASE_URL);
  31  |     await page.fill('input[placeholder="Email"]', 'admin@eshop.com');
  32  |     await page.fill('input[type="password"]', 'Admin123!');
  33  |     await page.click('button:text("Login")');
  34  |     await page.waitForLoadState('networkidle');
  35  |     
  36  |     // Navigate to products tab
  37  |     await page.click('text=Sản phẩm');
  38  |     await page.waitForTimeout(1000);
  39  |     
  40  |     // Verify CSV import section exists
  41  |     const importSection = page.locator('text=Import sản phẩm từ CSV');
  42  |     await expect(importSection).toBeVisible();
  43  |   });
  44  | 
  45  |   // TC02: Verify file upload input exists
  46  |   test('TC02 - File upload input exists', async ({ page }) => {
  47  |     // Login as admin - use placeholder selectors (SUT has type="text" bug)
  48  |     await page.goto(BASE_URL);
  49  |     await page.fill('input[placeholder="Email"]', 'admin@eshop.com');
  50  |     await page.fill('input[type="password"]', 'Admin123!');
  51  |     await page.click('button:text("Login")');
  52  |     await page.waitForLoadState('networkidle');
  53  |     
  54  |     // Navigate to products tab
  55  |     await page.click('text=Sản phẩm');
  56  |     await page.waitForTimeout(1000);
  57  |     
  58  |     // Verify file input exists
  59  |     const fileInput = page.locator('input[type="file"]');
  60  |     await expect(fileInput).toBeVisible();
  61  |   });
  62  | 
  63  |   // TC03: Verify template download link exists
  64  |   test('TC03 - Template download link exists', async ({ page }) => {
  65  |     // Login as admin - use placeholder selectors (SUT has type="text" bug)
  66  |     await page.goto(BASE_URL);
  67  |     await page.fill('input[placeholder="Email"]', 'admin@eshop.com');
  68  |     await page.fill('input[type="password"]', 'Admin123!');
  69  |     await page.click('button:text("Login")');
  70  |     await page.waitForLoadState('networkidle');
  71  |     
  72  |     // Navigate to products tab
  73  |     await page.click('text=Sản phẩm');
  74  |     await page.waitForTimeout(1000);
  75  |     
  76  |     // Verify template download link exists
  77  |     const templateLink = page.locator('a:text("Tải file mẫu")');
  78  |     await expect(templateLink).toBeVisible();
  79  |   });
  80  | 
  81  |   // TC04: Upload valid CSV file
  82  |   test('TC04 - Upload valid CSV file', async ({ page }) => {
  83  |     // Login as admin - use placeholder selectors (SUT has type="text" bug)
  84  |     await page.goto(BASE_URL);
  85  |     await page.fill('input[placeholder="Email"]', 'admin@eshop.com');
  86  |     await page.fill('input[type="password"]', 'Admin123!');
  87  |     await page.click('button:text("Login")');
  88  |     await page.waitForLoadState('networkidle');
  89  |     
  90  |     // Navigate to products tab
  91  |     await page.click('text=Sản phẩm');
  92  |     await page.waitForTimeout(1000);
  93  |     
  94  |     // Upload valid CSV file
  95  |     const fileInput = page.locator('input[type="file"]');
  96  |     await fileInput.setInputFiles(path.join(__dirname, '../test-data/fr16_valid_products.csv'));
  97  |     
  98  |     await page.waitForTimeout(1000);
  99  |     
  100 |     // Verify preview is shown
  101 |     const previewText = page.locator('text=/Xem trước/');
  102 |     await expect(previewText).toBeVisible({ timeout: 5000 });
  103 |   });
  104 | 
  105 |   // TC05: Import valid CSV file
  106 |   test('TC05 - Import valid CSV file', async ({ page }) => {
  107 |     // Login as admin - use placeholder selectors (SUT has type="text" bug)
  108 |     await page.goto(BASE_URL);
  109 |     await page.fill('input[placeholder="Email"]', 'admin@eshop.com');
  110 |     await page.fill('input[type="password"]', 'Admin123!');
  111 |     await page.click('button:text("Login")');
  112 |     await page.waitForLoadState('networkidle');
  113 |     
  114 |     // Navigate to products tab
  115 |     await page.click('text=Sản phẩm');
  116 |     await page.waitForTimeout(1000);
  117 |     
  118 |     // Upload valid CSV file
  119 |     const fileInput = page.locator('input[type="file"]');
  120 |     await fileInput.setInputFiles(path.join(__dirname, '../test-data/fr16_valid_products.csv'));
  121 |     
  122 |     await page.waitForTimeout(1000);
  123 |     
  124 |     // Click import button
  125 |     const importButton = page.locator('button:text=/Import \\d+ sản phẩm/');
> 126 |     await importButton.click();
      |                        ^ Error: locator.click: Unknown engine "button:text" while parsing selector button:text=/Import \d+ sản phẩm/
  127 |     
  128 |     await page.waitForTimeout(3000);
  129 |     
  130 |     // Verify success message
  131 |     const successMessage = page.locator('.bg-green-100');
  132 |     await expect(successMessage).toBeVisible({ timeout: 5000 });
  133 |   });
  134 | 
  135 |   // TC06: Upload CSV file with invalid data
  136 |   test('TC06 - Upload CSV file with invalid data', async ({ page }) => {
  137 |     // Login as admin - use placeholder selectors (SUT has type="text" bug)
  138 |     await page.goto(BASE_URL);
  139 |     await page.fill('input[placeholder="Email"]', 'admin@eshop.com');
  140 |     await page.fill('input[type="password"]', 'Admin123!');
  141 |     await page.click('button:text("Login")');
  142 |     await page.waitForLoadState('networkidle');
  143 |     
  144 |     // Navigate to products tab
  145 |     await page.click('text=Sản phẩm');
  146 |     await page.waitForTimeout(1000);
  147 |     
  148 |     // Upload invalid CSV file
  149 |     const fileInput = page.locator('input[type="file"]');
  150 |     await fileInput.setInputFiles(path.join(__dirname, '../test-data/fr16_invalid_products.csv'));
  151 |     
  152 |     await page.waitForTimeout(1000);
  153 |     
  154 |     // Verify preview is shown
  155 |     const previewText = page.locator('text=/Xem trước/');
  156 |     await expect(previewText).toBeVisible({ timeout: 5000 });
  157 |   });
  158 | 
  159 |   // TC07: Import CSV file with validation errors
  160 |   test('TC07 - Import CSV file with validation errors', async ({ page }) => {
  161 |     // Login as admin - use placeholder selectors (SUT has type="text" bug)
  162 |     await page.goto(BASE_URL);
  163 |     await page.fill('input[placeholder="Email"]', 'admin@eshop.com');
  164 |     await page.fill('input[type="password"]', 'Admin123!');
  165 |     await page.click('button:text("Login")');
  166 |     await page.waitForLoadState('networkidle');
  167 |     
  168 |     // Navigate to products tab
  169 |     await page.click('text=Sản phẩm');
  170 |     await page.waitForTimeout(1000);
  171 |     
  172 |     // Upload invalid CSV file
  173 |     const fileInput = page.locator('input[type="file"]');
  174 |     await fileInput.setInputFiles(path.join(__dirname, '../test-data/fr16_invalid_products.csv'));
  175 |     
  176 |     await page.waitForTimeout(1000);
  177 |     
  178 |     // Click import button
  179 |     const importButton = page.locator('button:text=/Import \\d+ sản phẩm/');
  180 |     await importButton.click();
  181 |     
  182 |     await page.waitForTimeout(3000);
  183 |     
  184 |     // Verify error message or validation errors are shown
  185 |     const errorMessage = page.locator('.bg-red-100, .text-red-600');
  186 |     const hasError = await errorMessage.count();
  187 |     // Either success with errors or pure error
  188 |     expect(hasError).toBeGreaterThanOrEqual(0);
  189 |   });
  190 | 
  191 |   // TC08: API test - Import valid products
  192 |   test('TC08 - API: Import valid products', async ({ request }) => {
  193 |     const response = await request.post(`${API_URL}/api/admin/import-products`, {
  194 |       headers: {
  195 |         'Authorization': `Bearer ${adminToken}`
  196 |       },
  197 |       data: {
  198 |         products: [
  199 |           {
  200 |             name: 'Test Product 1',
  201 |             price: 100000,
  202 |             description: 'Test description',
  203 |             imageUrl: 'https://placehold.co/300',
  204 |             category_id: 1
  205 |           },
  206 |           {
  207 |             name: 'Test Product 2',
  208 |             price: 200000,
  209 |             description: 'Test description 2',
  210 |             imageUrl: 'https://placehold.co/300',
  211 |             category_id: 1
  212 |           }
  213 |         ]
  214 |       }
  215 |     });
  216 |     
  217 |     expect(response.ok()).toBeTruthy();
  218 |     const data = await response.json();
  219 |     expect(data.message).toContain('Import hoàn tất');
  220 |     expect(data.inserted).toBe(2);
  221 |   });
  222 | 
  223 |   // TC09: API test - Import with empty name
  224 |   test('TC09 - API: Import with empty name', async ({ request }) => {
  225 |     const response = await request.post(`${API_URL}/api/admin/import-products`, {
  226 |       headers: {
```