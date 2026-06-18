<template>
  <b-container class="comment-agent-page" fluid>
    <div v-title :data-title="'Soko Comment Agent'">
      <!-- Header -->
      <b-row class="agent-header">
        <b-col cols="12">
          <div class="header-content">
            <div class="header-left">
              <h1 class="header-title">
                <i class="el-icon-connection"></i>
                Soko Comment Agent
              </h1>
              <p class="header-subtitle">
                Analyze buyer posts, generate smart comments & send sourcing alerts — powered by Soko AI
              </p>
            </div>
            <div class="header-right">
              <el-tag size="medium" type="danger" effect="dark" class="agent-badge">
                <i class="el-icon-user"></i> Agent: {{ agentId || 'Not set' }}
              </el-tag>
            </div>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <!-- Left Column — Input & Analyze -->
        <b-col cols="12" lg="7">
          <b-card class="input-card" no-body>
            <b-card-header class="card-header-custom">
              <span><i class="el-icon-edit-outline"></i> New Buyer Post</span>
              <el-switch
                v-model="previewMode"
                active-text="Preview"
                inactive-text="Full"
                class="mode-switch"
              >
              </el-switch>
            </b-card-header>
            <b-card-body>
              <!-- Platform Selector -->
              <b-form-group label="Platform" label-for="platform-select">
                <el-select
                  v-model="form.platform"
                  placeholder="Select platform"
                  class="platform-select"
                >
                  <el-option label="Facebook" value="facebook">
                    <span><i class="el-icon-s-promotion"></i> Facebook</span>
                  </el-option>
                  <el-option label="LinkedIn" value="linkedin">
                    <span><i class="el-icon-s-custom"></i> LinkedIn</span>
                  </el-option>
                  <el-option label="WhatsApp" value="whatsapp">
                    <span><i class="el-icon-chat-dot-square"></i> WhatsApp</span>
                  </el-option>
                </el-select>
              </b-form-group>

              <!-- Post URL -->
              <b-form-group label="Post URL (optional)" label-for="post-url">
                <b-form-input
                  id="post-url"
                  v-model="form.postUrl"
                  placeholder="https://facebook.com/groups/.../posts/..."
                  class="input-field"
                ></b-form-input>
              </b-form-group>

              <!-- Post Text -->
              <b-form-group
                label="Paste the buyer's post"
                label-for="post-text"
                :description="`${form.postText.length} / 2000 characters`"
              >
                <b-form-textarea
                  id="post-text"
                  v-model="form.postText"
                  placeholder="Paste the buyer's social media post here...&#10;&#10;Example: Je cherche des fournisseurs de riz en vrac pour ma boutique à Conakry."
                  rows="5"
                  maxlength="2000"
                  class="post-input"
                  :state="form.postText.length > 0 ? null : false"
                ></b-form-textarea>
              </b-form-group>

              <!-- Agent Note -->
              <b-form-group label="Agent Note (optional)" label-for="agent-note">
                <b-form-input
                  id="agent-note"
                  v-model="form.agentNote"
                  placeholder="Any extra context about this buyer..."
                  class="input-field"
                ></b-form-input>
              </b-form-group>

              <!-- Actions -->
              <div class="action-bar">
                <b-button
                  variant="danger"
                  size="lg"
                  :disabled="!canAnalyze || analyzing"
                  @click="analyzePost"
                  class="analyze-btn"
                >                  <i
                    :class="analyzing ? 'el-icon-loading' : 'el-icon-cpu'"></i>
                  {{ analyzing ? 'Analyzing...' : 'Analyze & Respond' }}
                </b-button>
                <b-button
                  variant="outline-secondary"
                  size="lg"
                  :disabled="!canAnalyze || analyzing"
                  @click="analyzeOnly"
                  class="preview-btn"
                >
                  <i class="el-icon-view"></i> Preview Only
                </b-button>
                <b-button
                  variant="outline-info"
                  size="lg"
                  @click="resetForm"
                  class="reset-btn"
                >
                  <i class="el-icon-refresh"></i> Reset
                </b-button>
              </div>
            </b-card-body>
          </b-card>

          <!-- Quick Stats -->
          <b-card class="stats-card" no-body v-if="statsLoaded">
            <b-card-body class="stats-body">
              <b-row>
                <b-col cols="4" class="stat-item">
                  <div class="stat-value">{{ stats.leads }}</div>
                  <div class="stat-label">Comments</div>
                </b-col>
                <b-col cols="4" class="stat-item">
                  <div class="stat-value">{{ stats.alerts }}</div>
                  <div class="stat-label">Alerts Sent</div>
                </b-col>
                <b-col cols="4" class="stat-item">
                  <div class="stat-value">{{ stats.conversion }}%</div>
                  <div class="stat-label">Conversion</div>
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
        </b-col>

        <!-- Right Column — Results -->
        <b-col cols="12" lg="5">
          <!-- Result / Analysis Panel -->
          <b-card class="result-card" no-body>
            <b-card-header class="card-header-custom">
              <span><i class="el-icon-data-analysis"></i> Analysis Result</span>
              <el-tag
                v-if="result"
                :type="result.action === 'comment' ? 'success' : 'warning'"
                size="small"
                effect="dark"
              >
                {{ result.action === 'comment' ? 'MATCH FOUND' : 'NO MATCH' }}
              </el-tag>
            </b-card-header>
            <b-card-body>
              <!-- Empty State -->
              <div v-if="!result && !analyzing" class="empty-state">
                <i class="el-icon-chat-dot-square empty-icon"></i>
                <p class="empty-text">Submit a buyer post to analyze</p>
                <p class="empty-hint">The AI will detect trade intent, product, market & urgency</p>
              </div>

              <!-- Loading State -->
              <div v-if="analyzing" class="loading-state">
                <el-progress
                  type="circle"
                  :percentage="80"
                  :stroke-width="6"
                  status="active"
                  class="analysis-progress"
                ></el-progress>
                <p class="loading-text">Soko AI is analyzing the post...</p>
                <div class="loading-steps">
                  <p><i class="el-icon-check" v-if="step >= 1"></i><i class="el-icon-loading" v-else></i> Classifying intent & product</p>
                  <p><i class="el-icon-check" v-if="step >= 2"></i><i class="el-icon-loading" v-else></i> Checking supplier catalog</p>
                  <p><i class="el-icon-check" v-if="step >= 3"></i><i class="el-icon-loading" v-else></i> Generating response</p>
                </div>
              </div>

              <!-- Analysis Result -->
              <div v-if="result && !analyzing" class="result-content">
                <!-- Analysis Summary -->
                <div class="analysis-summary">
                  <b-row>
                    <b-col cols="6" class="summary-field">
                      <label>Intent</label>
                      <el-tag :type="intentTag(result.analysis.intent)" size="small">
                        {{ result.analysis.intent }}
                      </el-tag>
                    </b-col>
                    <b-col cols="6" class="summary-field">
                      <label>Product</label>
                      <span class="field-value">{{ result.analysis.product }}</span>
                    </b-col>
                    <b-col cols="6" class="summary-field">
                      <label>Market</label>
                      <span class="field-value">{{ result.analysis.market }}</span>
                    </b-col>
                    <b-col cols="6" class="summary-field">
                      <label>Urgency</label>
                      <el-tag :type="urgencyTag(result.analysis.urgency)" size="small">
                        {{ result.analysis.urgency }}
                      </el-tag>
                    </b-col>
                    <b-col cols="6" class="summary-field">
                      <label>Category</label>
                      <span class="field-value">{{ result.analysis.category }}</span>
                    </b-col>
                    <b-col cols="6" class="summary-field">
                      <label>Buyer</label>
                      <span class="field-value">{{ result.analysis.buyer_name }}</span>
                    </b-col>
                  </b-row>
                </div>

                <!-- Comment Result (Match) -->
                <div v-if="result.action === 'comment'" class="result-comment">
                  <div class="result-label">
                    <i class="el-icon-success"></i>
                    <span>AI-Generated Comment</span>
                  </div>
                  <div class="comment-bubble">
                    <p>{{ result.comment }}</p>
                  </div>
                  <div class="comment-actions">
                    <b-button
                      variant="success"
                      size="sm"
                      @click="copyText(result.comment)"
                    >
                      <i class="el-icon-document-copy"></i> Copy Comment
                    </b-button>
                    <b-button
                      variant="outline-success"
                      size="sm"
                      @click="confirmPosted(result.leadId)"
                    >
                      <i class="el-icon-check"></i> Mark as Posted
                    </b-button>
                  </div>
                </div>

                <!-- Alert Result (No Match) -->
                <div v-if="result.action === 'alert'" class="result-alert">
                  <div class="result-label alert-label">
                    <i class="el-icon-warning"></i>
                    <span>Sourcing Alert Sent to info@sokogate.com</span>
                  </div>
                  <div class="alert-box">
                    <p>{{ result.alert }}</p>
                  </div>
                  <div class="alert-note">
                    <i class="el-icon-info"></i>
                    This product will be sourced and added to the catalog.
                  </div>
                </div>
              </div>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>

      <!-- History Section -->
      <b-row class="history-section">
        <b-col cols="12">
          <b-card class="history-card" no-body>
            <b-card-header class="card-header-custom">
              <span><i class="el-icon-tickets"></i> Activity History</span>
              <el-radio-group
                v-model="historyTab"
                size="small"
                class="history-tabs"
              >
                <el-radio-button label="leads">Comments Posted</el-radio-button>
                <el-radio-button label="alerts">Sourcing Alerts</el-radio-button>
              </el-radio-group>
            </b-card-header>
            <b-card-body>
              <!-- Loading -->
              <div v-if="historyLoading" class="text-center py-4">
                <i class="el-icon-loading" style="font-size: 24px; color: #ef2e22;"></i>
                <p class="mt-2">Loading history...</p>
              </div>

              <!-- Empty State -->
              <div v-else-if="historyItems.length === 0" class="empty-state small">
                <i class="el-icon-document-empty"></i>
                <p>No activity yet. Start by analyzing a post above.</p>
              </div>

              <!-- Leads Table -->
              <b-table
                v-else-if="historyTab === 'leads'"
                :items="historyItems"
                :fields="leadFields"
                striped
                hover
                small
                responsive
                class="history-table"
              >
                <template #cell(posted)="data">
                  <el-tag
                    :type="data.value ? 'success' : 'info'"
                    size="mini"
                    effect="plain"
                  >
                    {{ data.value ? 'Posted' : 'Pending' }}
                  </el-tag>
                </template>
                <template #cell(created_at)="data">
                  {{ formatDate(data.value) }}
                </template>
                <template #cell(comment_text)="data">
                  <span class="text-truncate d-inline-block" style="max-width: 250px;">
                    {{ data.value }}
                  </span>
                </template>
              </b-table>

              <!-- Alerts Table -->
              <b-table
                v-else-if="historyTab === 'alerts'"
                :items="historyItems"
                :fields="alertFields"
                striped
                hover
                small
                responsive
                class="history-table"
              >
                <template #cell(urgency)="data">
                  <el-tag
                    :type="urgencyTag(data.value)"
                    size="mini"
                    effect="dark"
                  >
                    {{ data.value }}
                  </el-tag>
                </template>
                <template #cell(email_sent)="data">
                  <el-tag
                    :type="data.value ? 'success' : 'danger'"
                    size="mini"
                    effect="plain"
                  >
                    {{ data.value ? 'Sent' : 'Failed' }}
                  </el-tag>
                </template>
                <template #cell(supplier_listed)="data">
                  <el-tag
                    :type="data.value ? 'success' : 'info'"
                    size="mini"
                    effect="plain"
                  >
                    {{ data.value ? 'Listed' : 'Pending' }}
                  </el-tag>
                </template>
                <template #cell(created_at)="data">
                  {{ formatDate(data.value) }}
                </template>
              </b-table>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import {
  AnalyzeCommentAgentPost,
  AnalyzeCommentAgentOnly,
  GetCommentLeads,
  GetSourcingAlerts,
  ConfirmCommentPosted,
} from '@/utils/api'
import { Message } from 'element-ui'

