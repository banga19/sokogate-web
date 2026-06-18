/**
 * E2E Tests — Comment Agent Page
 *
 * Tests the ground agent UI for the Soko Comment Agent tool:
 * post input, AI analysis, comment generation, sourcing alerts,
 * and activity history.
 *
 * All API calls are intercepted to avoid backend dependency.
 *
 * Usage:
 *   npx playwright test tests/e2e/comment-agent.spec.js --config=tests/e2e/playwright.config.js
 *   npx playwright test tests/e2e/comment-agent.spec.js --config=tests/e2e/playwright.config.js --headed
 */

const { test, expect } = require('@playwright/test');

// ── Mock Data ──────────────────────────────────────────────────────────────

const EMPTY_OK = { errcode: 0, data: {} };

const EMPTY_LIST = { errcode: 0, data: { rows: [], total: 0 } };

const MOCK_ANALYSIS = {
  errcode: 0,
  data: {
    action: 'comment',
    comment:
      'We work with verified rice exporters in India and Vietnam who ship regularly to Conakry. Competitive pricing with secure escrow payment. Check out Sokogate.com or message me for introductions!',
    analysis: {
      intent: 'buying',
      product: 'bulk rice',
      quantity: '10 tons',
      market: 'Guinea',
      urgency: 'high',
      category: 'food',
      buyer_name: 'Mamadou Diallo',
      sokogate_match: true,
    },
    leadId: 'lead-uuid-abc-123',
    match: {
      found: true,
      products: [{ id: 'prod-1', name: 'Premium Basmati Rice' }],
      method: 'pgvector',
    },
  },
};

const MOCK_ALERT = {
  errcode: 0,
  data: {
    action: 'alert',
    alert:
      '[SOURCING ALERT] Product needed: organic shea butter. Market: Ghana. Urgency: medium. The buyer needs 500kg for cosmetics production, EU export quality. Not found in current catalog. Sourcing team notified.',
    analysis: {
      intent: 'buying',
      product: 'organic shea butter',
      quantity: '500kg',
      market: 'Ghana',
      urgency: 'medium',
      category: 'agri-input',
      buyer_name: 'the buyer',
      sokogate_match: false,
    },
    alertId: 'alert-uuid-xyz-789',
    match: {
      found: false,
      products: [],
    },
  },
};

const MOCK_PREVIEW = {
  errcode: 0,
  data: {
    analysis: {
      intent: 'buying',
      product: 'bulk rice',
      category: 'food',
      market: 'Guinea',
      urgency: 'high',
      buyer_name: 'the buyer',
      sokogate_match: true,
    },
    match: {
      found: true,
      products: [{ id: 'prod-1', name: 'Premium Basmati Rice' }],
    },
  },
};

const MOCK_LEADS = {
  errcode: 0,
  data: {
    rows: [
      {
        id: 'lead-1',
        agent_id: 'agent-1',
        platform: 'facebook',
        post_text: 'Je cherche des fournisseurs de riz en vrac pour ma boutique à Conakry.',
        comment_text:
          'We work with verified rice exporters in India and Vietnam. Check out Sokogate.com!',
        analysis: { product: 'bulk rice', market: 'Guinea', category: 'food' },
        posted: true,
        posted_at: '2026-06-16T10:30:00Z',
        created_at: '2026-06-16T10:25:00Z',
      },
      {
        id: 'lead-2',
        agent_id: 'agent-1',
        platform: 'linkedin',
        post_text: 'Looking for Chinese motorcycle suppliers.',
        comment_text:
          'We work with verified CKD motorcycle factories in Chongqing and Guangzhou. Drop me a message!',
        analysis: { product: 'motorcycles CKD', market: 'Senegal', category: 'automotive' },
        posted: false,
        posted_at: null,
        created_at: '2026-06-15T14:00:00Z',
      },
    ],
    total: 2,
  },
};

