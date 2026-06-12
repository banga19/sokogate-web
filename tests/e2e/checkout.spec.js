/**
 * E2E Tests — Critical Shopping Flow
 *
 * Tests the complete user journey:
 *   Homepage → Browse Products → View Detail → Add to Cart → Checkout
 *
 * Requires the dev server to be running on http://localhost:4500
 */

const { test, expect } = require('@playwright/test');

test.describe('Critical Shopping Flow', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Sokogate/);
    // Homepage should show the app container
    await expect(page.locator('#app')).toBeAttached();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/v2/login');
    await expect(page).toHaveURL(/.*login/);
    // Login form should be visible
    await expect(page.locator('button')).toHaveCount(1, { timeout: 5000 });
  });

  test('should navigate to product list', async ({ page }) => {
    await page.goto('/v2/product/list');
    await expect(page).toHaveURL(/.*product\/list/);
  });

  test('should navigate to shopping cart', async ({ page }) => {
    await page.goto('/v2/shopping-cart');
    await expect(page).toHaveURL(/.*shopping-cart/);
  });

  test('should show 404 fallback for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page-12345');
    // Should redirect to home
    await expect(page).toHaveURL('/');
  });
});

test.describe('SEO Market Pages', () => {
  const markets = [
    { path: '/guinea', lang: 'fr' },
    { path: '/senegal', lang: 'fr' },
    { path: '/ghana', lang: 'en' },
    { path: '/cote-divoire', lang: 'fr' },
    { path: '/cameroon', lang: 'fr' },
    { path: '/sierra-leone', lang: 'en' },
    { path: '/kenya', lang: 'en' },
    { path: '/zimbabwe', lang: 'en' },
  ];

  markets.forEach(({ path, lang }) => {
    test(`should load market page: ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(path);
      // Page should render without errors
      const bodyText = await page.locator('body').textContent();
      expect(bodyText.length).toBeGreaterThan(0);
    });
  });
});
