/**
 * Visual Regression Tests — Store Field Displays
 *
 * Captures screenshots of key store visual elements and compares them
 * against baseline snapshots to detect unintended visual changes.
 *
 * Components tested:
 *   - StorebannerList: store name, logo, verified badge, navigation links
 *   - StoreAboutus: contact info (email, phone)
 *   - StoreCard: store name, logo, verified badge, star rating, "Go to store" button
 *
 * Usage:
 *   First run (generates baseline snapshots):
 *     npx playwright test tests/e2e/store-visual.spec.js --config=tests/e2e/playwright.config.js --update-snapshots
 *
 *   Subsequent runs (compares against baselines):
 *     npx playwright test tests/e2e/store-visual.spec.js --config=tests/e2e/playwright.config.js
 *
 *   To update baselines after intentional changes:
 *     npx playwright test tests/e2e/store-visual.spec.js --config=tests/e2e/playwright.config.js --update-snapshots
 */

const { test, expect } = require('@playwright/test');

// ──────────────────────────────────────────────────────────────
// Shared mock data
// ──────────────────────────────────────────────────────────────

const PIXEL_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

/** Verified store with all fields populated */
const VERIFIED_STORE = {
  id: 'store-1',
  name: 'Demo Global Trading',
  storeName: 'Demo Global Trading',
  logo_url: PIXEL_PNG,
  banner_url: PIXEL_PNG,
  contact_email: 'seller@sokogate.com',
  contact_phone: '+8618800000002',
  is_verified: true,
  rating: 4.5,
  profile: '<p>Your trusted source for quality products from around the world.</p>',
  description: 'A verified global trading company since 2020.',
};

/** Unverified store — no rating, no contact info, no verified badge */
const UNVERIFIED_STORE = {
  id: 'store-2',
  name: 'New Shop',
  storeName: 'New Shop',
  logo_url: PIXEL_PNG,
  banner_url: PIXEL_PNG,
  contact_email: '',
  contact_phone: '',
  is_verified: false,
  rating: 0,
  profile: '<p>Welcome to our new store! We are just getting started.</p>',
  description: 'A brand new store.',
};

/** Store with rating but no verification (edge case) */
const RATED_UNVERIFIED_STORE = {
  id: 'store-3',
  name: 'Popular Wares',
  storeName: 'Popular Wares',
  logo_url: PIXEL_PNG,
  banner_url: PIXEL_PNG,
  contact_email: 'contact@popularwares.com',
  contact_phone: '',
  is_verified: false,
  rating: 3.8,
  profile: '<p>Quality products at affordable prices.</p>',
  description: 'A popular but unverified store.',
};

const EMPTY_BANNERS = { errcode: 0, data: [] };

// ──────────────────────────────────────────────────────────────
// GotoTalking dialog header injection
// ──────────────────────────────────────────────────────────────

/**
 * Inject GotoTalking chat dialog header HTML into the page.
 * The GotoTalking component is not rendered on any active page (commented out
 * in product detail), so we inject the matching DOM structure directly.
 *
 * Since GotoTalking uses non-scoped `<style lang="scss">`, the global CSS
 * selectors apply, allowing us to visually regression-test the rendered
 * verified badge (18px blue gradient circle) in the chat header.
 *
 * The inner `.el-dialog` must override `position: fixed` from the component's
 * CSS with an explicit `position: relative !important` to stay inside the
 * centered wrapper without interfering with the page layout or test teardown.
 */
const GOTO_TALKING_ID = 'goto-talking-visual-test';

/**
 * Inject GotoTalking dialog header with an explicit pixel width.
 * Used by desktop tests where we want a fixed-width dialog.
 * The component's CSS width (20%) is overridden by the inline width.
 */