export default {
  name: 'CommentAgent',
  components: {},
  data() {
    return {
      // Form
      form: {
        platform: 'facebook',
        postText: '',
        postUrl: '',
        agentNote: '',
      },
      previewMode: false,

      // State
      analyzing: false,
      step: 0,
      result: null,
      statsLoaded: false,
      stats: { leads: 0, alerts: 0, conversion: 0 },

      // History
      historyTab: 'leads',
      historyLoading: false,
      historyItems: [],
      leadFields: [
        { key: 'platform', label: 'Platform', thStyle: { width: '90px' } },
        { key: 'product', label: 'Product', formatter: (v, key, item) => item.analysis?.product || '—' },
        { key: 'comment_text', label: 'Comment' },
        { key: 'posted', label: 'Status', thStyle: { width: '90px' } },
        { key: 'created_at', label: 'Date', thStyle: { width: '140px' } },
      ],
      alertFields: [
        { key: 'product', label: 'Product' },
        { key: 'market', label: 'Market' },
        { key: 'urgency', label: 'Urgency', thStyle: { width: '90px' } },
        { key: 'email_sent', label: 'Email', thStyle: { width: '80px' } },
        { key: 'supplier_listed', label: 'Supplier', thStyle: { width: '90px' } },
        { key: 'created_at', label: 'Date', thStyle: { width: '140px' } },
      ],
      stepInterval: null,
    }
  },
  computed: {
    isLoggedIn() {
      return Boolean(this.$store.state.user)
    },
    agentId() {
      const user = this.$store.state.user
      return user?.email || user?.phone || 'Not logged in'
    },
    agentName() {
      const user = this.$store.state.user
      return user?.name || user?.email || this.agentId
    },
    canAnalyze() {
      return this.form.platform && this.form.postText.trim().length > 5
    },
  },
  created() {
    this.loadStats()
    this.loadHistory()
  },
  beforeDestroy() {
    if (this.stepInterval) clearInterval(this.stepInterval)
  },
  methods: {
    goToLogin() {
      const next = JSON.stringify({ fullPath: this.$route.fullPath, name: this.$route.name, path: this.$route.path, query: this.$route.query })
      localStorage.setItem('backToRouter', next)
      this.$router.replace({ path: '/v2/login' }).catch((err) => err)
    },
    // ── Core Actions ──

    async analyzePost() {
      if (!this.canAnalyze) return
      this.analyzing = true
      this.result = null
      this.step = 0
      this.startStepTimer()

      try {
        const res = await AnalyzeCommentAgentPost({
          postText: this.form.postText,
          platform: this.form.platform,
          agentId: this.agentId,
          agentName: this.agentName,
          postUrl: this.form.postUrl || undefined,
          agentNote: this.form.agentNote || undefined,
        })

        this.step = 3
        this.result = res.data

        if (res.data.action === 'comment') {
          Message.success('Comment generated successfully! Copy it and post on the buyer\'s ad.')
        } else {
          Message.warning('Product not in catalog. Sourcing alert sent to HQ.')
        }

        this.loadStats()
        this.loadHistory()
      } catch (err) {
        Message.error(err.errmsg || 'Analysis failed. Please try again.')
        this.result = null
      } finally {
        this.analyzing = false
        if (this.stepInterval) clearInterval(this.stepInterval)
      }
    },

    async analyzeOnly() {
      if (!this.canAnalyze) return
      this.analyzing = true
      this.result = null
      this.step = 0
      this.startStepTimer()

      try {
        const res = await AnalyzeCommentAgentOnly({
          postText: this.form.postText,
          platform: this.form.platform,
        })

        this.step = 2
        this.result = {
          action: res.data.analysis.sokogate_match ? 'comment' : 'alert',
          analysis: res.data.analysis,
          comment: '— Preview mode — submit full analysis to generate comment',
          alert: '— Preview mode — submit full analysis to generate alert',
          match: res.data.match,
        }

        Message.info('Preview analysis complete.')
      } catch (err) {
        Message.error(err.errmsg || 'Preview failed.')
      } finally {
        this.analyzing = false
        if (this.stepInterval) clearInterval(this.stepInterval)
      }
    },

    async confirmPosted(leadId) {
      try {
        await ConfirmCommentPosted({ id: leadId })
        Message.success('Marked as posted!')
        this.loadHistory()
        this.loadStats()
      } catch (err) {
        Message.error('Failed to confirm.')
      }
    },

    resetForm() {
      this.form = {
        platform: 'facebook',
        postText: '',
        postUrl: '',
        agentNote: '',
      }
      this.result = null
    },

    // ── Data Loading ──

    async loadStats() {
      try {
        const [leadsRes, alertsRes] = await Promise.all([
          GetCommentLeads({ page: 1, pageSize: 1 }),
          GetSourcingAlerts({ page: 1, pageSize: 1 }),
        ])

        const totalLeads = leadsRes.data?.total || 0
        const totalAlerts = alertsRes.data?.total || 0
        const conversion = totalLeads > 0 ? Math.round((totalLeads / (totalLeads + totalAlerts)) * 100) : 0

        this.stats = {
          leads: totalLeads,
          alerts: totalAlerts,
          conversion,
        }
        this.statsLoaded = true
      } catch {
        // Stats are non-critical
      }
    },

    async loadHistory() {
      this.historyLoading = true
      try {
        if (this.historyTab === 'leads') {
          const res = await GetCommentLeads({ page: 1, pageSize: 20 })
          this.historyItems = (res.data?.rows || []).map(item => ({
            ...item,
            product: item.analysis?.product || '—',
          }))
        } else {
          const res = await GetSourcingAlerts({ page: 1, pageSize: 20 })
          this.historyItems = res.data?.rows || []
        }
      } catch {
        this.historyItems = []
      } finally {
        this.historyLoading = false
      }
    },

    // ── Helpers ──

    copyText(text) {
      navigator.clipboard.writeText(text).then(() => {
        Message.success('Copied to clipboard!')
      }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea')
        ta.value = text
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        Message.success('Copied!')
      })
    },

    formatDate(dateStr) {
      if (!dateStr) return '—'
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    intentTag(intent) {
      const map = { buying: 'success', selling: 'warning', inquiry: 'primary', irrelevant: 'info' }
      return map[intent] || 'info'
    },

    urgencyTag(urgency) {
      const map = { high: 'danger', medium: 'warning', low: 'info' }
      return map[urgency] || 'info'
    },

    startStepTimer() {
      this.step = 0
      this.stepInterval = setInterval(() => {
        if (this.step < 3) this.step++
      }, 1200)
    },
  },
  watch: {
    historyTab() {
      this.loadHistory()
    },
  },
}
</script>

