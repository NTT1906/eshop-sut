const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle' });

  // Inspect field attributes
  const nameAttrs = await page.$eval('input[name="name"], input#name, input[placeholder*="tên"], input[placeholder*="Tên"], input:nth-of-type(1)', el => ({
    type: el.type,
    maxlength: el.maxLength,
    required: el.required,
    placeholder: el.placeholder,
    name: el.name,
    id: el.id
  })).catch(() => 'NOT FOUND by name selector');

  const emailAttrs = await page.$eval('input[type="email"], input[name="email"], input#email', el => ({
    type: el.type,
    maxlength: el.maxLength,
    required: el.required,
    placeholder: el.placeholder,
    name: el.name,
    id: el.id
  })).catch(() => 'NOT FOUND');

  const passwordAttrs = await page.$eval('input[type="password"], input[name="password"], input#password', el => ({
    type: el.type,
    maxlength: el.maxLength,
    required: el.required,
    placeholder: el.placeholder,
    name: el.name,
    id: el.id,
    minlength: el.minLength
  })).catch(() => 'NOT FOUND');

  // Get all inputs on page
  const allInputs = await page.$$eval('input', inputs => inputs.map(el => ({
    type: el.type,
    name: el.name,
    id: el.id,
    maxlength: el.maxLength,
    minlength: el.minLength,
    required: el.required,
    placeholder: el.placeholder
  })));

  console.log('=== ALL INPUTS ===');
  console.log(JSON.stringify(allInputs, null, 2));
  console.log('=== NAME FIELD ===');
  console.log(JSON.stringify(nameAttrs, null, 2));
  console.log('=== EMAIL FIELD ===');
  console.log(JSON.stringify(emailAttrs, null, 2));
  console.log('=== PASSWORD FIELD ===');
  console.log(JSON.stringify(passwordAttrs, null, 2));

  await browser.close();
})();
