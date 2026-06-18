/**
 * Visual Regression Tests — HQ Dashboard
 *
 * Captures screenshots of the HQ Command Center dashboard and compares
 * them against baseline snapshots to detect unintended visual changes.
 *
 * Tests cover: full-page layout, KPI cards, bar chart, category bars,
 * urgency breakdown, agent table, platform breakdown, empty state,
 * error state, filter bar, auto-refresh bar, and settings popover.
 *
 * Uses Vue data injection (same pattern as store-visual.spec.js) to
 * bypass auth requirements and test data dependencies.
 *
 * Usage:
 *   First run (generates baseline snapshots):
 *     npx playwright test tests/e2e/hq-dashboard-visual.spec.js --config=tests/e2e/playwright.config.js --update-snapshots
 *
 *   Subsequent runs (compares against baselines):
 *     npx playwright test tests/e2e/hq-dashboard-visual.spec.js --config=tests/e2e/playwright.config.js
 */

const { test, expect } = require('@playwright/test');

// ── Mock Dashboard Data ────────────────────────────────────────────────────

const MOCK_DASHBOARD = {
  errcode: 0,
  data: {
    overview: {
      totalLeads: 47,
      totalAlerts: 23,
      postedComments: 31,
      pendingComments: 16,
      suppliersListed: 8,
      emailsSent: 20,
      conversionRate: 44,
      totalActions: 70,
    },
    breakdowns: {
      platformLeads: [
        { platform: 'facebook', count: 25 },
        { platform: 'linkedin', count: 12 },
        { platform: 'whatsapp', count: 10 },
      ],
      platformAlerts: [
        { platform: 'facebook', count: 10 },
        { platform: 'whatsapp', count: 8 },
        { platform: 'linkedin', count: 5 },
      ],
      categoryAlerts: [
        { category: 'food', count: 8 },
        { category: 'automotive', count: 5 },
        { category: 'electronics', count: 4 },
        { category: 'construction', count: 3 },
        { category: 'textiles', count: 2 },
        { category: 'agri-input', count: 1 },
      ],
      urgencyBreakdown: [
        { urgency: 'high', count: 12 },
        { urgency: 'medium', count: 8 },
        { urgency: 'low', count: 3 },
      ],
    },
    topProducts: [
      { product: 'bulk rice', count: 5 },
      { product: 'organic shea butter', count: 3 },
      { product: 'motorcycles CKD', count: 3 },
      { product: 'solar panels', count: 2 },
      { product: 'cement', count: 2 },
      { product: 'textile fabrics', count: 2 },
      { product: 'fertilizer', count: 1 },
      { product: 'pharmaceuticals', count: 1 },
    ],
    topMarkets: [
      { market: 'Guinea', count: 6 },
      { market: 'Senegal', count: 5 },
      { market: 'Ghana', count: 4 },
      { market: 'Kenya', count: 3 },
      { market: 'Nigeria', count: 2 },
      { market: "Côte d'Ivoire", count: 2 },
    ],
    agentActivity: [
      { agent_id: 'agent-1', agent_name: 'Amadou Balde', total: 15, posted: 12 },
      { agent_id: 'agent-2', agent_name: 'Mariam Diallo', total: 12, posted: 9 },
      { agent_id: 'agent-3', agent_name: 'Ibrahim Sow', total: 10, posted: 5 },
      { agent_id: 'agent-4', agent_name: 'Fatoumata Sy', total: 8, posted: 3 },
      { agent_id: 'agent-5', agent_name: 'Alpha Barry', total: 5, posted: 2 },
    ],
    dailyTrend: {
      leads: [
        { date: '2026-06-03', count: 2 },
        { date: '2026-06-04', count: 4 },
        { date: '2026-06-05', count: 1 },
        { date: '2026-06-06', count: 3 },
        { date: '2026-06-07', count: 5 },
        { date: '2026-06-08', count: 2 },
        { date: '2026-06-09', count: 4 },
        { date: '2026-06-10', count: 6 },
        { date: '2026-06-11', count: 3 },
        { date: '2026-06-12', count: 5 },
        { date: '2026-06-13', count: 4 },
        { date: '2026-06-14', count: 7 },
        { date: '2026-06-15', count: 3 },
        { date: '2026-06-16', count: 5 },
      ],
      alerts: [
        { date: '2026-06-03', count: 1 },
        { date: '2026-06-04', count: 2 },
        { date: '2026-06-06', count: 1 },
        { date: '2026-06-07', count: 3 },
        { date: '2026-06-08', count: 1 },
        { date: '2026-06-10', count: 2 },
        { date: '2026-06-11', count: 2 },
        { date: '2026-06-12', count: 3 },
        { date: '2026-06-13', count: 1 },
        { date: '2026-06-14', count: 2 },
        { date: '2026-06-15', count: 1 },
        { date: '2026-06-16', count: 2 },
      ],
    },
  },
};