async function injectGotoTalkingHeader(page, storeData, width = 380) {
  await page.evaluate(({ data, id, w }) => {
    const prev = document.getElementById(id);
    if (prev) prev.remove();

    const wrapper = document.createElement('div');
    wrapper.id = id;
    wrapper.className = 'talking-room';
    wrapper.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:99999;';
    wrapper.innerHTML = `
      <div class="el-dialog" style="position:relative !important;width:${w}px;margin:0 auto;background:#fff;border-radius:4px;box-shadow:0 2px 12px rgba(0,0,0,0.1);">
        <div class="el-dialog__header">
          <div class="room-hd">
            <div class="hd-back"><i class="el-icon-arrow-left"></i></div>
            <img class="hd-logo" src="${data.logo_url}" alt="" />
            <div class="hd-name">
              ${data.storeName}
              ${data.is_verified
                ? '<span class="verified-badge" title="Verified"><i class="el-icon-success"></i></span>'
                : ''}
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrapper);
  }, { data: storeData, id: GOTO_TALKING_ID, w: width });
}

/**
 * Inject GotoTalking dialog header WITHOUT an inline pixel width.
 * The component's CSS breakpoints take effect:
 *   - mobile (320-767px): width: 75%
 *   - default: width: 20% (but position:fixed is overridden)
 * Use this for responsive/mobile viewport tests.
 */
async function injectGotoTalkingHeaderResponsive(page, storeData) {
  await page.evaluate(({ data, id }) => {
    const prev = document.getElementById(id);
    if (prev) prev.remove();

    const wrapper = document.createElement('div');
    wrapper.id = id;
    wrapper.className = 'talking-room';
    wrapper.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:99999;';
    wrapper.innerHTML = `
      <div class="el-dialog" style="position:relative !important;margin:0 auto;background:#fff;border-radius:4px;box-shadow:0 2px 12px rgba(0,0,0,0.1);">
        <div class="el-dialog__header">
          <div class="room-hd">
            <div class="hd-back"><i class="el-icon-arrow-left"></i></div>
            <img class="hd-logo" src="${data.logo_url}" alt="" />
            <div class="hd-name">
              ${data.storeName}
              ${data.is_verified
                ? '<span class="verified-badge" title="Verified"><i class="el-icon-success"></i></span>'
                : ''}
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrapper);
  }, { data: storeData, id: GOTO_TALKING_ID });
}

/** Remove the injected GotoTalking header to keep the page clean */
async function cleanupGotoTalking(page) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  }, GOTO_TALKING_ID);
}

// ──────────────────────────────────────────────────────────────
// Vue data injection helpers
// ──────────────────────────────────────────────────────────────

/**
 * Walk the Vue component tree to find a component that has a given
 * data property, and set it with mock data.
 * @param {import('@playwright/test').Page} page
 * @param {string} propName - Vue data property name (e.g. 'storelist', 'list')
 * @param {any} data - Mock data to inject
 */
async function injectVueData(page, propName, data) {
  await page.evaluate(
    ({ prop, data }) => {
      const app = document.querySelector('#app');
      if (!app || !app.__vue__) return false;

      function findComponent(vm, depth) {
        if (depth > 15) return null;
        if (vm[prop] !== undefined) return vm;
        for (const child of vm.$children || []) {
          const found = findComponent(child, depth + 1);
          if (found) return found;
        }
        return null;
      }

      const target = findComponent(app.__vue__, 0);
      if (target) {
        target.$set(target, prop, data);
        target.$forceUpdate();
        return true;
      }
      return false;
    },
    { prop: propName, data }
  );
}

// ──────────────────────────────────────────────────────────────
// Tests — Store About Page (StorebannerList + StoreAboutus)
// ──────────────────────────────────────────────────────────────

