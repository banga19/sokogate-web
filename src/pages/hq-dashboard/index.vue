<template>
  <b-container class="hq-dashboard-page" fluid>
    <div v-title :data-title="'Soko HQ Dashboard'">
      <!-- Header -->
      <b-row class="dashboard-header">
        <b-col cols="12">
          <div class="header-content">
            <div class="header-left">
              <h1 class="header-title">
                <i class="el-icon-s-data"></i>
                Soko HQ Dashboard
              </h1>
              <p class="header-subtitle">
                Monitor comment agent performance, sourcing demand, and agent productivity
              </p>
            </div>
            <div class="header-right">
              <el-tag size="medium" type="danger" effect="dark" class="hq-badge">
                <i class="el-icon-s-marketing"></i> HQ Command Center
              </el-tag>
              <el-button
                size="small"
                type="danger"
                class="export-pdf-btn"
                :loading="pdfLoading"
                :disabled="!data || loading"
                @click="exportPdf"
              >
                <i class="el-icon-download"></i>
                Export PDF
              </el-button>
            </div>
          </div>
        </b-col>
      </b-row>

      <!-- Date Range Filter Bar -->
      <b-row class="filter-row">
        <b-col cols="12">
          <div class="date-filter-bar">
            <span class="filter-label"><i class="el-icon-date"></i> Time Range:</span>
            <div class="filter-presets">
              <b-button
                v-for="preset in datePresets"
                :key="preset.value"
                :variant="activePreset === preset.value ? 'danger' : 'outline-secondary'"
                size="sm"
                class="preset-btn"
                @click="setDatePreset(preset.value)"
              >
                {{ preset.label }}
              </b-button>
            </div>
            <div class="custom-range" v-if="activePreset === 'custom'">
              <el-date-picker
                v-model="customStartDate"
                type="date"
                placeholder="Start date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                size="mini"
                class="date-picker"
                :picker-options="{ disabledDate: (t) => t > new Date() }"
              ></el-date-picker>
              <span class="date-separator">→</span>
              <el-date-picker
                v-model="customEndDate"
                type="date"
                placeholder="End date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                size="mini"
                class="date-picker"
                :picker-options="{ disabledDate: (t) => t > new Date() }"
              ></el-date-picker>
              <b-button
                variant="danger"
                size="sm"
                class="apply-btn"
                :disabled="!customStartDate || !customEndDate"
                @click="applyCustomRange"
              >
                Apply
              </b-button>
            </div>
          </div>
        </b-col>
      </b-row>

      <!-- Auto-Refresh Indicator & Toggle -->
      <b-row class="auto-refresh-row">
        <b-col cols="12">
          <div class="auto-refresh-bar">
            <div class="refresh-indicator">
              <span class="refresh-dot" :class="{ active: autoRefreshEnabled }"></span>
              <span class="refresh-label">
                <template v-if="autoRefreshEnabled">
                  Auto-refreshing every {{ refreshInterval }}s
                  <span class="refresh-countdown" v-if="refreshCountdown > 0">— next in {{ refreshCountdown }}s</span>
                </template>
                <template v-else>
                  Auto-refresh paused
                </template>
              </span>
            </div>
            <span class="last-updated" v-if="lastUpdated">
              <i class="el-icon-time"></i>
              Last updated: {{ lastUpdated }}
            </span>
            <div class="refresh-controls">
              <el-switch
                v-model="autoRefreshEnabled"
                active-color="#67c23a"
                inactive-color="#adb5bd"
                size="mini"
                class="refresh-toggle"
                @change="onAutoRefreshToggle"
              ></el-switch>
              <el-popover
                placement="bottom"
                trigger="click"
                width="180"
                class="refresh-settings"
              >
                <div class="refresh-settings-panel">
                  <div class="settings-title">Refresh Interval</div>
                  <el-radio-group
                    v-model="refreshInterval"
                    size="mini"
                    @change="onRefreshIntervalChange"
                  >
                    <el-radio-button :label="30">30s</el-radio-button>
                    <el-radio-button :label="60">60s</el-radio-button>
                    <el-radio-button :label="120">120s</el-radio-button>
                  </el-radio-group>
                </div>
                <el-button
                  slot="reference"
                  size="mini"
                  class="settings-btn"
                  :class="{ active: autoRefreshEnabled }"
                  circle
                >
                  <i class="el-icon-setting"></i>
                </el-button>
              </el-popover>
            </div>
          </div>
        </b-col>
      </b-row>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <i class="el-icon-loading" style="font-size: 36px; color: #ef2e22;"></i>
        <p class="mt-2">Loading dashboard data...</p>
      </div>

      <!-- Dashboard Content (wrapped for PDF export) -->
      <div v-else-if="data" id="pdfDom">
        <!-- KPI Cards Row + Markets Quick Access -->
        <b-row class="kpi-row">
          <b-col cols="6" md="4" lg="2" class="kpi-col" v-for="kpi in kpis" :key="kpi.label">
            <b-card class="kpi-card" no-body>
              <b-card-body class="kpi-body">
                <div class="kpi-icon" :style="{ background: kpi.color + '18', color: kpi.color }">
                  <i :class="kpi.icon"></i>
                </div>
                <div class="kpi-value">{{ kpi.value }}</div>
                <div class="kpi-label">{{ kpi.label }}</div>
                <div class="kpi-sub" v-if="kpi.sub">{{ kpi.sub }}</div>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>

        <!-- Market Pages Quick Access -->
        <b-row class="mb-4">
          <b-col cols="12">
            <b-card class="chart-card" no-body>
              <b-card-header class="card-header-custom">
                <span><i class="el-icon-connection"></i> Zero-Click SEO Market Pages</span>
                <el-tag size="mini" type="success" effect="dark">8 Live</el-tag>
              </b-card-header>
              <b-card-body>
                <div class="market-grid">
                  <div v-for="m in marketLinks" :key="m.code" class="market-card" @click="goMarket(m.slug)">
                    <div class="market-flag">{{ m.flag }}</div>
                    <div class="market-info">
                      <div class="market-name">{{ m.name }}</div>
                      <div class="market-slug">{{ m.slug }}</div>
                    </div>
                    <div class="market-arrow"><i class="el-icon-arrow-right"></i></div>
                  </div>
                </div>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>

        <!-- Charts Row -->
        <b-row>
          <!-- Daily Trend -->
          <b-col cols="12" lg="8" class="mb-4">
            <b-card class="chart-card" no-body>
              <b-card-header class="card-header-custom">
                <span><i class="el-icon-data-line"></i> Daily Activity (Last 14 Days)</span>
              </b-card-header>
              <b-card-body>
                <div class="chart-container">
                  <div class="bar-chart">
                    <div class="bar-chart-inner">
                      <div
                        v-for="(day, i) in trendData"
                        :key="i"
                        class="bar-group"
                      >
                        <div class="bar-wrapper">
                          <div
                            class="bar bar-leads"
                            :style="{ height: day.leadsPct + '%' }"
                            :title="'Comments: ' + day.leads"
                          ></div>
                          <div
                            class="bar bar-alerts"
                            :style="{ height: day.alertsPct + '%' }"
                            :title="'Alerts: ' + day.alerts"
                          ></div>
                        </div>
                        <div class="bar-label">{{ day.label }}</div>
                      </div>
                    </div>
                    <div class="chart-legend">
                      <span class="legend-item"><span class="legend-dot leads"></span> Comments</span>
                      <span class="legend-item"><span class="legend-dot alerts"></span> Alerts</span>
                    </div>
                  </div>
                </div>
              </b-card-body>
            </b-card>
          </b-col>

          <!-- Top Products -->
          <b-col cols="12" lg="4" class="mb-4">
            <b-card class="chart-card" no-body>
              <b-card-header class="card-header-custom">
                <span><i class="el-icon-goods"></i> Top Products Demanded</span>
              </b-card-header>
              <b-card-body>
                <div v-if="data.topProducts && data.topProducts.length > 0" class="ranked-list">
                  <div
                    v-for="(item, i) in data.topProducts.slice(0, 8)"
                    :key="i"
                    class="ranked-item"
                  >
                    <span class="rank-number">{{ i + 1 }}</span>
                    <span class="rank-name">{{ item.product }}</span>
                    <el-tag size="mini" type="danger" class="rank-count">{{ item.count }}</el-tag>
                  </div>
                </div>
                <div v-else class="empty-chart">
                  <i class="el-icon-document"></i>
                  <p>No sourcing alerts yet</p>
                </div>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>

        <!-- Second Row: Markets + Categories + Urgency -->
        <b-row>
          <!-- Top Markets -->
          <b-col cols="12" md="4" class="mb-4">
            <b-card class="chart-card" no-body>
              <b-card-header class="card-header-custom">
                <span><i class="el-icon-location"></i> Top Markets</span>
              </b-card-header>
              <b-card-body>
                <div v-if="data.topMarkets && data.topMarkets.length > 0" class="ranked-list">
                  <div
                    v-for="(item, i) in data.topMarkets.slice(0, 8)"
                    :key="i"
                    class="ranked-item"
                  >
                    <span class="rank-number">{{ i + 1 }}</span>
                    <span class="rank-name">{{ item.market }}</span>
                    <el-tag size="mini" type="warning" class="rank-count">{{ item.count }}</el-tag>
                  </div>
                </div>
                <div v-else class="empty-chart">
                  <i class="el-icon-location-outline"></i>
                  <p>No market data yet</p>
                </div>
              </b-card-body>
            </b-card>
          </b-col>

          <!-- Product Categories -->
          <b-col cols="12" md="4" class="mb-4">
            <b-card class="chart-card" no-body>
              <b-card-header class="card-header-custom">
                <span><i class="el-icon-sort"></i> Categories</span>
              </b-card-header>
              <b-card-body>
                <div v-if="categoryData.length > 0" class="category-list">
                  <div v-for="(cat, i) in categoryData" :key="i" class="category-item">
                    <div class="category-header">
                      <span class="category-name">{{ cat.category }}</span>
                      <span class="category-count">{{ cat.count }}</span>
                    </div>
                    <div class="category-bar-bg">
                      <div
                        class="category-bar-fill"
                        :style="{ width: cat.pct + '%', background: cat.color }"
                      ></div>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-chart">
                  <i class="el-icon-sort"></i>
                  <p>No category data yet</p>
                </div>
              </b-card-body>
            </b-card>
          </b-col>

          <!-- Urgency Breakdown -->
          <b-col cols="12" md="4" class="mb-4">
            <b-card class="chart-card" no-body>
              <b-card-header class="card-header-custom">
                <span><i class="el-icon-warning"></i> Alert Urgency</span>
              </b-card-header>
              <b-card-body>
                <div v-if="urgencyData.length > 0" class="urgency-list">
                  <div v-for="(urg, i) in urgencyData" :key="i" class="urgency-item">
                    <div class="urgency-header">
                      <el-tag
                        :type="urg.urgency === 'high' ? 'danger' : urg.urgency === 'medium' ? 'warning' : 'info'"
                        size="small"
                        effect="dark"
                      >
                        {{ urg.urgency }}
                      </el-tag>
                      <span class="urgency-count">{{ urg.count }}</span>
                    </div>
                    <div class="category-bar-bg">
                      <div
                        class="category-bar-fill"
                        :style="{
                          width: urg.pct + '%',
                          background: urg.urgency === 'high' ? '#ef2e22' : urg.urgency === 'medium' ? '#e6a23c' : '#909399'
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-chart">
                  <i class="el-icon-warning-outline"></i>
                  <p>No urgency data yet</p>
                </div>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>

        <!-- Agent Activity & Platform Breakdown -->
        <b-row>
          <!-- Agent Leaderboard -->
          <b-col cols="12" md="6" class="mb-4">
            <b-card class="chart-card" no-body>
              <b-card-header class="card-header-custom">
                <span><i class="el-icon-user"></i> Top Agents</span>
              </b-card-header>
              <b-card-body>
                <div v-if="data.agentActivity && data.agentActivity.length > 0" class="agent-table-wrap">
                  <b-table
                    :items="agentRows"
                    :fields="agentFields"
                    striped
                    hover
                    small
                    responsive
                    class="agent-table"
                  >
                    <template #cell(postedRate)="data">
                      <el-progress
                        :percentage="data.value"
                        :status="data.value >= 50 ? 'success' : data.value >= 25 ? 'warning' : 'exception'"
                        :stroke-width="12"
                        :text-inside="true"
                        class="agent-progress"
                      ></el-progress>
                    </template>
                  </b-table>
                </div>
                <div v-else class="empty-chart">
                  <i class="el-icon-user"></i>
                  <p>No agent activity yet</p>
                </div>
              </b-card-body>
            </b-card>
          </b-col>

          <!-- Platform Breakdown -->
          <b-col cols="12" md="6" class="mb-4">
            <b-card class="chart-card" no-body>
              <b-card-header class="card-header-custom">
                <span><i class="el-icon-connection"></i> Platform Breakdown</span>
              </b-card-header>
              <b-card-body>
                <div v-if="platformData.length > 0" class="platform-list">
                  <div v-for="(pf, i) in platformData" :key="i" class="platform-item">
                    <div class="platform-header">
                      <span class="platform-name">{{ pf.platform }}</span>
                      <span class="platform-count">{{ pf.count }} {{ pf.type }}</span>
                    </div>
                    <div class="category-bar-bg">
                      <div
                        class="category-bar-fill"
                        :style="{ width: pf.pct + '%', background: pf.color }"
                      ></div>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-chart">
                  <i class="el-icon-connection"></i>
                  <p>No platform data yet</p>
                </div>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <i class="el-icon-warning" style="font-size: 48px; color: #e6a23c;"></i>
        <p class="mt-2">{{ error }}</p>
        <b-button variant="danger" @click="loadDashboard">Retry</b-button>
      </div>
    </div>
  </b-container>
