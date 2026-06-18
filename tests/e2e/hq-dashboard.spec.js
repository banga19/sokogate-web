/**
 * E2E Tests — HQ Dashboard Page
 *
 * Tests the HQ Command Center dashboard for tracking comment agent performance:
 * KPI cards, daily trends, top products, top markets, categories, urgency,
 * agent leaderboard, and platform breakdown.
 *
 * All API calls are intercepted to avoid backend dependency.
 *
 * Usage:
 *   npx playwright test tests/e2e/hq-dashboard.spec.js --config=tests/e2e/playwright.config.js
 *   npx playwright test tests/e2e/hq-dashboard.spec.js --config=tests/e2e/playwright.config.js --headed
 */

const { test, expect } = require('@playwright/test');

// ── Mock Dashboard Data ────────────────────────────────────────────────────

const EMPTY_OK = { errcode: 0, data: {} };

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
      { product: 'construction steel', count: 1 },
      { product: 'used clothing bales', count: 1 },
    ],
    topMarkets: [
      { market: 'Guinea', count: 6 },
      { market: 'Senegal', count: 5 },
      { market: 'Ghana', count: 4 },
      { market: 'Kenya', count: 3 },
      { market: 'Nigeria', count: 2 },
      { market: "Côte d'Ivoire", count: 2 },
      { market: 'Cameroon', count: 1 },
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

/**
 * Mock dashboard response for a date-filtered scenario (Last 30 Days).
 */
const MOCK_DASHBOARD_FILTERED = {
  errcode: 0,
  data: {
    overview: {
      totalLeads: 35,
      totalAlerts: 18,
      postedComments: 22,
      pendingComments: 13,
      suppliersListed: 6,
      emailsSent: 15,
      conversionRate: 41,
      totalActions: 53,
    },
    breakdowns: {
      platformLeads: [
        { platform: 'facebook', count: 18 },
        { platform: 'linkedin', count: 10 },
        { platform: 'whatsapp', count: 7 },
      ],
      platformAlerts: [
        { platform: 'facebook', count: 8 },
        { platform: 'whatsapp', count: 6 },
        { platform: 'linkedin', count: 4 },
      ],
      categoryAlerts: [
        { category: 'food', count: 6 },
        { category: 'automotive', count: 4 },
        { category: 'electronics', count: 3 },
        { category: 'construction', count: 3 },
        { category: 'textiles', count: 2 },
      ],
      urgencyBreakdown: [
        { urgency: 'high', count: 9 },
        { urgency: 'medium', count: 6 },
        { urgency: 'low', count: 3 },
      ],
    },
    topProducts: [
      { product: 'bulk rice', count: 4 },
      { product: 'organic shea butter', count: 3 },
      { product: 'motorcycles CKD', count: 2 },
      { product: 'solar panels', count: 2 },
      { product: 'cement', count: 2 },
    ],
    topMarkets: [
      { market: 'Guinea', count: 5 },
      { market: 'Senegal', count: 4 },
      { market: 'Ghana', count: 3 },
      { market: 'Kenya', count: 3 },
      { market: 'Nigeria', count: 2 },
      { market: "Côte d'Ivoire", count: 1 },
    ],
    agentActivity: [
      { agent_id: 'agent-1', agent_name: 'Amadou Balde', total: 11, posted: 9 },
      { agent_id: 'agent-2', agent_name: 'Mariam Diallo', total: 9, posted: 7 },
      { agent_id: 'agent-3', agent_name: 'Ibrahim Sow', total: 8, posted: 3 },
      { agent_id: 'agent-4', agent_name: 'Fatoumata Sy', total: 5, posted: 2 },
      { agent_id: 'agent-5', agent_name: 'Alpha Barry', total: 2, posted: 1 },
    ],
    dailyTrend: {
      leads: [
        { date: '2026-06-01', count: 1 },
        { date: '2026-06-02', count: 3 },
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
        { date: '2026-06-17', count: 2 },
        { date: '2026-06-18', count: 4 },
        { date: '2026-06-19', count: 1 },
        { date: '2026-06-20', count: 3 },
        { date: '2026-06-21', count: 2 },
        { date: '2026-06-22', count: 4 },
        { date: '2026-06-23', count: 5 },
        { date: '2026-06-24', count: 3 },
        { date: '2026-06-25', count: 2 },
        { date: '2026-06-26', count: 4 },
        { date: '2026-06-27', count: 1 },
        { date: '2026-06-28', count: 3 },
        { date: '2026-06-29', count: 2 },
        { date: '2026-06-30', count: 1 },
      ],
      alerts: [
        { date: '2026-06-01', count: 1 },
        { date: '2026-06-03', count: 1 },
        { date: '2026-06-05', count: 2 },
        { date: '2026-06-07', count: 2 },
        { date: '2026-06-08', count: 1 },
        { date: '2026-06-10', count: 2 },
        { date: '2026-06-11', count: 2 },
        { date: '2026-06-12', count: 1 },
        { date: '2026-06-14', count: 2 },
        { date: '2026-06-16', count: 1 },
        { date: '2026-06-20', count: 1 },
        { date: '2026-06-24', count: 1 },
        { date: '2026-06-28', count: 1 },
      ],
    },
  },
};

/**
 * Route handler that returns different dashboard data based on startDate/endDate params.
 * If startDate is present, returns filtered data; otherwise returns the default.
 */
async function smartDashboardRoute(route) {
  const request = route.request();
  let body = {};
  try {
    body = JSON.parse(request.postData() || '{}');
  } catch (e) {
    body = {};
  }
  const hasDateFilter = body.startDate && body.endDate;
  const responseData = hasDateFilter ? MOCK_DASHBOARD_FILTERED : MOCK_DASHBOARD;
  return route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(responseData),
  });
}

