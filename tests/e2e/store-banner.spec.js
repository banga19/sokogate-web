/**
 * E2E Tests — Store Page Verified Badge
 *
 * Tests that the verified badge (blue gradient circle with white checkmark)
 * renders correctly when Store.is_verified is true, and is absent when false.
 *
 * Approach: Navigates to the store about page, then injects mock store data
 * directly into the Vue component using page.evaluate. This bypasses the
 * complexity of mocking XHR/fetch at the network level for this Vue 2 app
 * which uses axios v1.x with complex event handling.
 *
 * Usage:
 *   npx playwright test tests/e2e/store-banner.spec.js --config=tests/e2e/playwright.config.js
 */

const { test, expect } = require('@playwright/test');

/** 1×1 transparent PNG data URI for mock image fields */
const PIXEL_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const makeVerifiedStore = () => ({
  id: 'store-1',
  name: 'Demo Global Trading',
  storeName: 'Demo Global Trading',
  logo_url: PIXEL_PNG,
  banner_url: PIXEL_PNG,
  contact_email: 'seller@sokogate.com',
  contact_phone: '+8618800000002',
  is_verified: true,
  rating: 4.5,
  profile: '<p>Your trusted source for quality products.</p>',
  description: 'A verified global trading company.',
});

const makeUnverifiedStore = () => ({
  id: 'store-2',
  name: 'Unverified Store',
  storeName: 'Unverified Store',
  logo_url: PIXEL_PNG,
  banner_url: PIXEL_PNG,
  contact_email: '',
  contact_phone: '',
  is_verified: false,
  rating: 0,
  profile: '<p>A new store.</p>',
  description: 'A brand new unverified store.',
});

/**
 * Walk the Vue component tree to find a component that has a `storelist`
 * data property (the about page component), and set it with mock data.
 * Uses Vue.set-style assignment and $forceUpdate to trigger re-render.
 */
async function injectStoreData(page, storeData) {
  await page.evaluate((data) => {
    const app = document.querySelector('#app');
    if (!app || !app.__vue__) return false;

    function findStoreComponent(vm, depth) {
      if (depth > 15) return null;
      if (vm.storelist !== undefined && typeof vm.storelist === 'object') {
        return vm;
      }
      for (const child of vm.$children || []) {
        const found = findStoreComponent(child, depth + 1);
        if (found) return found;
      }
      return null;
    }

    const target = findStoreComponent(app.__vue__, 0);
    if (target) {
      // Use Vue.set to maintain reactivity (storelist is a top-level data key)
      target.$set(target, 'storelist', data);
      target.$forceUpdate();
      return true;
    }
    return false;
  }, storeData);
}

test.describe('Store Page — Verified Badge', () => {
  test.describe.configure({ mode: 'serial' });
  test('should render verified badge in DOM when Store.is_verified is true', async ({ page }) => {
    await page.goto('/v2/store/about?id=store-1');
    // Wait for Vue app to mount and page resources to load
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    await injectStoreData(page, makeVerifiedStore());
    await page.waitForTimeout(500);

    // The store name should render with mock data
    await expect(page.locator('.store-name')).toHaveText(/Demo/, { timeout: 5000 });

    // The verified badge should exist in the DOM
    await expect(page.locator('.verified-badge')).toHaveCount(1);

    // The icon inside the badge should have the el-icon-success class
    await expect(page.locator('.verified-badge i')).toHaveClass(/el-icon-success/);
  });

  test('should NOT render verified badge when Store.is_verified is false', async ({ page }) => {
    await page.goto('/v2/store/about?id=store-2');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    await injectStoreData(page, makeUnverifiedStore());
    await page.waitForTimeout(500);

    // The store name should render with mock data
    await expect(page.locator('.store-name')).toHaveText(/Unverified/, { timeout: 5000 });

    // The verified badge should NOT exist in the DOM
    await expect(page.locator('.verified-badge')).toHaveCount(0);
  });
});