const MOCK_ALERTS = {
  errcode: 0,
  data: {
    rows: [
      {
        id: 'alert-1',
        agent_id: 'agent-1',
        product: 'organic shea butter',
        market: 'Ghana',
        urgency: 'medium',
        email_sent: true,
        supplier_listed: false,
        alert_text: '[SOURCING ALERT] Product needed: organic shea butter. Market: Ghana.',
        created_at: '2026-06-15T09:00:00Z',
      },
      {
        id: 'alert-2',
        agent_id: 'agent-1',
        product: 'solar panels',
        market: 'Kenya',
        urgency: 'high',
        email_sent: true,
        supplier_listed: true,
        alert_text: '[SOURCING ALERT] Solar panels needed for Nairobi importer.',
        created_at: '2026-06-14T16:30:00Z',
      },
    ],
    total: 2,
  },
};

const MOCK_CONFIRM_RESPONSE = {
  errcode: 0,
  data: { message: 'Comment confirmed as posted', lead: { id: 'lead-1', posted: true } },
};

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Intercept all API calls for the comment-agent endpoints.
 * Pass endpoint-specific mock data via options.
 */
async function setupApiMocks(page, options = {}) {
  const {
    analyzePostResponse = null,
    analyzePostDelay = 0,
    analyzeOnlyResponse = null,
    leadsResponse = EMPTY_LIST,
    alertsResponse = EMPTY_LIST,
    confirmResponse = EMPTY_OK,
  } = options;

  // Intercept comment-agent API calls.
  // The base URL (api.sokogate.com) has no /api/ path segment, so we match by endpoint name.
  await page.route('**/comment-agent/**', async (route) => {
    const url = route.request().url();
    const method = route.request().method();
    let body;

    if (method === 'POST' || method === 'PUT') {
      try {
        body = JSON.parse(route.request().postData() || '{}');
      } catch {
        body = {};
      }
    }

    // Analyze Post (full pipeline) — with optional delay for loading state testing
    if (url.includes('analyze-post') && method === 'POST' && analyzePostResponse) {
      if (analyzePostDelay > 0) {
        await new Promise((r) => setTimeout(r, analyzePostDelay));
      }
      return await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(analyzePostResponse),
      });
    }

    // Analyze Only (preview)
    if (url.includes('analyze-only') && method === 'POST' && analyzeOnlyResponse) {
      return await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(analyzeOnlyResponse),
      });
    }

    // Comment Leads list
    if ((url.includes('leads') || url.includes('comment-leads')) && method === 'POST' && !body.id) {
      return await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(leadsResponse),
      });
    }

    // Confirm post
    if (url.includes('confirm-post') && method === 'POST') {
      return await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(confirmResponse),
      });
    }

    // Sourcing Alerts list
    if (url.includes('alerts') && method === 'POST' && !body.id) {
      return await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(alertsResponse),
      });
    }

    // Shouldn't reach here for non-matched URLs, but just in case
    return await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(EMPTY_OK),
    });
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

/**
 * Fill in a sample buyer post with platform selection.
 * Uses more reliable selectors for Element UI components.
 */
async function fillSamplePost(page, { platform = 'facebook', text, note } = {}) {
  // Fill post text (textarea is a standard HTML element)
  const textarea = page.locator('#post-text');
  await textarea.fill(text || 'Je cherche des fournisseurs de riz en vrac pour ma boutique à Conakry. Besoin de 10 tonnes minimum.');

  // Fill note if provided
  if (note) {
    await page.locator('#agent-note').fill(note);
  }
}

/**
 * Set a mock auth token AND user data BEFORE the page's own scripts run, so:
 * 1. The layout's initLocalStorage() commits 'login' instead of 'loginout'
 * 2. The axios interceptor finds the auth_token
 * Must call this BEFORE page.goto().
 */
async function setupAuthToken(page) {
  await page.addInitScript(() => {
    // Set a far-future expiry so authTokenIsValid getter returns true
    const futureExpiry = Math.round(Date.now() / 1000) + 86400;
    localStorage.setItem('auth_token', 'mock-token-for-e2e');
    localStorage.setItem('auth_token_expire', String(futureExpiry));
    localStorage.setItem('currentUser', JSON.stringify({
      userId: 'e2e-test-agent',
      email: 'agent@sokogate.com',
      name: 'E2E Test Agent',
    }));
  });
}