const MOCK_DASHBOARD_EMPTY = {
  errcode: 0,
  data: {
    overview: {
      totalLeads: 0, totalAlerts: 0, postedComments: 0, pendingComments: 0,
      suppliersListed: 0, emailsSent: 0, conversionRate: 0, totalActions: 0,
    },
    breakdowns: {
      platformLeads: [], platformAlerts: [], categoryAlerts: [], urgencyBreakdown: [],
    },
    topProducts: [], topMarkets: [], agentActivity: [],
    dailyTrend: { leads: [], alerts: [] },
  },
};

// ── Vue Data Injection Helpers ────────────────────────────────────────────

/**
 * Walk the Vue component tree to find a component that has a given
 * data property, and set it with mock data.
 */
async function injectVueData(page, propName, data) {
  return page.evaluate(
    ({ prop, mockData }) => {
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
        target.$set(target, prop, mockData);
        // Also clear loading/error state
        target.$set(target, 'loading', false);
        target.$set(target, 'error', null);
        target.$forceUpdate();
        return true;
      }
      return false;
    },
    { prop: propName, mockData: data }
  );
}

/**
 * Set an auth token in localStorage (via navigate + evaluate) so the
 * axios interceptor passes. Must navigate to the origin first.
 */
async function setAuthToken(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
  await page.evaluate(() => localStorage.setItem('auth_token', 'mock-token-for-e2e'));
}

/**
 * Wait for the page shell to be ready.
 */
async function waitForShell(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
}

// ── Desktop — Full Dashboard ───────────────────────────────────────────────

