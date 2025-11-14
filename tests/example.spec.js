import { test, expect } from '@playwright/test';

test('saucedemo flow - slow & readable', async ({ page }) => {
  console.log("Opening SauceDemo site...");
  await page.goto('https://www.saucedemo.com/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000); 

  console.log("Filling login credentials...");
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.waitForTimeout(1000);

  console.log("Clicking login button...");
  await Promise.all([
    page.waitForURL('**/inventory.html'),
    page.locator('#login-button').click()
  ]);
  await page.waitForTimeout(1000);

  console.log("Selecting first product...");
  const firstProduct = page.locator('.inventory_item').first();
  const productName = (await firstProduct.locator('.inventory_item_name').textContent()).trim();
  console.log("Product name:", productName);

  console.log("Adding product to cart...");
  await firstProduct.locator('button').click();
  await page.waitForTimeout(1000);

  console.log("Going to cart...");
  await Promise.all([
    page.waitForURL('**/cart.html'),
    page.locator('.shopping_cart_link').click()
  ]);
  await page.waitForTimeout(1000);

  console.log("Verifying product name in cart...");
  const cartProduct = page.locator('.cart_item .inventory_item_name').first();
  await expect(cartProduct).toBeVisible();
  await expect(cartProduct).toHaveText(productName);
  await page.waitForTimeout(1000);

  console.log("Logging out...");
  await page.locator('#react-burger-menu-btn').click();
  await page.waitForTimeout(1000); 
  await page.locator('#logout_sidebar_link').click();
  await page.waitForTimeout(1000);

  console.log("Test completed successfully!");
});