<style lang="scss" scoped>
.comment-agent-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;
  background: #f5f6fa;

  // ── Header ─
  .agent-header {
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

      .agent-badge {
        font-size: 13px;
        padding: 6px 14px;
        border-radius: 20px;
      }
    }
  }

  // ── Shared Card Styles ─
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

  // ── Input Card ─
  .input-card {
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    border: none;
    margin-bottom: 20px;

    .platform-select {
      width: 100%;
    }

    .input-field {
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      &:focus {
        border-color: #ef2e22;
        box-shadow: 0 0 0 2px rgba(239, 46, 34, 0.1);
      }
    }

    .post-input {
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      resize: vertical;
      font-size: 14px;
      line-height: 1.6;
      &:focus {
        border-color: #ef2e22;
        box-shadow: 0 0 0 2px rgba(239, 46, 34, 0.1);
      }
    }

    .action-bar {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 8px;

      .analyze-btn {
        flex: 1;
        min-width: 180px;
        border-radius: 8px;
        font-weight: 600;
        background: linear-gradient(135deg, #ef2e22, #d41e1e);
        border: none;
        transition: transform 0.15s, box-shadow 0.15s;
        &:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 46, 34, 0.3);
        }
      }

      .preview-btn,
      .reset-btn {
        border-radius: 8px;
        font-weight: 500;
      }
    }

    .mode-switch {
      margin-left: 12px;
    }
  }

  // ── Stats Card ─
  .stats-card {
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    border: none;
    margin-bottom: 20px;

    .stats-body {
      padding: 16px 20px;
    }

    .stat-item {
      text-align: center;
      border-right: 1px solid #eee;
      &:last-child { border-right: none; }

      .stat-value {
        font-size: 28px;
        font-weight: 700;
        color: #ef2e22;
        line-height: 1.2;
      }

      .stat-label {
        font-size: 12px;
        color: #6c757d;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-top: 2px;
      }
    }
  }

  // ── Result Card ─
  .result-card {
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    border: none;
    min-height: 400px;

    .empty-state {
      text-align: center;
      padding: 48px 20px;

      .empty-icon {
        font-size: 56px;
        color: #d0d0d0;
      }

      .empty-text {
        font-size: 16px;
        color: #6c757d;
        margin: 12px 0 4px;
        font-weight: 500;
      }

      .empty-hint {
        font-size: 13px;
        color: #adb5bd;
        margin: 0;
      }

      &.small {
        padding: 24px;
        i { font-size: 36px; }
        p { font-size: 14px; }
      }
    }

    .loading-state {
      text-align: center;
      padding: 32px 20px;

      .analysis-progress {
        margin: 0 auto 16px;
      }

      .loading-text {
        font-size: 15px;
        color: #1a1a2e;
        font-weight: 500;
        margin-bottom: 16px;
      }

      .loading-steps {
        text-align: left;
        max-width: 280px;
        margin: 0 auto;

        p {
          font-size: 13px;
          color: #6c757d;
          margin: 6px 0;
          display: flex;
          align-items: center;
          gap: 8px;

          i { font-size: 14px; }
          .el-icon-check { color: #67c23a; }
          .el-icon-loading { color: #ef2e22; }
        }
      }
    }

    .result-content {
      .analysis-summary {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;

        .summary-field {
          margin-bottom: 8px;

          label {
            display: block;
            font-size: 11px;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
          }

          .field-value {
            font-size: 14px;
            color: #1a1a2e;
            font-weight: 500;
          }
        }
      }

      .result-label {
        display: flex;
        align-items: center;
        gap: 6px;
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 10px;

        i { font-size: 18px; }
        &.alert-label i { color: #e6a23c; }
      }

      .comment-bubble {
        background: #f0f9eb;
        border: 1px solid #e1f3d8;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: -8px;
          left: 20px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 8px solid #f0f9eb;
        }

        p {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: #333;
        }
      }

      .comment-actions {
        display: flex;
        gap: 8px;
      }

      .alert-box {
        background: #fdf6ec;
        border: 1px solid #faecd8;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;

        p {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: #333;
          white-space: pre-wrap;
        }
      }

      .alert-note {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: #909399;
        i { font-size: 14px; color: #e6a23c; }
      }
    }
  }

  // ── History Section ─
  .history-section {
    margin-top: 20px;

    .history-card {
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      border: none;

      .history-table {
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
    }
  }

  // ── Responsive ─
  @media (max-width: 768px) {
    padding: 12px;

    .header-content {
      flex-direction: column;
      align-items: flex-start !important;
    }

    .action-bar {
      flex-direction: column;
      .analyze-btn { min-width: unset; }
    }

    .stats-card .stat-item {
      .stat-value { font-size: 22px; }
    }

    .history-tabs {
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>