test.describe('HQ Dashboard — Desktop Visual (1280px)', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test('full dashboard with data loaded', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    // Inject dashboard data into the Vue component
    const injected = await injectVueData(page, 'data', MOCK_DASHBOARD.data);
    expect(injected).toBe(true);
    await page.waitForTimeout(1000);

    // Verify KPI cards rendered
    await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 5000 });

    // Full-page screenshot
    const dashboard = page.locator('.hq-dashboard-page');
    await expect(dashboard).toHaveScreenshot('hq-dashboard-full.png', {
      maxDiffPixelRatio: 0.02,
      fullPage: true,
    });
  });

  test('kpi cards row', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    const injected = await injectVueData(page, 'data', MOCK_DASHBOARD.data);
    expect(injected).toBe(true);
    await page.waitForTimeout(1000);

    await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 5000 });

    const kpiRow = page.locator('.kpi-row');
    await expect(kpiRow).toHaveScreenshot('hq-dashboard-kpi-row.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('daily activity bar chart', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    const injected = await injectVueData(page, 'data', MOCK_DASHBOARD.data);
    expect(injected).toBe(true);
    await page.waitForTimeout(1000);
    await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 5000 });

    const chartCard = page.locator('.chart-card').filter({ hasText: /Daily Activity/i });
    await expect(chartCard).toHaveScreenshot('hq-dashboard-bar-chart.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('top products ranked list', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    const injected = await injectVueData(page, 'data', MOCK_DASHBOARD.data);
    expect(injected).toBe(true);
    await page.waitForTimeout(1000);
    await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 5000 });

    const chartCard = page.locator('.chart-card').filter({ hasText: /Top Products Demanded/i });
    await expect(chartCard).toHaveScreenshot('hq-dashboard-top-products.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('top markets ranked list', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    const injected = await injectVueData(page, 'data', MOCK_DASHBOARD.data);
    expect(injected).toBe(true);
    await page.waitForTimeout(1000);
    await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 5000 });

    const chartCard = page.locator('.chart-card').filter({ hasText: /Top Markets/i });
    await expect(chartCard).toHaveScreenshot('hq-dashboard-top-markets.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('categories breakdown with bars', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    const injected = await injectVueData(page, 'data', MOCK_DASHBOARD.data);
    expect(injected).toBe(true);
    await page.waitForTimeout(1000);
    await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 5000 });

    const chartCard = page.locator('.chart-card').filter({ hasText: /Categories/i });
    await expect(chartCard).toHaveScreenshot('hq-dashboard-categories.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('alert urgency breakdown', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    const injected = await injectVueData(page, 'data', MOCK_DASHBOARD.data);
    expect(injected).toBe(true);
    await page.waitForTimeout(1000);
    await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 5000 });

    const chartCard = page.locator('.chart-card').filter({ hasText: /Alert Urgency/i });
    await expect(chartCard).toHaveScreenshot('hq-dashboard-urgency.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('agent leaderboard table', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    const injected = await injectVueData(page, 'data', MOCK_DASHBOARD.data);
    expect(injected).toBe(true);
    await page.waitForTimeout(1000);
    await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 5000 });

    const chartCard = page.locator('.chart-card').filter({ hasText: /Top Agents/i });
    await expect(chartCard).toHaveScreenshot('hq-dashboard-agent-table.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('platform breakdown bars', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    const injected = await injectVueData(page, 'data', MOCK_DASHBOARD.data);
    expect(injected).toBe(true);
    await page.waitForTimeout(1000);
    await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 5000 });

    const chartCard = page.locator('.chart-card').filter({ hasText: /Platform Breakdown/i });
    await expect(chartCard).toHaveScreenshot('hq-dashboard-platform-breakdown.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('date filter bar with presets', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    const injected = await injectVueData(page, 'data', MOCK_DASHBOARD.data);
    expect(injected).toBe(true);
    await page.waitForTimeout(1000);
    await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 5000 });

    const filterBar = page.locator('.date-filter-bar');
    await expect(filterBar).toHaveScreenshot('hq-dashboard-date-filter.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('auto-refresh bar with toggle and settings', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    const injected = await injectVueData(page, 'data', MOCK_DASHBOARD.data);
    expect(injected).toBe(true);
    await page.waitForTimeout(1000);
    await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 5000 });

    const refreshBar = page.locator('.auto-refresh-bar');
    await expect(refreshBar).toHaveScreenshot('hq-dashboard-auto-refresh.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});

// ── Empty State Visual ─────────────────────────────────────────────────────

test.describe('HQ Dashboard — Empty State Visual', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test('dashboard with no data (all zeros / empty charts)', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    const injected = await injectVueData(page, 'data', MOCK_DASHBOARD_EMPTY.data);
    expect(injected).toBe(true);
    await page.waitForTimeout(1000);

    await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 5000 });

    const dashboard = page.locator('.hq-dashboard-page');
    await expect(dashboard).toHaveScreenshot('hq-dashboard-empty.png', {
      maxDiffPixelRatio: 0.02,
      fullPage: true,
    });
  });

  test('individual empty chart placeholders', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    const injected = await injectVueData(page, 'data', MOCK_DASHBOARD_EMPTY.data);
    expect(injected).toBe(true);
    await page.waitForTimeout(1000);
    await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 5000 });

    const emptyCharts = page.locator('.empty-chart');
    const count = await emptyCharts.count();
    expect(count).toBe(6);

    const firstEmpty = emptyCharts.first();
    await expect(firstEmpty).toHaveScreenshot('hq-dashboard-empty-chart.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});

// ── Error State Visual ─────────────────────────────────────────────────────

test.describe('HQ Dashboard — Error State Visual', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test('error state with retry button', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    // Simulate error by setting the error property directly
    await page.evaluate(() => {
      const app = document.querySelector('#app');
      if (app && app.__vue__) {
        function findComponent(vm, depth) {
          if (depth > 15) return null;
          if (vm.$options && vm.$options.name === 'HqDashboard') return vm;
          for (const child of vm.$children || []) {
            const found = findComponent(child, depth + 1);
            if (found) return found;
          }
          return null;
        }
        const target = findComponent(app.__vue__, 0);
        if (target) {
          target.$set(target, 'error', 'Failed to load dashboard data');
          target.$set(target, 'loading', false);
          target.$set(target, 'data', null);
          target.$forceUpdate();
        }
      }
    });
    await page.waitForTimeout(500);

    const errorState = page.locator('.error-state');
    await expect(errorState).toBeAttached({ timeout: 5000 });

    await expect(errorState).toHaveScreenshot('hq-dashboard-error-state.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});

// ── Loading State Visual ───────────────────────────────────────────────────

test.describe('HQ Dashboard — Loading State Visual', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test('loading spinner while data is being fetched', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    // Simulate loading state
    await page.evaluate(() => {
      const app = document.querySelector('#app');
      if (app && app.__vue__) {
        function findComponent(vm, depth) {
          if (depth > 15) return null;
          if (vm.$options && vm.$options.name === 'HqDashboard') return vm;
          for (const child of vm.$children || []) {
            const found = findComponent(child, depth + 1);
            if (found) return found;
          }
          return null;
        }
        const target = findComponent(app.__vue__, 0);
        if (target) {
          target.$set(target, 'loading', true);
          target.$set(target, 'error', null);
          target.$set(target, 'data', null);
          target.$forceUpdate();
        }
      }
    });
    await page.waitForTimeout(500);

    const loadingState = page.locator('.loading-state');
    await expect(loadingState).toBeAttached({ timeout: 5000 });

    await expect(loadingState).toHaveScreenshot('hq-dashboard-loading.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});

// ── Mobile — Full Dashboard (375px) ────────────────────────────────────────

test.describe('HQ Dashboard — Mobile Visual (375px)', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test('mobile full dashboard', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    const injected = await injectVueData(page, 'data', MOCK_DASHBOARD.data);
    expect(injected).toBe(true);
    await page.waitForTimeout(1000);
    await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

    const dashboard = page.locator('.hq-dashboard-page');
    await expect(dashboard).toHaveScreenshot('hq-dashboard-mobile-full.png', {
      maxDiffPixelRatio: 0.02,
      fullPage: true,
    });
  });

  test('mobile kpi cards layout', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    const injected = await injectVueData(page, 'data', MOCK_DASHBOARD.data);
    expect(injected).toBe(true);
    await page.waitForTimeout(1000);
    await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

    const kpiRow = page.locator('.kpi-row');
    await expect(kpiRow).toHaveScreenshot('hq-dashboard-mobile-kpis.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('mobile daily activity chart', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    const injected = await injectVueData(page, 'data', MOCK_DASHBOARD.data);
    expect(injected).toBe(true);
    await page.waitForTimeout(1000);
    await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

    const chartCard = page.locator('.chart-card').filter({ hasText: /Daily Activity/i });
    await expect(chartCard).toHaveScreenshot('hq-dashboard-mobile-bar-chart.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('mobile top products list', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    const injected = await injectVueData(page, 'data', MOCK_DASHBOARD.data);
    expect(injected).toBe(true);
    await page.waitForTimeout(1000);
    await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

    const chartCard = page.locator('.chart-card').filter({ hasText: /Top Products Demanded/i });
    await expect(chartCard).toHaveScreenshot('hq-dashboard-mobile-top-products.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('mobile auto-refresh bar', async ({ page }) => {
    test.setTimeout(60000);
    await setAuthToken(page);
    await page.goto('/v2/hq-dashboard');
    await waitForShell(page);

    const injected = await injectVueData(page, 'data', MOCK_DASHBOARD.data);
    expect(injected).toBe(true);
    await page.waitForTimeout(1000);
    await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

    const refreshBar = page.locator('.auto-refresh-bar');
    await expect(refreshBar).toHaveScreenshot('hq-dashboard-mobile-auto-refresh.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});