</template>

<script>
import { GetCommentAgentDashboard } from '@/utils/api'
import { Message } from 'element-ui'

export default {
  name: 'HqDashboard',
  data() {
    return {
      loading: true,
      error: null,
      data: null,
      pdfLoading: false,

      // Auto-refresh state (restored from localStorage when available)
      autoRefreshEnabled: localStorage.getItem('hq_dashboard_autoRefresh') !== 'false',
      autoRefreshInterval: null,
      refreshCountdown: 0,
      refreshCountdownInterval: null,
      refreshInterval: parseInt(localStorage.getItem('hq_dashboard_refreshInterval') || '60', 10),
      lastUpdated: null,

      // Date range filter state
      activePreset: 'last14',
      customStartDate: null,
      customEndDate: null,
      appliedStartDate: null,
      appliedEndDate: null,

      datePresets: [
        { label: 'Last 7 Days', value: 'last7' },
        { label: 'Last 14 Days', value: 'last14' },
        { label: 'Last 30 Days', value: 'last30' },
        { label: 'Last 90 Days', value: 'last90' },
        { label: 'Custom', value: 'custom' },
      ],

      agentFields: [
        { key: 'agent_name', label: 'Agent', formatter: (v, k, item) => v || item.agent_id || '—' },
        { key: 'total', label: 'Posts', thStyle: { width: '60px' } },
        { key: 'posted', label: 'Posted', thStyle: { width: '60px' } },
        { key: 'postedRate', label: 'Rate', thStyle: { width: '120px' } },
      ],
    }
  },
  computed: {
    kpis() {
      if (!this.data) return []
      const o = this.data.overview
      return [
        { label: 'Posts Analyzed', value: o.totalActions, icon: 'el-icon-document', color: '#409eff', sub: 'Total posts processed' },
        { label: 'Comments', value: o.totalLeads, icon: 'el-icon-success', color: '#67c23a', sub: o.postedComments + ' posted' },
        { label: 'Sourcing Alerts', value: o.totalAlerts, icon: 'el-icon-warning', color: '#e6a23c', sub: o.suppliersListed + ' listed' },
        { label: 'Suppliers Listed', value: o.suppliersListed, icon: 'el-icon-shopping-cart', color: '#ef2e22', sub: o.emailsSent + ' emails sent' },
        { label: 'Conversion', value: o.conversionRate + '%', icon: 'el-icon-s-marketing', color: '#8e44ad', sub: o.postedComments + ' converted' },
        { label: 'Pending', value: o.pendingComments, icon: 'el-icon-time', color: '#909399', sub: 'Awaiting agent action' },
      ]
    },
    trendData() {
      if (!this.data || !this.data.dailyTrend) return []

      const { leads, alerts } = this.data.dailyTrend

      // Build a map of date -> { leads, alerts }
      const map = {}
      leads.forEach(d => { map[d.date] = { leads: parseInt(d.count), alerts: 0 } })
      alerts.forEach(d => {
        if (map[d.date]) map[d.date].alerts = parseInt(d.count)
        else map[d.date] = { leads: 0, alerts: parseInt(d.count) }
      })

      // Determine the number of days in the trend
      const dayCount = this.trendDayCount

      // Fill in the days from the trend range
      const result = []
      const now = new Date()
      let maxVal = 1
      for (let i = dayCount - 1; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        const key = d.toISOString().slice(0, 10)
        const day = map[key] || { leads: 0, alerts: 0 }
        maxVal = Math.max(maxVal, day.leads, day.alerts)
        result.push({
          label: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
          leads: day.leads,
          alerts: day.alerts,
        })
      }

      // Calculate percentages for bar heights
      result.forEach(d => {
        d.leadsPct = maxVal > 0 ? (d.leads / maxVal) * 100 : 0
        d.alertsPct = maxVal > 0 ? (d.alerts / maxVal) * 100 : 0
      })

      return result
    },
    categoryData() {
      if (!this.data || !this.data.breakdowns || !this.data.breakdowns.categoryAlerts) return []
      const items = this.data.breakdowns.categoryAlerts
      const maxVal = Math.max(...items.map(c => parseInt(c.count)), 1)
      const colors = ['#409eff', '#67c23a', '#e6a23c', '#ef2e22', '#8e44ad', '#00BCD4', '#FF9800', '#795548', '#607D8B', '#9C27B0']
      return items.map((c, i) => ({
        category: c.category,
        count: parseInt(c.count),
        pct: (parseInt(c.count) / maxVal) * 100,
        color: colors[i % colors.length],
      }))
    },
    urgencyData() {
      if (!this.data || !this.data.breakdowns || !this.data.breakdowns.urgencyBreakdown) return []
      const items = this.data.breakdowns.urgencyBreakdown
      const maxVal = Math.max(...items.map(u => parseInt(u.count)), 1)
      return items.map(u => ({
        urgency: u.urgency,
        count: parseInt(u.count),
        pct: (parseInt(u.count) / maxVal) * 100,
      }))
    },
    platformData() {
      if (!this.data || !this.data.breakdowns) return []
      const leads = this.data.breakdowns.platformLeads || []
      const alerts = this.data.breakdowns.platformAlerts || []
      const platforms = new Set()
      leads.forEach(p => platforms.add(p.platform))
      alerts.forEach(p => platforms.add(p.platform))

      const colors = ['#409eff', '#67c23a', '#e6a23c', '#ef2e22', '#8e44ad']
      const maxVal = Math.max(
        ...leads.map(p => parseInt(p.count)),
        ...alerts.map(p => parseInt(p.count)),
        1
      )

      return Array.from(platforms).map((p, i) => {
        const lCount = parseInt((leads.find(l => l.platform === p) || {}).count || 0)
        const aCount = parseInt((alerts.find(a => a.platform === p) || {}).count || 0)
        return {
          platform: p,
          count: lCount + aCount,
          pct: ((lCount + aCount) / maxVal) * 100,
          color: colors[i % colors.length],
          type: lCount + ' comments, ' + aCount + ' alerts',
        }
      })
    },
    agentRows() {
      if (!this.data || !this.data.agentActivity) return []
      return this.data.agentActivity.map(a => ({
        agent_name: a.agent_name || a.agent_id,
        agent_id: a.agent_id,
        total: parseInt(a.total),
        posted: parseInt(a.posted) || 0,
        postedRate: parseInt(a.total) > 0 ? Math.round((parseInt(a.posted) || 0) / parseInt(a.total) * 100) : 0,
      }))
    },
      trendDayCount() {
        if (this.activePreset === 'last7') return 7
        if (this.activePreset === 'last30') return 30
        if (this.activePreset === 'last90') return 90
        if (this.activePreset === 'custom' && this.customStartDate && this.customEndDate) {
          const diff = new Date(this.customEndDate) - new Date(this.customStartDate)
          return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1, 1)
        }
        return 14 // default
      },
      marketLinks() {
        return [
          { code: 'GN', name: 'Guinea', slug: '/guinea', flag: '🇬🇳' },
          { code: 'SN', name: 'Senegal', slug: '/senegal', flag: '🇸🇳' },
          { code: 'GH', name: 'Ghana', slug: '/ghana', flag: '🇬🇭' },
          { code: 'CI', name: 'Côte d\'Ivoire', slug: '/cote-divoire', flag: '🇨🇮' },
          { code: 'CM', name: 'Cameroon', slug: '/cameroon', flag: '🇨🇲' },
          { code: 'SL', name: 'Sierra Leone', slug: '/sierra-leone', flag: '🇸🇱' },
          { code: 'KE', name: 'Kenya', slug: '/kenya', flag: '🇰🇪' },
          { code: 'ZW', name: 'Zimbabwe', slug: '/zimbabwe', flag: '🇿🇼' },
        ]
      },
    },
  },
  created() {
    this.loadDashboard()
  },
  mounted() {
    this.startAutoRefresh()
  },
  beforeDestroy() {
    this.stopAutoRefresh()
  },
  methods: {
    goMarket(slug) {
      window.open(`https://sokogate.com${slug}`, '_blank')
    },
    buildDateParams() {
      const params = {}
      if (this.activePreset === 'custom' && this.appliedStartDate && this.appliedEndDate) {
        params.startDate = this.appliedStartDate
        params.endDate = this.appliedEndDate
      } else {
        const days = parseInt(this.activePreset.replace('last', ''))
        const start = new Date()
        start.setDate(start.getDate() - days)
        params.startDate = start.toISOString().slice(0, 10)
        const end = new Date()
        params.endDate = end.toISOString().slice(0, 10)
      }
      return params
    },
    setDatePreset(value) {
      this.activePreset = value
      if (value !== 'custom') {
        this.loadDashboard()
      }
    },
    applyCustomRange() {
      if (this.customStartDate && this.customEndDate) {
        this.appliedStartDate = this.customStartDate
        this.appliedEndDate = this.customEndDate
        this.loadDashboard()
      }
    },
    async loadDashboard(silent = false) {
      if (!silent) {
        this.loading = true
      }
      this.error = null
      try {
        const params = this.buildDateParams()
        const res = await GetCommentAgentDashboard(params)
        this.data = res.data
        this.lastUpdated = this.formatTimestamp(new Date())
        this.refreshCountdown = this.refreshInterval
      } catch (err) {
        this.error = err.errmsg || 'Failed to load dashboard data'
        if (!silent) Message.error(this.error)
        // Pause auto-refresh on error so the user sees the error state
        if (silent) {
          this.stopAutoRefresh()
        }
      } finally {
        if (!silent) {
          this.loading = false
        }
      }
    },
    async exportPdf() {
      this.pdfLoading = true
      try {
        await this.getPdf('Soko-HQ-Dashboard-Report')
      } catch (err) {
        console.error('PDF export failed:', err)
        this.$message.error('Failed to export PDF')
      } finally {
        this.pdfLoading = false
      }
    },

    // ── Auto-refresh ──

    startAutoRefresh() {
      this.stopAutoRefresh()
      if (!this.autoRefreshEnabled) return

      const ms = this.refreshInterval * 1000

      // Main data refresh at the configured interval
      this.autoRefreshInterval = setInterval(() => {
        // Don't auto-refresh while loading, exporting PDF, or showing an error
        if (this.loading || this.pdfLoading || this.error) return
        this.loadDashboard(true) // silent reload
      }, ms)

      // Countdown tick every second for visual display
      this.refreshCountdown = this.refreshInterval
      this.refreshCountdownInterval = setInterval(() => {
        if (this.refreshCountdown <= 1) {
          this.refreshCountdown = this.refreshInterval
        } else {
          this.refreshCountdown--
        }
      }, 1000)
    },

    stopAutoRefresh() {
      if (this.autoRefreshInterval) {
        clearInterval(this.autoRefreshInterval)
        this.autoRefreshInterval = null
      }
      if (this.refreshCountdownInterval) {
        clearInterval(this.refreshCountdownInterval)
        this.refreshCountdownInterval = null
      }
    },

    persistAutoRefreshState() {
      try {
        localStorage.setItem('hq_dashboard_autoRefresh', this.autoRefreshEnabled)
        localStorage.setItem('hq_dashboard_refreshInterval', String(this.refreshInterval))
      } catch (e) {
        // localStorage may not be available (private browsing, etc.)
      }
    },

    onAutoRefreshToggle(val) {
      if (val) {
        this.refreshCountdown = this.refreshInterval
        this.startAutoRefresh()
        // Immediately refresh when toggling on
        if (!this.loading && !this.error) {
          this.loadDashboard(true)
        }
      } else {
        this.stopAutoRefresh()
        this.refreshCountdown = 0
      }
      this.persistAutoRefreshState()
    },

    onRefreshIntervalChange(val) {
      this.persistAutoRefreshState()
      if (this.autoRefreshEnabled) {
        this.startAutoRefresh()
      }
    },

    formatTimestamp(date) {
      const d = new Date(date)
      return d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    },
  },
}
</script>