// ── Tests ──────────────────────────────────────────────────────────────────

test.describe('Comment Agent Page', () => {
  // ── Page Load ──────────────────────────────────────────────────────
  test.describe('Page Load', () => {
    test('should load the comment agent page and display header', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/comment-agent');
      await waitForApp(page);

      // Verify the header renders
      const header = page.locator('.agent-header');
      await expect(header).toBeAttached({ timeout: 10000 });
      await expect(header).toContainText(/Soko Comment Agent/i);
    });

    test('should display input card with all fields', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/comment-agent');
      await waitForApp(page);

      // Input card
      const inputCard = page.locator('.input-card');
      await expect(inputCard).toBeAttached({ timeout: 10000 });

      // Platform selector
      await expect(page.locator('.platform-select')).toBeAttached();

      // Post URL field
      await expect(page.locator('#post-url')).toBeAttached();

      // Post text textarea
      await expect(page.locator('#post-text')).toBeAttached();

      // Agent note field
      await expect(page.locator('#agent-note')).toBeAttached();

      // Action buttons
      await expect(page.locator('.analyze-btn')).toBeAttached();
      await expect(page.locator('.preview-btn')).toBeAttached();
      await expect(page.locator('.reset-btn')).toBeAttached();
    });

    test('should display result panel with empty state', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/comment-agent');
      await waitForApp(page);

      const resultCard = page.locator('.result-card');
      await expect(resultCard).toBeAttached({ timeout: 10000 });

      // Empty state text
      await expect(resultCard).toContainText(/Submit a buyer post to analyze/i);
    });

    test('should display history section', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await page.goto('/v2/comment-agent');
      await waitForApp(page);

      const historyCard = page.locator('.history-card');
      await expect(historyCard).toBeAttached({ timeout: 10000 });
      await expect(historyCard).toContainText(/Activity History/i);
    });
  });

  // ── Analyze Post (Comment Match) ──────────────────────────────────
  test.describe('Analyze Post — Comment Match', () => {
    test('should analyze a post and display generated comment', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page, {
        analyzePostResponse: MOCK_ANALYSIS,
        leadsResponse: MOCK_LEADS,
        alertsResponse: EMPTY_LIST,
      });
      await setupAuthToken(page);
      await page.goto('/v2/comment-agent');
      await waitForApp(page);

      // Fill in the post
      await fillSamplePost(page, { platform: 'facebook' });

      // Click Analyze & Respond using the CSS class selector
      await page.locator('.analyze-btn').click();

      // Wait for result to appear (after mock API response)
      await expect(page.locator('.result-content')).toBeAttached({ timeout: 15000 });

      // Analysis summary should show the product and intent
      await expect(page.locator('.analysis-summary')).toContainText(/bulk rice/i);
      await expect(page.locator('.analysis-summary')).toContainText(/buying/i);
      await expect(page.locator('.analysis-summary')).toContainText(/Guinea/i);
      await expect(page.locator('.analysis-summary')).toContainText(/food/i);

      // Comment bubble should display generated comment
      await expect(page.locator('.comment-bubble')).toContainText(/rice exporters/i);

      // Action buttons should appear
      await expect(page.getByText(/Copy Comment/i)).toBeAttached();
      await expect(page.getByText(/Mark as Posted/i)).toBeAttached();

      // MATCH FOUND tag should be visible
      await expect(page.locator('.result-card').getByText(/MATCH FOUND/i)).toBeAttached();
    });

    test('should copy comment to clipboard', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page, {
        analyzePostResponse: MOCK_ANALYSIS,
        leadsResponse: EMPTY_LIST,
        alertsResponse: EMPTY_LIST,
      });
      await setupAuthToken(page);
      await page.goto('/v2/comment-agent');
      await waitForApp(page);

      await fillSamplePost(page);
      await page.locator('.analyze-btn').click();
      await expect(page.locator('.result-content')).toBeAttached({ timeout: 15000 });

      // Grant clipboard permission and click copy
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.getByText(/Copy Comment/i).click();

      // Read clipboard content
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardText).toContain('rice exporters');

      // Success message should appear (use first if multiple messages are stacked)
      await expect(page.locator('.el-message--success').first()).toBeAttached({ timeout: 5000 });
    });

    test('should mark comment as posted', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page, {
        analyzePostResponse: MOCK_ANALYSIS,
        confirmResponse: MOCK_CONFIRM_RESPONSE,
        leadsResponse: MOCK_LEADS,
        alertsResponse: EMPTY_LIST,
      });
      await setupAuthToken(page);
      await page.goto('/v2/comment-agent');
      await waitForApp(page);

      await fillSamplePost(page);
      await page.locator('.analyze-btn').click();
      await expect(page.locator('.result-content')).toBeAttached({ timeout: 15000 });

      // Click "Mark as Posted"
      await page.getByText(/Mark as Posted/i).click();

      // Success message (use first if multiple messages are stacked)
      await expect(page.locator('.el-message--success').first()).toBeAttached({ timeout: 5000 });
      await expect(page.locator('.el-message--success').first()).toContainText(/Marked as posted/i);
    });
  });

  // ── Analyze Post (Sourcing Alert) ─────────────────────────────────
  test.describe('Analyze Post — Sourcing Alert', () => {
    test('should generate sourcing alert when product not in catalog', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page, {
        analyzePostResponse: MOCK_ALERT,
        leadsResponse: EMPTY_LIST,
        alertsResponse: MOCK_ALERTS,
      });
      await setupAuthToken(page);
      await page.goto('/v2/comment-agent');
      await waitForApp(page);

      // Fill post with a product not in catalog
      await fillSamplePost(page, {
        platform: 'linkedin',
        text: 'Anyone know suppliers of organic shea butter in bulk? Need 500kg for cosmetics production.',
      });

      await page.locator('.analyze-btn').click();
      await expect(page.locator('.result-content')).toBeAttached({ timeout: 15000 });

      // Alert box should appear with sourcing alert text
      await expect(page.locator('.alert-box')).toContainText(/shea butter/i);

      // NO MATCH tag should be visible
      await expect(page.locator('.result-card').getByText(/NO MATCH/i)).toBeAttached();

      // Info note about sourcing
      await expect(page.locator('.alert-note')).toContainText(/sourced and added/i);
    });
  });

  // ── Preview Only ──────────────────────────────────────────────────
  test.describe('Preview Only', () => {
    test('should show analysis preview without generating comment', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page, {
        analyzeOnlyResponse: MOCK_PREVIEW,
        leadsResponse: EMPTY_LIST,
        alertsResponse: EMPTY_LIST,
      });
      await setupAuthToken(page);
      await page.goto('/v2/comment-agent');
      await waitForApp(page);

      await fillSamplePost(page);

      // Click Preview Only using CSS class selector
      await page.locator('.preview-btn').click();

      // Wait for result
      await expect(page.locator('.result-content')).toBeAttached({ timeout: 15000 });

      // Should show analysis
      await expect(page.locator('.analysis-summary')).toContainText(/bulk rice/i);
      await expect(page.locator('.analysis-summary')).toContainText(/Guinea/i);

      // Should display preview mode text (not a full comment)
      await expect(page.locator('.result-content')).toContainText(/Preview mode/i);
    });
  });

  // ── Form Reset ────────────────────────────────────────────────────
  test.describe('Form Reset', () => {
    test('should clear form and result when reset is clicked', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page, {
        analyzePostResponse: MOCK_ANALYSIS,
        leadsResponse: EMPTY_LIST,
        alertsResponse: EMPTY_LIST,
      });
      await setupAuthToken(page);
      await page.goto('/v2/comment-agent');
      await waitForApp(page);

      // Fill form and analyze
      await fillSamplePost(page);
      await page.locator('.analyze-btn').click();
      await expect(page.locator('.result-content')).toBeAttached({ timeout: 15000 });

      // Click Reset
      await page.locator('.reset-btn').click();

      // Form should be cleared
      const textarea = page.locator('#post-text');
      await expect(textarea).toHaveValue('');

      // Result should be empty state again (scoped to result-card to avoid strict mode with history's .empty-state)
      await expect(page.locator('.result-card .empty-state')).toContainText(/Submit a buyer post to analyze/i);
    });
  });

  // ── History ───────────────────────────────────────────────────────
  test.describe('Activity History', () => {
    test('should display leads in the history table', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page, {
        leadsResponse: MOCK_LEADS,
        alertsResponse: MOCK_ALERTS,
      });
      await setupAuthToken(page);
      await page.goto('/v2/comment-agent');
      await waitForApp(page);

      // Wait for history to load
      await page.waitForTimeout(2000);

      // Comments Posted tab should show leads
      const historyTable = page.locator('.history-table');
      await expect(historyTable).toContainText(/bulk rice/i);
      await expect(historyTable).toContainText(/motorcycles CKD/i);
      await expect(historyTable).toContainText(/facebook/i);
      await expect(historyTable).toContainText(/linkedin/i);
    });

    test('should switch to sourcing alerts tab', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page, {
        leadsResponse: MOCK_LEADS,
        alertsResponse: MOCK_ALERTS,
      });
      await setupAuthToken(page);
      await page.goto('/v2/comment-agent');
      await waitForApp(page);

      // Click on the Sourcing Alerts tab label
      await page.locator('.history-tabs label').filter({ hasText: /Sourcing Alerts/i }).click();
      await page.waitForTimeout(1000);

      // Should show alert data
      const historyTable = page.locator('.history-table');
      await expect(historyTable).toContainText(/shea butter/i);
      await expect(historyTable).toContainText(/solar panels/i);
      await expect(historyTable).toContainText(/Ghana/i);
      await expect(historyTable).toContainText(/Kenya/i);
    });

    test('should show empty state when no history', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page);
      await setupAuthToken(page);
      await page.goto('/v2/comment-agent');
      await waitForApp(page);

      await page.waitForTimeout(1000);

      // Empty state in the history section should be visible
      await expect(page.locator('.history-card .empty-state')).toContainText(/No activity yet/i);
    });
  });

  // ── Quick Stats ───────────────────────────────────────────────────
  test.describe('Quick Stats', () => {
    test('should display stats when data is loaded', async ({ page }) => {
      test.setTimeout(60000);
      await setupApiMocks(page, {
        leadsResponse: { errcode: 0, data: { rows: [], total: 10 } },
        alertsResponse: { errcode: 0, data: { rows: [], total: 5 } },
      });
      await setupAuthToken(page);
      await page.goto('/v2/comment-agent');
      await waitForApp(page);

      // Wait for stats to load
      await expect(page.locator('.stats-card')).toBeAttached({ timeout: 10000 });

      // Stats values
      await expect(page.locator('.stats-card')).toContainText(/10/); // leads count
      await expect(page.locator('.stats-card')).toContainText(/5/);  // alerts count
      await expect(page.locator('.stats-card')).toContainText(/Comments/i);
      await expect(page.locator('.stats-card')).toContainText(/Alerts Sent/i);
    });
  });

  // ── Error Handling ────────────────────────────────────────────────
  test.describe('Error Handling', () => {
    test('should show loading state while analyzing', async ({ page }) => {
      test.setTimeout(60000);
      // Use analyzePostDelay to simulate a slow API response
      await setupApiMocks(page, {
        analyzePostResponse: MOCK_ANALYSIS,
        analyzePostDelay: 2000,
        leadsResponse: EMPTY_LIST,
        alertsResponse: EMPTY_LIST,
      });

      await setupAuthToken(page);
      await page.goto('/v2/comment-agent');
      await waitForApp(page);

      await fillSamplePost(page);
      await page.locator('.analyze-btn').click();

      // Loading state should appear before the delayed response arrives
      await expect(page.locator('.loading-state')).toBeAttached({ timeout: 5000 });
      await expect(page.locator('.loading-state')).toContainText(/analyzing/i);
    });
  });
});
