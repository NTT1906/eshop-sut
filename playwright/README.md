# HW04 - Automation Testing Report

## Student Information

| Field | Value |
|-------|-------|
| **Student ID** | 23127053 |
| **Features Automated** | FR-05, FR-09, FR-16 |
| **Automation Framework** | Playwright |
| **Test Runner** | Node.js |

---

## Test Summary

| Metric | Count |
|--------|-------|
| **Features Automated** | 3 |
| **Total Test Cases** | 44 |
| **FR-05 Test Cases** | 16 |
| **FR-09 Test Cases** | 12 |
| **FR-16 Test Cases** | 16 |
| **Browser Runs** | 9 (3 browsers × 3 features) |
| **Browsers Tested** | Chromium, Firefox, WebKit |

---

## Features Automated

### FR-05: Product Listing and Search (16 Test Cases)

| TC ID | Test Case Description | Type |
|-------|----------------------|------|
| TC01 | Homepage displays products in grid layout | Positive |
| TC02 | Product card contains image, name, and price | Positive |
| TC03 | Product image has alt text | Positive |
| TC04 | Price format includes thousand separators | Positive |
| TC05 | Search bar exists and is functional | Positive |
| TC06 | Search with existing product keyword | Positive |
| TC07 | Search with non-existent keyword shows empty state | Negative |
| TC08 | Search keyword is safely displayed (XSS prevention) | Security |
| TC09 | Only one h1 tag exists on homepage | Positive |
| TC10 | H1 tag content is correct | Positive |
| TC11 | Search with single character | Edge |
| TC12 | Search with special characters | Edge |
| TC13 | Xem chi tiết button exists on product cards | Positive |
| TC14 | Thêm vào giỏ button exists on product cards | Positive |
| TC15 | Product count is displayed | Positive |
| TC16 | Search with whitespace only | Edge |

### FR-09: Discount Coupons (12 Test Cases)

| TC ID | Test Case Description | Type |
|-------|----------------------|------|
| TC01 | Coupon input field exists on checkout page | Positive |
| TC02 | Apply valid percent coupon (SAVE10) | Positive |
| TC03 | Apply expired coupon (EXPIRED) | Negative |
| TC04 | Apply non-existent coupon | Negative |
| TC05 | Apply coupon with empty code | Edge |
| TC06 | Discount amount calculated correctly for percent coupon | Positive |
| TC07 | Final amount calculated correctly | Positive |
| TC08 | API: Apply valid coupon | API |
| TC09 | API: Apply expired coupon | API |
| TC10 | API: Apply coupon below minimum order | API |
| TC11 | API: Apply non-existent coupon | API |
| TC12 | API: Apply fixed coupon (BIGBUY) | API |

### FR-16: Product Import from CSV (16 Test Cases)

| TC ID | Test Case Description | Type |
|-------|----------------------|------|
| TC01 | CSV import section exists in admin panel | Positive |
| TC02 | File upload input exists | Positive |
| TC03 | Template download link exists | Positive |
| TC04 | Upload valid CSV file | Positive |
| TC05 | Import valid CSV file | Positive |
| TC06 | Upload CSV file with invalid data | Negative |
| TC07 | Import CSV file with validation errors | Negative |
| TC08 | API: Import valid products | API |
| TC09 | API: Import with empty name | API |
| TC10 | API: Import with negative price | API |
| TC11 | API: Import empty array | API |
| TC12 | API: Import without authentication | Security |
| TC13 | Import button shows count of products | Positive |
| TC14 | Preview table shows all columns | Positive |
| TC15 | Import button is disabled before file selection | Positive |
| TC16 | Verify CSV file with comma-containing fields | Edge |

---

## Test Data Files

| File | Purpose |
|------|---------|
| `fr05_search_data.json` | Search keywords and validation rules for FR-05 |
| `fr09_coupon_data.json` | Coupon test scenarios and validation rules for FR-09 |
| `fr16_valid_products.csv` | Valid CSV file for import testing |
| `fr16_invalid_products.csv` | CSV file with validation errors |
| `fr16_comma_fields.csv` | CSV file with comma-containing fields (RFC 4180) |
| `fr16_empty_rows.csv` | CSV file with empty rows |

---

## How to Run Tests

### Prerequisites
1. Start the backend server: `cd backend && node server.js`
2. Start the frontend web server: `cd frontend-web && npm run dev`
3. Start the frontend admin server: `cd frontend-admin && npm run dev`

### Run All Tests
```bash
cd playwright
npm run test:all
```

### Run Tests by Feature
```bash
# FR-05: Product Listing and Search
npm run test:fr05

# FR-09: Discount Coupons
npm run test:fr09

# FR-16: Product Import from CSV
npm run test:fr16
```

### Run Tests by Browser
```bash
# Chromium
npm run test:chromium

# Firefox
npm run test:firefox

# WebKit
npm run test:webkit
```

---

## HTML Reports

After running tests, HTML reports are generated in the `reports/` directory. Each report contains:
- Test execution summary
- Pass/Fail status for each test
- Screenshots for failed tests
- Execution timeline
- **Run by: 23127053** (visible in report metadata)

---

## Assertion Patterns Used

1. **Visibility Assertions**: `await expect(element).toBeVisible()`
2. **Text Content Assertions**: `await expect(element).toHaveText('expected')`
3. **Count Assertions**: `expect(count).toBeGreaterThan(0)`
4. **API Response Assertions**: `expect(response.ok()).toBeTruthy()`
5. **CSS Class Assertions**: `await expect(element).toHaveClass(/pattern/)`

---

## Known Issues

1. **XSS Test (TC08)**: The search results use `dangerouslySetInnerHTML` which may render HTML. The test verifies no alert dialog appears, but the actual rendering behavior should be reviewed.

2. **Admin Panel Navigation**: Tests for FR-16 require navigating to the admin panel at port 5174, which may have different URL patterns.

---

## Files Structure

```
playwright/
├── playwright.config.js
├── package.json
├── run-all-tests.js
├── test-data/
│   ├── fr05_search_data.json
│   ├── fr09_coupon_data.json
│   ├── fr16_valid_products.csv
│   ├── fr16_invalid_products.csv
│   ├── fr16_comma_fields.csv
│   └── fr16_empty_rows.csv
└── tests/
    ├── fr05-product-listing.spec.js
    ├── fr09-discount-coupons.spec.js
    └── fr16-product-import.spec.js
```

---

## Self-Assessment

| No. | Criteria | Grade | Self-Assessed Grade |
|-----|----------|-------|---------------------|
| 1 | Task 1 - Feature A (FR-05) | 25 | 22 |
| 1 | Task 1 - Feature B (FR-09) | 25 | 22 |
| 1 | Task 1 - Feature C (FR-16) | 25 | 22 |
| 2 | Task 2 — Demo video | 15 | 12 |
| 3 | Agent Skills | 10 | 8 |
| | **Total** | **100** | **86** |