const MOCK_DASHBOARD_EMPTY = {
  errcode: 0,
  data: {
    overview: {
      totalLeads: 0,
      totalAlerts: 0,
      postedComments: 0,
      pendingComments: 0,
      suppliersListed: 0,
      emailsSent: 0,
      conversionRate: 0,
      totalActions: 0,
    },
    breakdowns: {
      platformLeads: [],
      platformAlerts: [],
      categoryAlerts: [],
      urgencyBreakdown: [],
    },
    topProducts: [],
    topMarkets: [],
    agentActivity: [],
    dailyTrend: {
      leads: [],
      alerts: [],
    },
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────

// Auth token is set via page.addInitScript() in setupApiMocks() — no separate helper needed.

/**
 * Intercept all API calls for the dashboard endpoint.
 */
async function setupApiMocks(page, options = {}) {
  const {
    dashboardResponse = MOCK_DASHBOARD,
    dashboardDelay = 0,
  } = options;

  // Set up route interception FIRST, so all API calls are mocked
  // Intercept comment-agent API calls for dashboard data.
  // The base URL (api.sokogate.com) has no /api/ path segment, so match by endpoint name.
  await page.route('**/comment-agent/**', async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    // Dashboard endpoint
    if (url.includes('dashboard') && method === 'POST') {
      if (dashboardDelay > 0) {
        await new Promise((r) => setTimeout(r, dashboardDelay));
      }
      return await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(dashboardResponse),
      });
    }

    // Everything else returns empty OK (for leads/alerts calls that may fire)
    return await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(EMPTY_OK),
    });
  });

  // Set auth token + user data + dashboard defaults BEFORE page scripts run, so:
  // 1. The layout's initLocalStorage() commits 'login' instead of 'loginout'
  // 2. The axios interceptor finds the auth_token
  // 3. Dashboard defaults are initialized (the component's data() reads these from localStorage)
  await page.addInitScript(() => {
    const futureExpiry = Math.round(Date.now() / 1000) + 86400;
    localStorage.setItem('auth_token', 'mock-token-for-e2e');
    localStorage.setItem('auth_token_expire', String(futureExpiry));
    localStorage.setItem('currentUser', JSON.stringify({
      userId: 'e2e-test-agent',
      email: 'agent@sokogate.com',
      name: 'E2E Test Agent',
    }));
    if (localStorage.getItem('hq_dashboard_autoRefresh') === null) {
      localStorage.setItem('hq_dashboard_autoRefresh', 'true');
    }
    if (localStorage.getItem('hq_dashboard_refreshInterval') === null) {
      localStorage.setItem('hq_dashboard_refreshInterval', '60');
    }
  });
}

/**
 * Wait for the Vue app shell to render.
 */