<style lang="scss" scoped>
.hq-dashboard-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;
  background: #f5f6fa;

  // ── Header ──
  .dashboard-header {
    margin-bottom: 24px;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;

      .header-title {
        font-size: 24px;
        font-weight: 700;
        color: #1a1a2e;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;

        i {
          color: #ef2e22;
          font-size: 28px;
        }
      }

      .header-subtitle {
        color: #6c757d;
        font-size: 14px;
        margin: 4px 0 0 0;
      }

      .hq-badge {
        font-size: 13px;
        padding: 6px 14px;
        border-radius: 20px;
      }

      .export-pdf-btn {
        font-size: 12px;
        padding: 6px 14px;
        border-radius: 8px;
        font-weight: 500;
        margin-left: 8px;

        i {
          margin-right: 4px;
        }

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 46, 34, 0.3);
        }
      }
    }
  }

  // ── Card Header ──
  .card-header-custom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-bottom: 1px solid #eee;
    padding: 12px 20px;
    font-weight: 600;
    font-size: 15px;
    color: #1a1a2e;

    i {
      margin-right: 6px;
      color: #ef2e22;
    }
  }

  // ── Loading ──
  .loading-state {
    text-align: center;
    padding: 80px 20px;
    color: #6c757d;
  }

  // ── Error ──
  .error-state {
    text-align: center;
    padding: 80px 20px;
    color: #6c757d;

    p {
      font-size: 16px;
      margin-bottom: 16px;
    }
  }

  // ── KPI Cards ──
  .kpi-row {
    margin-bottom: 24px;

    .kpi-col {
      margin-bottom: 12px;
    }

    .kpi-card {
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      border: none;
      height: 100%;

      .kpi-body {
        text-align: center;
        padding: 20px 12px;
      }

      .kpi-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        margin-bottom: 10px;
      }

      .kpi-value {
        font-size: 28px;
        font-weight: 700;
        color: #1a1a2e;
        line-height: 1.2;
      }

      .kpi-label {
        font-size: 12px;
        color: #6c757d;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-top: 4px;
      }

      .kpi-sub {
        font-size: 11px;
        color: #adb5bd;
        margin-top: 2px;
      }
    }
  }

  // ── Chart Cards ──
  .chart-card {
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    border: none;
    height: 100%;
  }

  // ── Bar Chart ──
  .chart-container {
    min-height: 200px;

    .bar-chart {
      .bar-chart-inner {
        display: flex;
        align-items: flex-end;
        height: 200px;
        gap: 4px;
        padding: 0 8px;

        .bar-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;

          .bar-wrapper {
            width: 100%;
            height: 180px;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            gap: 2px;

            .bar {
              width: 40%;
              min-height: 2px;
              border-radius: 3px 3px 0 0;
              transition: height 0.3s ease;

              &.bar-leads {
                background: linear-gradient(180deg, #67c23a, #85ce61);
              }

              &.bar-alerts {
                background: linear-gradient(180deg, #e6a23c, #f0c78a);
              }
            }
          }

          .bar-label {
            font-size: 9px;
            color: #6c757d;
            margin-top: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
            text-align: center;
          }
        }
      }

      .chart-legend {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 12px;

        .legend-item {
          font-size: 12px;
          color: #6c757d;
          display: flex;
          align-items: center;
          gap: 4px;

          .legend-dot {
            width: 10px;
            height: 10px;
            border-radius: 2px;
            display: inline-block;

            &.leads { background: #67c23a; }
            &.alerts { background: #e6a23c; }
          }
        }
      }
    }
  }

  // ── Ranked Lists (Top Products, Markets) ──
  .ranked-list {
    .ranked-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child { border-bottom: none; }

      .rank-number {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        background: #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 600;
        color: #6c757d;
        flex-shrink: 0;
      }

      .rank-name {
        flex: 1;
        font-size: 13px;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .rank-count {
        flex-shrink: 0;
      }
    }
  }

  // ── Category Bars ──
  .category-list,
  .urgency-list,
  .platform-list {
    .category-item,
    .urgency-item,
    .platform-item {
      margin-bottom: 12px;

      .category-header,
      .urgency-header,
      .platform-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;

        .category-name,
        .platform-name {
          font-size: 13px;
          color: #333;
          font-weight: 500;
          text-transform: capitalize;
        }

        .category-count,
        .urgency-count,
        .platform-count {
          font-size: 12px;
          color: #6c757d;
          font-weight: 600;
        }
      }

      .category-bar-bg {
        height: 8px;
        background: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;

        .category-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
      }
    }
  }

  // ── Agent Table ──
  .agent-table-wrap {
    .agent-table {
      font-size: 13px;

      th {
        background: #f8f9fa;
        color: #6c757d;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 11px;
        letter-spacing: 0.5px;
      }

      td {
        vertical-align: middle;
      }
    }

    .agent-progress {
      margin: 0;
    }
  }

  // ── Empty Chart ──
  .empty-chart {
    text-align: center;
    padding: 32px 16px;
    color: #adb5bd;

    i {
      font-size: 36px;
    }

    p {
      font-size: 13px;
      margin: 8px 0 0;
    }
  }

  // ── Auto-Refresh Bar ──
  .auto-refresh-row {
    margin-bottom: 16px;

    .auto-refresh-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
      background: #fff;
      border-radius: 10px;
      padding: 8px 16px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
      border: 1px solid #f0f0f0;

      .refresh-indicator {
        display: flex;
        align-items: center;
        gap: 8px;

        .refresh-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #adb5bd;
          transition: all 0.3s;

          &.active {
            background: #67c23a;
            box-shadow: 0 0 6px rgba(103, 194, 58, 0.6);
            animation: pulse-dot 2s ease-in-out infinite;
          }
        }

        .refresh-label {
          font-size: 12px;
          color: #6c757d;

          .refresh-countdown {
            color: #adb5bd;
            font-size: 11px;
          }
        }
      }

      .last-updated {
        font-size: 11px;
        color: #adb5bd;
        display: flex;
        align-items: center;
        gap: 4px;

        i {
          font-size: 13px;
        }
      }

      .refresh-controls {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .refresh-toggle {
        flex-shrink: 0;
      }

      .settings-btn {
        width: 24px;
        height: 24px;
        padding: 0;
        font-size: 13px;
        border-color: #e0e0e0;
        background: #fafbfd;
        color: #adb5bd;
        transition: all 0.2s;

        &.active {
          color: #67c23a;
          border-color: #67c23a;
        }

        &:hover {
          color: #ef2e22;
          border-color: #ef2e22;
        }

        i {
          font-size: 13px;
        }
      }

      .refresh-settings-panel {
        .settings-title {
          font-size: 13px;
          font-weight: 600;
          color: #1a1a2e;
          margin-bottom: 10px;
        }

        .el-radio-group {
          display: flex;
          width: 100%;

          .el-radio-button {
            flex: 1;

            .el-radio-button__inner {
              font-size: 12px;
              padding: 6px 8px;
              border-radius: 0;
            }

            &:first-child .el-radio-button__inner {
              border-radius: 4px 0 0 4px;
            }

            &:last-child .el-radio-button__inner {
              border-radius: 0 4px 4px 0;
            }
          }
        }
      }
    }
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.3); }
  }

  // ── Date Range Filter Bar ──
  .filter-row {
    margin-bottom: 20px;

    .date-filter-bar {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      background: #fff;
      border-radius: 12px;
      padding: 12px 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border: 1px solid #f0f0f0;

      .filter-label {
        font-size: 13px;
        font-weight: 600;
        color: #1a1a2e;
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;

        i {
          color: #ef2e22;
        }
      }

      .filter-presets {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;

        .preset-btn {
          font-size: 12px;
          padding: 3px 12px;
          border-radius: 16px;
          font-weight: 500;
          transition: all 0.2s;

          &.btn-danger {
            box-shadow: 0 2px 6px rgba(239, 46, 34, 0.2);
          }
        }
      }

      .custom-range {
        display: flex;
        align-items: center;
        gap: 6px;

        .date-picker {
          width: 130px;

          ::v-deep .el-input__inner {
            height: 30px;
            font-size: 12px;
            border-radius: 6px;
          }
        }

        .date-separator {
          color: #adb5bd;
          font-size: 14px;
        }

        .apply-btn {
          font-size: 12px;
          padding: 3px 14px;
          border-radius: 16px;
        }
      }
    }
  }

  // ── Market Grid ──
  .market-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;

    .market-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      background: #f8f9fa;
      border-radius: 10px;
      border: 1px solid #f0f0f0;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: #ef2e22;
        background: #fff;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(239, 46, 34, 0.1);
      }

      .market-flag {
        font-size: 28px;
        line-height: 1;
      }

      .market-info {
        flex: 1;
        min-width: 0;

        .market-name {
          font-size: 13px;
          font-weight: 600;
          color: #1a1a2e;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .market-slug {
          font-size: 12px;
          color: #6c757d;
          font-family: monospace;
        }
      }

      .market-arrow {
        color: #adb5bd;
        font-size: 14px;
      }
    }
  }

  // ── Responsive ──
  @media (max-width: 768px) {
    padding: 12px;

    .header-content {
      flex-direction: column;
      align-items: flex-start !important;
    }

    .kpi-card .kpi-value {
      font-size: 22px;
    }
  }
}
</style>

<!--
  Non-scoped styles for the refresh settings popover.
  Element UI's el-popover appends content to <body>, bypassing Vue's scoped CSS.
-->
<style lang="scss">
.refresh-settings-panel {
  .settings-title {
    font-size: 13px;
    font-weight: 600;
    color: #1a1a2e;
    margin-bottom: 10px;
  }

  .el-radio-group {
    display: flex;
    width: 100%;

    .el-radio-button {
      flex: 1;

      .el-radio-button__inner {
        font-size: 12px;
        padding: 6px 8px;
        border-radius: 0;
      }

      &:first-child .el-radio-button__inner {
        border-radius: 4px 0 0 4px;
      }

      &:last-child .el-radio-button__inner {
        border-radius: 0 4px 4px 0;
      }
    }
  }
}
</style>