test.describe('Store About Page — Visual Regression', () => {
  // Serial mode: tests navigate to the same URL and inject Vue data,
  // so they must not run in parallel to avoid state interference.
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test('full banner header with verified store', async ({ page }) => {
    await page.goto('/v2/store/about?id=store-1');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    await injectVueData(page, 'storelist', VERIFIED_STORE);
    await page.waitForTimeout(500);

    const banner = page.locator('.banner-list-box');
    await expect(banner).toBeAttached({ timeout: 5000 });

    await expect(banner).toHaveScreenshot('store-about-verified-banner.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('full banner header with unverified store', async ({ page }) => {
    await page.goto('/v2/store/about?id=store-2');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    await injectVueData(page, 'storelist', UNVERIFIED_STORE);
    await page.waitForTimeout(500);

    const banner = page.locator('.banner-list-box');
    await expect(banner).toBeAttached({ timeout: 5000 });

    await expect(banner).toHaveScreenshot('store-about-unverified-banner.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('contact info section (verified store with email and phone)', async ({ page }) => {
    await page.goto('/v2/store/about?id=store-1');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    await injectVueData(page, 'storelist', VERIFIED_STORE);
    await page.waitForTimeout(500);

    // Wait for the store name to confirm data was injected, then check contact info
    await expect(page.locator('.store-name')).toHaveText(/Demo/, { timeout: 5000 });

    const contactInfo = page.locator('.contact-info');
    await expect(contactInfo).toBeVisible({ timeout: 5000 });

    await expect(contactInfo).toHaveScreenshot('store-about-contact-info.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('no contact info section when fields are empty', async ({ page }) => {
    await page.goto('/v2/store/about?id=store-2');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    await injectVueData(page, 'storelist', UNVERIFIED_STORE);
    await page.waitForTimeout(500);

    // Confirm store data was injected first
    await expect(page.locator('.store-name')).toHaveText(/New Shop/, { timeout: 5000 });

    // The contact-info div should NOT exist when both email and phone are empty
    const contactInfo = page.locator('.contact-info');
    await expect(contactInfo).toHaveCount(0);
  });

  test('store name appears correctly', async ({ page }) => {
    await page.goto('/v2/store/about?id=store-1');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    await injectVueData(page, 'storelist', VERIFIED_STORE);
    await page.waitForTimeout(500);

    const storeName = page.locator('.store-name');
    await expect(storeName).toHaveText(/Demo/, { timeout: 5000 });

    await expect(storeName).toHaveScreenshot('store-about-verified-store-name.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});

// ──────────────────────────────────────────────────────────────
// Tests — Store List Page (StoreCard)
// ──────────────────────────────────────────────────────────────

test.describe('StoreCard — Visual Regression', () => {
  // Serial mode prevents parallel interference on the same page/API state
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test('StoreCard with verified badge and rating', async ({ page }) => {
    await page.goto('/v2/store/storeList?search=demo');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    await injectVueData(page, 'list', [VERIFIED_STORE]);
    await page.waitForTimeout(500);

    const storeCard = page.locator('.store-card');
    await expect(storeCard).toBeAttached({ timeout: 5000 });

    await expect(storeCard).toHaveScreenshot('store-card-verified-rated.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('StoreCard without verified badge (unverified, no rating)', async ({ page }) => {
    await page.goto('/v2/store/storeList?search=new');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    await injectVueData(page, 'list', [UNVERIFIED_STORE]);
    await page.waitForTimeout(500);

    const storeCard = page.locator('.store-card');
    await expect(storeCard).toBeAttached({ timeout: 5000 });

    await expect(storeCard).toHaveScreenshot('store-card-unverified-norating.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('StoreCard with rating but no verified badge', async ({ page }) => {
    await page.goto('/v2/store/storeList?search=popular');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    await injectVueData(page, 'list', [RATED_UNVERIFIED_STORE]);
    await page.waitForTimeout(500);

    const storeCard = page.locator('.store-card');
    await expect(storeCard).toBeAttached({ timeout: 5000 });

    await expect(storeCard).toHaveScreenshot('store-card-unverified-rated.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('StoreCard verified badge detail', async ({ page }) => {
    await page.goto('/v2/store/storeList?search=demo');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    await injectVueData(page, 'list', [VERIFIED_STORE]);
    await page.waitForTimeout(500);

    const badge = page.locator('.store-card .verified-badge');
    await expect(badge).toBeAttached({ timeout: 5000 });

    await expect(badge).toHaveScreenshot('store-card-verified-badge-closeup.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('StoreCard no badge when unverified', async ({ page }) => {
    await page.goto('/v2/store/storeList?search=new');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    await injectVueData(page, 'list', [UNVERIFIED_STORE]);
    await page.waitForTimeout(500);

    const badge = page.locator('.store-card .verified-badge');
    await expect(badge).toHaveCount(0);
  });
});

// ──────────────────────────────────────────────────────────────
// Tests — GotoTalking Chat Dialog Header
// ──────────────────────────────────────────────────────────────

test.describe('GotoTalking Dialog Header — Visual Regression', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test('dialog header with verified badge', async ({ page }) => {
    await page.goto('/v2/store/about?id=store-1');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    // Inject the GotoTalking dialog header HTML matching the component's structure
    await injectGotoTalkingHeader(page, VERIFIED_STORE);
    await page.waitForTimeout(500);

    // The header should contain the store name
    const hdName = page.locator('.room-hd .hd-name');
    await expect(hdName).toContainText(/Demo Global/, { timeout: 5000 });

    // The verified badge should be visible
    const badge = page.locator('.room-hd .hd-name .verified-badge');
    await expect(badge).toBeVisible({ timeout: 5000 });

    // Screenshot the entire dialog header
    const roomHd = page.locator('.room-hd');
    await expect(roomHd).toHaveScreenshot('goto-talking-header-verified.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('dialog header verified badge close-up', async ({ page }) => {
    await page.goto('/v2/store/about?id=store-1');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    await injectGotoTalkingHeader(page, VERIFIED_STORE);
    await page.waitForTimeout(500);

    // Close-up screenshot of just the verified badge
    const badge = page.locator('.room-hd .hd-name .verified-badge');
    await expect(badge).toBeVisible({ timeout: 5000 });
    await expect(badge).toHaveScreenshot('goto-talking-badge-closeup.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('dialog header without verified badge', async ({ page }) => {
    await page.goto('/v2/store/about?id=store-2');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    await injectGotoTalkingHeader(page, UNVERIFIED_STORE);
    await page.waitForTimeout(500);

    // Header should show the store name without a badge
    const hdName = page.locator('.room-hd .hd-name');
    await expect(hdName).toContainText(/New Shop/, { timeout: 5000 });

    // No badge should exist
    const badge = page.locator('.room-hd .hd-name .verified-badge');
    await expect(badge).toHaveCount(0);

    // Screenshot the header without badge
    const roomHd = page.locator('.room-hd');
    await expect(roomHd).toHaveScreenshot('goto-talking-header-unverified.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});

// ──────────────────────────────────────────────────────────────
// Tests — GotoTalking Chat Dialog Header (Mobile 375px)
// ──────────────────────────────────────────────────────────────

test.describe('GotoTalking Dialog Header — Mobile (375px)', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    // iPhone SE / small Android viewport
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('mobile dialog header with verified badge', async ({ page }) => {
    await page.goto('/v2/store/about?id=store-1');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    // Use responsive injection — no hardcoded width, so @include mobile { width: 75% } applies
    await injectGotoTalkingHeaderResponsive(page, VERIFIED_STORE);
    await page.waitForTimeout(500);

    const hdName = page.locator('.room-hd .hd-name');
    await expect(hdName).toContainText(/Demo Global/, { timeout: 5000 });

    const badge = page.locator('.room-hd .hd-name .verified-badge');
    await expect(badge).toBeVisible({ timeout: 5000 });

    const roomHd = page.locator('.room-hd');
    await expect(roomHd).toHaveScreenshot('goto-talking-mobile-verified.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('mobile dialog header verified badge close-up', async ({ page }) => {
    await page.goto('/v2/store/about?id=store-1');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    await injectGotoTalkingHeaderResponsive(page, VERIFIED_STORE);
    await page.waitForTimeout(500);

    const badge = page.locator('.room-hd .hd-name .verified-badge');
    await expect(badge).toBeVisible({ timeout: 5000 });
    await expect(badge).toHaveScreenshot('goto-talking-mobile-badge-closeup.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('mobile dialog header without verified badge', async ({ page }) => {
    await page.goto('/v2/store/about?id=store-2');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    await injectGotoTalkingHeaderResponsive(page, UNVERIFIED_STORE);
    await page.waitForTimeout(500);

    const hdName = page.locator('.room-hd .hd-name');
    await expect(hdName).toContainText(/New Shop/, { timeout: 5000 });

    const badge = page.locator('.room-hd .hd-name .verified-badge');
    await expect(badge).toHaveCount(0);

    const roomHd = page.locator('.room-hd');
    await expect(roomHd).toHaveScreenshot('goto-talking-mobile-unverified.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});