async function waitForApp(page) {
  await page.waitForLoadState('domcontentloaded');
  await page
    .waitForFunction(
      () => document.querySelector('#app')?.children?.length > 0,
      { timeout: 15000 }
    )
    .catch(() => {});
  // Give HMR/lazy-chunks a moment to settle
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
}

// ── Tests ──────────────────────────────────────────────────────────────────

test.describe('HQ Dashboard Page', () => {
  // ── Page Load ──────────────────────────────────────────────────────
  test.describe('Page Load', () => {
    test('should load the dashboard page and display header', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      const header = page.locator('.dashboard-header');
      await expect(header).toBeAttached({ timeout: 10000 });
      await expect(header).toContainText(/Soko HQ Dashboard/i);
      await expect(header).toContainText(/HQ Command Center/i);
    });

    test('should display all 6 KPI cards with correct values', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      // Wait for data to load (KPI cards appear)
      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      // Verify KPI values from mock data
      await expect(page.locator('.kpi-row')).toContainText(/70/);   // Posts Analyzed (totalActions)
      await expect(page.locator('.kpi-row')).toContainText(/47/);   // Comments (totalLeads)
      await expect(page.locator('.kpi-row')).toContainText(/23/);   // Sourcing Alerts (totalAlerts)
      await expect(page.locator('.kpi-row')).toContainText(/8/);    // Suppliers Listed
      await expect(page.locator('.kpi-row')).toContainText(/44%/);  // Conversion Rate
      await expect(page.locator('.kpi-row')).toContainText(/16/);   // Pending
    });

    test('should display all chart cards', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      // Wait for data to load
      await expect(page.locator('.chart-card')).toHaveCount(7, { timeout: 10000 });

      // Verify chart card headers (use .nth() to avoid strict mode with multiple matches)
      await expect(page.locator('.chart-card').nth(0)).toContainText(/Daily Activity/i);
      await expect(page.locator('.chart-card').nth(1)).toContainText(/Top Products Demanded/i);
      await expect(page.locator('.chart-card').nth(2)).toContainText(/Top Markets/i);
      await expect(page.locator('.chart-card').nth(3)).toContainText(/Categories/i);
      await expect(page.locator('.chart-card').nth(4)).toContainText(/Alert Urgency/i);
      await expect(page.locator('.chart-card').nth(5)).toContainText(/Top Agents/i);
      await expect(page.locator('.chart-card').nth(6)).toContainText(/Platform Breakdown/i);
    });

    test('should show loading state while fetching data', async ({ page }) => {
      test.setTimeout(60000);
      // Use delay to ensure loading state is visible before response
      await setupApiMocks(page, { dashboardDelay: 2000 });
      await page.goto('/v2/hq-dashboard');

      // Wait for Vue app to render (don't wait for networkidle since delayed API keeps it busy)
      await page.waitForLoadState('domcontentloaded');
      await page.waitForFunction(
        () => document.querySelector('#app')?.children?.length > 0,
        { timeout: 15000 }
      ).catch(() => {});

      // Loading state should appear before the delayed response comes back
      await expect(page.locator('.loading-state')).toBeAttached({ timeout: 5000 });
      await expect(page.locator('.loading-state')).toContainText(/Loading dashboard/i);
    });
  });

  // ── KPI Cards ──────────────────────────────────────────────────────
  test.describe('KPI Cards', () => {
    test('should show KPI sub-labels with details', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      // Verify sub-labels (use .first() to avoid strict mode with 6 matching elements)
      const kpiBody = page.locator('.kpi-body').first();
      await expect(kpiBody).toContainText(/Total posts processed/i);

      // Check each KPI card's sub-text individually
      await expect(page.locator('.kpi-card').nth(1)).toContainText(/31 posted/i);
      await expect(page.locator('.kpi-card').nth(2)).toContainText(/8 listed/i);
      await expect(page.locator('.kpi-card').nth(3)).toContainText(/20 emails sent/i);
      await expect(page.locator('.kpi-card').nth(4)).toContainText(/31 converted/i);
      await expect(page.locator('.kpi-card').nth(5)).toContainText(/Awaiting agent action/i);
    });
  });

  // ── Top Products ───────────────────────────────────────────────────
  test.describe('Top Products', () => {
    test('should display ranked list of top products', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.chart-card')).toHaveCount(7, { timeout: 10000 });

      // Verify top products are listed
      const rankedItems = page.locator('.ranked-item');
      await expect(rankedItems.first()).toContainText(/bulk rice/i);
      await expect(rankedItems.first()).toContainText(/5/); // count
    });
  });

  // ── Top Markets ────────────────────────────────────────────────────
  test.describe('Top Markets', () => {
    test('should display ranked list of top markets', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.chart-card')).toHaveCount(7, { timeout: 10000 });

      // Find the Top Markets card by its header text
      const marketsCard = page.locator('.chart-card').filter({ hasText: /Top Markets/i });
      await expect(marketsCard).toContainText(/Guinea/i);
      await expect(marketsCard).toContainText(/Senegal/i);
      await expect(marketsCard).toContainText(/Ghana/i);
    });
  });

  // ── Category Breakdown ─────────────────────────────────────────────
  test.describe('Categories', () => {
    test('should display category breakdown with bars', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.chart-card')).toHaveCount(7, { timeout: 10000 });

      // Find the Categories card
      const catCard = page.locator('.chart-card').filter({ hasText: /Categories/i });
      await expect(catCard).toContainText(/food/i);
      await expect(catCard).toContainText(/automotive/i);
      await expect(catCard).toContainText(/electronics/i);
    });
  });

  // ── Urgency Breakdown ──────────────────────────────────────────────
  test.describe('Urgency', () => {
    test('should display urgency breakdown with color-coded bars', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.chart-card')).toHaveCount(7, { timeout: 10000 });

      // Find the Alert Urgency card
      const urgCard = page.locator('.chart-card').filter({ hasText: /Alert Urgency/i });
      await expect(urgCard).toContainText(/high/i);
      await expect(urgCard).toContainText(/medium/i);
      await expect(urgCard).toContainText(/low/i);
    });
  });

  // ── Agent Leaderboard ──────────────────────────────────────────────
  test.describe('Agent Leaderboard', () => {
    test('should display agent activity table with progress bars', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.chart-card')).toHaveCount(7, { timeout: 10000 });

      // Find the Top Agents card
      const agentsCard = page.locator('.chart-card').filter({ hasText: /Top Agents/i });
      await expect(agentsCard).toContainText(/Amadou Balde/i);
      await expect(agentsCard).toContainText(/Mariam Diallo/i);
      await expect(agentsCard).toContainText(/Ibrahim Sow/i);

      // Verify agent table columns
      const agentTable = agentsCard.locator('.agent-table');
      await expect(agentTable).toContainText(/15/); // Amadou's total
      await expect(agentTable).toContainText(/12/); // Amadou's posted
      await expect(agentTable).toContainText(/12/); // Mariam's total
    });
  });

  // ── Platform Breakdown ─────────────────────────────────────────────
  test.describe('Platform Breakdown', () => {
    test('should display platforms with combined comment + alert counts', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.chart-card')).toHaveCount(7, { timeout: 10000 });

      // Find the Platform Breakdown card
      const platCard = page.locator('.chart-card').filter({ hasText: /Platform Breakdown/i });
      await expect(platCard).toContainText(/facebook/i);
      await expect(platCard).toContainText(/linkedin/i);
      await expect(platCard).toContainText(/whatsapp/i);
    });
  });

  // ── Empty State ────────────────────────────────────────────────────
  test.describe('Empty State', () => {
    test('should show empty state placeholders when no data exists', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page, { dashboardResponse: MOCK_DASHBOARD_EMPTY });
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      // KPI cards should show zeros
      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      // Empty chart states should appear
      const emptyCharts = page.locator('.empty-chart');
      await expect(emptyCharts).toHaveCount(6); // products, markets, categories, urgency, agents, platforms

      // Verify empty state messages (use .nth() to avoid strict mode with 6 matching elements)
      await expect(emptyCharts.nth(0)).toContainText(/No sourcing alerts yet/i);
      await expect(emptyCharts.nth(1)).toContainText(/No market data yet/i);
      await expect(emptyCharts.nth(2)).toContainText(/No category data yet/i);
      await expect(emptyCharts.nth(3)).toContainText(/No urgency data yet/i);
      await expect(emptyCharts.nth(4)).toContainText(/No agent activity yet/i);
      await expect(emptyCharts.nth(5)).toContainText(/No platform data yet/i);
    });
  });

  // ── Error Handling ─────────────────────────────────────────────────
  test.describe('Error Handling', () => {
    test('should show error state when API call fails', async ({ page }) => {
      test.setTimeout(60000);
      await page.addInitScript(() => {
        const futureExpiry = Math.round(Date.now() / 1000) + 86400;
        localStorage.setItem('auth_token', 'mock-token-for-e2e');
        localStorage.setItem('auth_token_expire', String(futureExpiry));
        localStorage.setItem('currentUser', JSON.stringify({ userId: 'e2e-test-agent', email: 'agent@sokogate.com', name: 'E2E Test Agent' }));
      });
      await page.route('**/comment-agent/**', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ errcode: 50000, errmsg: 'Internal server error', data: null }),
        });
      });
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      // Error state should appear with retry button
      await expect(page.locator('.error-state')).toBeAttached({ timeout: 10000 });
      await expect(page.locator('.error-state')).toContainText(/Failed to load dashboard/i);
      await expect(page.locator('.error-state')).toContainText(/Retry/i);
    });

    test('should retry loading when Retry button is clicked after error', async ({ page }) => {
      test.setTimeout(60000);
      // First request fails
      let callCount = 0;
      await page.addInitScript(() => {
        const futureExpiry = Math.round(Date.now() / 1000) + 86400;
        localStorage.setItem('auth_token', 'mock-token-for-e2e');
        localStorage.setItem('auth_token_expire', String(futureExpiry));
        localStorage.setItem('currentUser', JSON.stringify({ userId: 'e2e-test-agent', email: 'agent@sokogate.com', name: 'E2E Test Agent' }));
      });
      await page.route('**/comment-agent/**', async (route) => {
        callCount++;
        if (callCount === 1) {
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ errcode: 50000, errmsg: 'Internal server error', data: null }),
          });
        } else {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(MOCK_DASHBOARD),
          });
        }
      });
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      // Error state visible
      await expect(page.locator('.error-state')).toBeAttached({ timeout: 10000 });

      // Click Retry
      await page.getByText(/Retry/i).click();

      // Wait for dashboard to load
      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });
    });
  });

  // ── Date Range Filter ─────────────────────────────────────────────
  test.describe('Date Range Filter', () => {
    test('should display date preset buttons in filter bar', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      // Filter bar should be visible
      const filterBar = page.locator('.date-filter-bar');
      await expect(filterBar).toBeAttached({ timeout: 10000 });

      // All presets should be visible
      await expect(filterBar).toContainText(/Last 7 Days/i);
      await expect(filterBar).toContainText(/Last 14 Days/i);
      await expect(filterBar).toContainText(/Last 30 Days/i);
      await expect(filterBar).toContainText(/Last 90 Days/i);
      await expect(filterBar).toContainText(/Custom/i);
    });

    test('should highlight the active preset button', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      // Wait for data to load
      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      // "Last 14 Days" should be active (default) — btn-danger variant
      const activeBtn = page.locator('.filter-presets .btn-danger');
      await expect(activeBtn).toContainText(/Last 14 Days/i);
    });

    test('should switch to Last 7 Days preset and reload data', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page, { dashboardResponse: MOCK_DASHBOARD_FILTERED });
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      // Click "Last 7 Days" preset
      await page.locator('.preset-btn').filter({ hasText: /Last 7 Days/i }).click();

      // Should re-fetch with date params — the default mock still returns
      await expect(page.locator('.kpi-card')).toHaveCount(6);
    });

    test('should show custom date pickers when Custom preset is clicked', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      // Click "Custom" button by finding it in the filter presets
      const customBtn = page.locator('.filter-presets .preset-btn').filter({ hasText: /Custom/i });
      await expect(customBtn).toBeAttached({ timeout: 5000 });
      await customBtn.click();

      // Date pickers should appear
      await expect(page.locator('.date-picker')).toHaveCount(2, { timeout: 5000 });
      await expect(page.locator('.apply-btn')).toBeAttached({ timeout: 5000 });
    });

    test('should send date params with API request when using preset', async ({ page }) => {
      test.setTimeout(60000);
      let receivedBody = null;
      await page.addInitScript(() => {
        const futureExpiry = Math.round(Date.now() / 1000) + 86400;
        localStorage.setItem('auth_token', 'mock-token-for-e2e');
        localStorage.setItem('auth_token_expire', String(futureExpiry));
        localStorage.setItem('currentUser', JSON.stringify({ userId: 'e2e-test-agent', email: 'agent@sokogate.com', name: 'E2E Test Agent' }));
      });
      await page.route('**/comment-agent/**', async (route) => {
        const request = route.request();
        if (request.url().includes('dashboard') && request.method() === 'POST') {
          let body = {};
          try {
            body = JSON.parse(request.postData() || '{}');
          } catch (e) {}
          if (body.startDate && body.endDate) {
            receivedBody = body;
          }
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(MOCK_DASHBOARD_FILTERED),
          });
        }
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(EMPTY_OK),
        });
      });
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      // Click "Last 7 Days" preset
      await page.locator('.preset-btn').filter({ hasText: /Last 7 Days/i }).click();
      await page.waitForTimeout(500);

      // Verify date params were sent
      expect(receivedBody).not.toBeNull();
      expect(receivedBody.startDate).toBeDefined();
      expect(receivedBody.endDate).toBeDefined();
    });
  });

  // ── Auto-Refresh ──────────────────────────────────────────────────
  test.describe('Auto-Refresh', () => {
    test('should display auto-refresh bar with toggle and indicator', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      const refreshBar = page.locator('.auto-refresh-bar');
      await expect(refreshBar).toBeAttached();

      // Should show auto-refresh text
      await expect(refreshBar).toContainText(/Auto-refresh/i);

      // Toggle should exist
      await expect(refreshBar.locator('.refresh-toggle')).toBeAttached();
    });

    test('should show last updated timestamp after data loads', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      // Last updated timestamp should be visible
      const lastUpdated = page.locator('.last-updated');
      await expect(lastUpdated).toBeAttached();
      await expect(lastUpdated).toContainText(/Last updated/i);
    });

    test('should show auto-refresh enabled indicator dot', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      // The green dot should be visible (auto-refresh enabled by default)
      const activeDot = page.locator('.refresh-dot.active');
      await expect(activeDot).toBeAttached();
    });

    test('should pause auto-refresh when toggled off', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      // Click the toggle to disable
      const toggle = page.locator('.refresh-toggle');
      await toggle.click();

      // Should show paused text
      const refreshBar = page.locator('.auto-refresh-bar');
      await expect(refreshBar).toContainText(/paused/i);
    });

    test('should display refresh interval in label text', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      // Default interval is 60s
      const refreshBar = page.locator('.auto-refresh-bar');
      await expect(refreshBar).toContainText(/Auto-refreshing every 60s/i);
    });

    test('should have settings button and show interval options on click', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      // Settings button should be visible
      const settingsBtn = page.locator('.settings-btn');
      await expect(settingsBtn).toBeAttached();

      // Click the settings button to open popover
      await settingsBtn.click();

      // Interval options should be visible
      const settingsPanel = page.locator('.refresh-settings-panel');
      await expect(settingsPanel).toContainText(/Refresh Interval/i);
      await expect(settingsPanel).toContainText(/30s/);
      await expect(settingsPanel).toContainText(/60s/);
      await expect(settingsPanel).toContainText(/120s/);
    });

    test('should persist toggle state to localStorage when changed', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      // Verify localStorage has the initial 'true' value
      const initialVal = await page.evaluate(() => localStorage.getItem('hq_dashboard_autoRefresh'));
      expect(initialVal).toBe('true');

      // Toggle auto-refresh off
      const toggle = page.locator('.refresh-toggle');
      await toggle.click();
      await page.waitForTimeout(500);

      // Verify localStorage was updated to 'false'
      const toggledVal = await page.evaluate(() => localStorage.getItem('hq_dashboard_autoRefresh'));
      expect(toggledVal).toBe('false');

      // Toggle back on
      await toggle.click();
      await page.waitForTimeout(500);

      const restoredVal = await page.evaluate(() => localStorage.getItem('hq_dashboard_autoRefresh'));
      expect(restoredVal).toBe('true');
    });

    test('should persist interval to localStorage when changed', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      // Default interval should be 60
      const initialInterval = await page.evaluate(() => localStorage.getItem('hq_dashboard_refreshInterval'));
      expect(initialInterval).toBe('60');

      // Open settings popover
      const settingsBtn = page.locator('.settings-btn');
      await settingsBtn.click();
      await page.waitForTimeout(300);

      // Click 30s option
      await page.locator('.refresh-settings-panel .el-radio-button').first().click();
      await page.waitForTimeout(500);

      // Verify localStorage was updated
      const newInterval = await page.evaluate(() => localStorage.getItem('hq_dashboard_refreshInterval'));
      expect(newInterval).toBe('30');
    });

    test('should restore persisted state after page reload', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      // Change interval to 30s
      const settingsBtn = page.locator('.settings-btn');
      await settingsBtn.click();
      await page.waitForTimeout(300);
      await page.locator('.refresh-settings-panel .el-radio-button').first().click();
      await page.waitForTimeout(500);

      // Toggle off
      await page.locator('.refresh-toggle').click();
      await page.waitForTimeout(500);

      // Verify localStorage values
      expect(await page.evaluate(() => localStorage.getItem('hq_dashboard_autoRefresh'))).toBe('false');
      expect(await page.evaluate(() => localStorage.getItem('hq_dashboard_refreshInterval'))).toBe('30');

      // Reload the page
      await page.reload();
      await waitForApp(page);
      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      // After reload, the bar should show paused text (restored from localStorage)
      const refreshBar = page.locator('.auto-refresh-bar');
      await expect(refreshBar).toContainText(/paused/i);

      // The interval should be 30s (not default 60s)
      // Toggle back on and check the interval label
      await page.locator('.refresh-toggle').click();
      await page.waitForTimeout(500);
      await expect(refreshBar).toContainText(/Auto-refreshing every 30s/i);
    });
  });

  // ── PDF Export ────────────────────────────────────────────────────
  test.describe('PDF Export', () => {
    test('should display Export PDF button in header', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      const exportBtn = page.locator('.export-pdf-btn');
      await expect(exportBtn).toBeAttached();
      await expect(exportBtn).toContainText(/Export PDF/i);
    });

    test('should have #pdfDom element wrapping dashboard content', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.kpi-card')).toHaveCount(6, { timeout: 10000 });

      // The #pdfDom element should exist and contain KPI cards and charts
      const pdfDom = page.locator('#pdfDom');
      await expect(pdfDom).toBeAttached();
      await expect(pdfDom.locator('.kpi-row')).toBeAttached();
      await expect(pdfDom.locator('.chart-card').first()).toBeAttached();
    });

    test('should disable Export PDF button when data is loading', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page, { dashboardDelay: 5000 });
      await page.goto('/v2/hq-dashboard');

      // Wait for Vue app to render (don't wait for networkidle since delayed API keeps it busy)
      await page.waitForLoadState('domcontentloaded');
      await page.waitForFunction(
        () => document.querySelector('#app')?.children?.length > 0,
        { timeout: 15000 }
      ).catch(() => {});

      // While loading (before 5s delay completes), button should be disabled
      const exportBtn = page.locator('.export-pdf-btn');
      await expect(exportBtn).toBeDisabled({ timeout: 3000 });
    });
  });

  // ── Daily Trend Bar Chart ──────────────────────────────────────────
  test.describe('Daily Trend Chart', () => {
    test('should render bar chart with daily activity', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.chart-card')).toHaveCount(7, { timeout: 10000 });

      // Verify the bar chart container exists
      const barChart = page.locator('.bar-chart');
      await expect(barChart).toBeAttached();

      // Verify bar groups exist (14 days)
      const barGroups = barChart.locator('.bar-group');
      const count = await barGroups.count();
      expect(count).toBe(14);
    });

    test('should display chart legend with Comments and Alerts labels', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/hq-dashboard');
      await waitForApp(page);

      await expect(page.locator('.chart-card')).toHaveCount(7, { timeout: 10000 });

      // Verify legend
      const legend = page.locator('.chart-legend');
      await expect(legend).toContainText(/Comments/i);
      await expect(legend).toContainText(/Alerts/i);
    });
  });
});
