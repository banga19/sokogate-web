/**
 * E2E Tests — Checkout & Payment Flow
 *
 * Tests navigation, UI components, and mock-based payment page rendering.
 * All API calls are intercepted to avoid backend dependency.
 *
 * Requires the dev server to be running on http://localhost:4500.
 * Run: npm run test:e2e:all
 */

const { test, expect } = require('@playwright/test');

// ── Mock data ──────────────────────────────────────────────────────────────

const EMPTY_OK = { errcode: 0, data: {} };

const MOCK_USER_FIRST_PAY = { errcode: 0, data: { orderCount: 0 } };

const MOCK_ORDER_LIST = {
  errcode: 0,
  data: {
    rows: [
      {
        id: 1001,
        total: 7500,
        status: 'pending',
        orderList: [
          {
            productId: 2001,
            productName: 'Smartphone X Pro',
            productImg: 'https://picsum.photos/seed/phone/400/400',
            pcs: 2,
            total: 5000,
            currencyTo: 'USD',
          },
          {
            productId: 2002,
            productName: 'Wireless Earbuds',
            productImg: 'https://picsum.photos/seed/earbuds/400/400',
            pcs: 1,
            total: 2500,
            currencyTo: 'USD',
          },
        ],
      },
    ],
  },
};

const MOCK_ORDER_DETAIL_PENDING = {
  errcode: 0,
  data: {
    OrderDetail: { id: 1001, status: 201, total: 7500, orderList: [{ currencyFrom: 'USD', logisticsType: 201 }] },
  },
};

const MOCK_ORDER_DETAIL_SUCCESS = {
  errcode: 0,
  data: {
    OrderDetail: { id: 1001, status: 301, total: 7500, orderList: [{ currencyFrom: 'USD', logisticsType: 201 }] },
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Intercept ALL API calls to return empty success responses (no backend needed).
 * Specific mocks can be set up per-test for endpoints that need real-looking data.
 */
async function mockAllApis(page) {
  await page.route('**/api/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(EMPTY_OK) });
  });
}

/**
 * Specific mocks for the payment V2 page (GetOrderListbyIds + GetOrderUserIsOnePay).
 */
async function mockPaymentApis(page) {
  await page.route('**/api/**', async (route) => {
    const url = route.request().url();
    if (url.includes('getOrderListbyIds')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_ORDER_LIST) });
    } else if (url.includes('getOrderUserIsOnePay')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_USER_FIRST_PAY) });
    } else if (url.includes('getOrderDetail')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_ORDER_DETAIL_PENDING) });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(EMPTY_OK) });
    }
  });
}

/**
 * Wait for the Vue app shell to render (page navigated, app mounted).
 */
async function waitForApp(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForFunction(() => document.querySelector('#app')?.children?.length > 0, { timeout: 15000 }).catch(() => {});
  // Give HMR/lazy-chunks a moment to settle
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
}

// ── Tests ──────────────────────────────────────────────────────────────────

test.describe('Checkout & Payment Flow', () => {
  // ── Navigation ─────────────────────────────────────────────────────────
  test.describe('Page Navigation', () => {
    test('should load the homepage (API-mocked)', async ({ page }) => {
      test.setTimeout(60000);
      await mockAllApis(page);
      await page.goto('/');
      await waitForApp(page);
      // Actual page title is set by vue-meta in the app shell
      await expect(page).toHaveTitle(/sokogate-web/i);
      const bodyText = await page.locator('body').textContent();
      expect(bodyText.length).toBeGreaterThan(0);
    });

    test('should navigate to login page', async ({ page }) => {
      test.setTimeout(60000);
      await mockAllApis(page);
      await page.goto('/v2/login');
      await expect(page).toHaveURL(/.*login/);
      await waitForApp(page);
    });

    test('should navigate to product list', async ({ page }) => {
      test.setTimeout(60000);
      await mockAllApis(page);
      await page.goto('/v2/product/list');
      await expect(page).toHaveURL(/.*product\/list/);
      await waitForApp(page);
    });

    test('should navigate to shopping cart', async ({ page }) => {
      test.setTimeout(60000);
      await mockAllApis(page);
      await page.goto('/v2/shopping-cart');
      await expect(page).toHaveURL(/.*shopping-cart/);
      await waitForApp(page);
    });

    test('should navigate to checkout counter_plus', async ({ page }) => {
      test.setTimeout(60000);
      await mockAllApis(page);
      await page.goto('/v2/checkout/counter_plus');
      await expect(page).toHaveURL(/.*checkout\/counter_plus/);
      await waitForApp(page);
    });

    test('should navigate to payment page', async ({ page }) => {
      test.setTimeout(60000);
      await mockAllApis(page);
      await page.goto('/v2/checkout/payment');
      await expect(page).toHaveURL(/.*checkout\/payment/);
      await waitForApp(page);
    });

    test('should navigate to payment success page', async ({ page }) => {
      test.setTimeout(60000);
      await mockAllApis(page);
      await page.goto('/v2/checkout/paymentSuccess');
      await expect(page).toHaveURL(/.*paymentSuccess/);
      await waitForApp(page);
    });

    test('should show 404 fallback for unknown routes', async ({ page }) => {
      await mockAllApis(page);
      await page.goto('/nonexistent-page-12345');
      await expect(page).toHaveURL('/');
    });
  });

  // ── Mock-based Payment Page ───────────────────────────────────────────
  test.describe('Payment Page — with API mocks', () => {
    test('should display order summary with mock order data', async ({ page }) => {
      await mockPaymentApis(page);

      await page.goto('/v2/checkout/payment?ids=1001');
      await waitForApp(page);
      // Payment page uses lazy-loaded Vue components that need HMR compilation.
      // Wait for the known components to appear (up to 45s for first compile).
      await page.waitForSelector('.OrderInfo', { timeout: 45000 }).catch(() => {});
      await page.waitForSelector('.PayMethod', { timeout: 15000 }).catch(() => {});

      const bodyText = await page.locator('body').textContent();
      expect(bodyText.length).toBeGreaterThan(100);

      // OrderInfo should be rendered with order data
      const orderSummary = page.locator('.OrderInfo');
      await expect(orderSummary).toBeAttached({ timeout: 5000 });
      await expect(orderSummary).toContainText(/Order Summary|Smartphone|Total/i);
    });

    test('should display payment method options', async ({ page }) => {
      await mockPaymentApis(page);

      await page.goto('/v2/checkout/payment?ids=1001');
      await waitForApp(page);
      await page.waitForSelector('.PayMethod', { timeout: 45000 }).catch(() => {});

      const payMethod = page.locator('.PayMethod');
      await expect(payMethod).toBeAttached({ timeout: 8000 });
      await expect(payMethod).toContainText(/PAY NOW/i);

      // Payment option names should appear in the page
      const bodyText = await page.locator('body').textContent();
      const paymentOptions = ['cinetpay', 'flutterwave', 'orange', 'paystack'];
      for (const option of paymentOptions) {
        expect(bodyText.toLowerCase()).toContain(option);
      }
    });

    test('should render payment method images', async ({ page }) => {
      await mockPaymentApis(page);

      await page.goto('/v2/checkout/payment?ids=1001');
      await waitForApp(page);
      await page.waitForSelector('.PayMethod', { timeout: 45000 }).catch(() => {});

      const paymentImgs = page.locator('.paymentImg');
      const count = await paymentImgs.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });

    test('should render PAY NOW button', async ({ page }) => {
      await mockPaymentApis(page);

      await page.goto('/v2/checkout/payment?ids=1001');
      await waitForApp(page);
      await page.waitForSelector('.payButton', { timeout: 45000 }).catch(() => {});

      const payButton = page.locator('.payButton');
      await expect(payButton).toBeVisible({ timeout: 8000 });
      await expect(payButton).toContainText(/PAY NOW/i);
    });

    test('should render Sokogate logo on payment page', async ({ page }) => {
      await mockPaymentApis(page);

      await page.goto('/v2/checkout/payment?ids=1001');
      await waitForApp(page);
      await page.waitForSelector('.logo', { timeout: 45000 }).catch(() => {});

      const logo = page.locator('.logo .colorful');
      await expect(logo).toBeAttached({ timeout: 8000 });
    });
  });

  // ── Mock-based Payment Success Page ───────────────────────────────────
  test.describe('Payment Success Page — with API mocks', () => {
    test('should show pending state initially', async ({ page }) => {
      test.setTimeout(60000);
      await page.route('**/api/**', async (route) => {
        const url = route.request().url();
        if (url.includes('getOrderDetail')) {
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_ORDER_DETAIL_PENDING) });
        } else {
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(EMPTY_OK) });
        }
      });

      await page.goto('/v2/checkout/paymentSuccess?id=1001');
      await waitForApp(page);
      // Payment success page uses lazy-loaded chunks too
      await page.waitForSelector('.paySuccess', { timeout: 45000 }).catch(() => {});

      const paySuccess = page.locator('.paySuccess');
      await expect(paySuccess).toBeAttached({ timeout: 5000 });
      // Pending state: no success icon, shows waiting text
      await expect(paySuccess).toContainText(/Waiting|payment/i);

      // Should show "Continue Shopping" button
      const continueBtn = page.locator('.button');
      await expect(continueBtn).toBeVisible({ timeout: 5000 });
      await expect(continueBtn).toContainText(/Continue|Shopping|Return|Home/i);
    });

    test('should show success state when status is 301', async ({ page }) => {
      test.setTimeout(60000);
      await page.route('**/api/**', async (route) => {
        const url = route.request().url();
        if (url.includes('getOrderDetail')) {
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_ORDER_DETAIL_SUCCESS) });
        } else {
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(EMPTY_OK) });
        }
      });

      await page.goto('/v2/checkout/paymentSuccess?id=1001');
      await waitForApp(page);
      await page.waitForSelector('.paySuccess', { timeout: 45000 }).catch(() => {});

      // Success icon should have the .success class
      const successIcon = page.locator('.icon.success');
      await expect(successIcon).toBeAttached({ timeout: 8000 });

      const paySuccess = page.locator('.paySuccess');
      await expect(paySuccess).toContainText(/Payment Successful|Thank you/i);

      // Order details section should render
      const orderDetails = page.locator('.orderDetails');
      await expect(orderDetails).toBeAttached({ timeout: 5000 });
    });
  });

  // ── SEO Market Pages ─────────────────────────────────────────────────
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
        await mockAllApis(page);
        await page.goto(path);
        await expect(page).toHaveURL(path);
        await waitForApp(page);
        const bodyText = await page.locator('body').textContent();
        expect(bodyText.length).toBeGreaterThan(0);
      });
    });
  });
});
