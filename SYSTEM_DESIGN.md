# Sokogate Web — Complete System Design & Architecture

> **Project:** sokogate-web (Vue 2.7 · B2B Cross-Border E-Commerce · Africa Markets)
> **Date:** June 12, 2026
> **Status:** Planned — Ready for phased implementation

---

## Table of Contents

1. [System Design](#1-system-design)
2. [System Architecture](#2-system-architecture)
3. [Frontend](#3-frontend)
4. [APIs & Backend Logic](#4-apis--backend-logic)
5. [Auth & Permissions](#5-auth--permissions)
6. [Hosting & Cloud](#6-hosting--cloud)
7. [CI/CD & Version Control](#7-cicd--version-control)
8. [Security](#8-security)
9. [Rate Limiting](#9-rate-limiting)
10. [Caching & CDN](#10-caching--cdn)
11. [Error Tracking & Logging](#11-error-tracking--logging)
12. [Monitoring & Alerts](#12-monitoring--alerts)
13. [Testing](#13-testing)
14. [Scaling](#14-scaling)

---

## 1. System Design

### 1.1 Current State Assessment

| Dimension | Current Status | Gaps |
|-----------|---------------|------|
| **Framework** | Vue 2.7 (EOL) | No security patches, no modern tooling |
| **State** | Vuex 4 | Working but verbose, not modular |
| **Build** | Vue CLI 5 + Webpack | Slow HMR, no Vite |
| **Language** | JavaScript | No type safety, runtime errors common |
| **Tests** | None | Zero test coverage |
| **CI/CD** | None | Manual WinSCP deploy with hardcoded creds |
| **Backend** | External API (sokogate.cn) | No local backend for development |
| **Monitoring** | Google Analytics only | No error tracking, no APM |
| **Security** | Hardcoded API keys in source | Plaintext credentials in deploy script |
| **Caching** | None | No CDN, no service worker, no SWR |
| **Docker** | None | No containerization |

### 1.2 Target Architecture (High-Level)

```
┌─────────────────────────────────────────────────────────────┐
│                        Cloudflare                           │
│  CDN · DNS · DDoS Protection · Rate Limiting · WAF         │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                     Load Balancer (ALB/NLB)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              Docker Swarm / Kubernetes Cluster               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Frontend Container (Nginx + Vue SPA)                │   │
│  │  - Static file serving                               │   │
│  │  - Gzip/Brotli compression                           │   │
│  │  - SPA fallback routing                              │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                        │
│  ┌──────────────────▼───────────────────────────────────┐   │
│  │  API Gateway Container (Node.js + Express)            │   │
│  │  - Rate limiting (express-rate-limit)                 │   │
│  │  - JWT validation                                     │   │
│  │  - Request logging (Winston)                          │   │
│  │  - CORS, Helmet, compression                          │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                        │
│  ┌──────────────────▼───────────────────────────────────┐   │
│  │  Backend Service Containers                           │   │
│  │  - Auth Service   - Product Service                   │   │
│  │  - Order Service  - Payment Service                   │   │
│  │  - User Service   - Search Service                    │   │
│  │  - Store Service  - Logistics Service                 │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                        │
│  ┌──────────────────▼───────────────────────────────────┐   │
│  │  Databases & Infrastructure                          │   │
│  │  - PostgreSQL (Primary DB)                           │   │
│  │  - Redis (Cache + Sessions + Queues)                 │   │
│  │  - Alibaba Cloud OSS (Media Storage)                 │   │
│  │  - Elasticsearch (Product Search)                    │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### 1.3 Data Flow

```
User → Cloudflare CDN → Nginx → Vue SPA (browser)
                                    │
                          API Calls (axios)
                                    │
                            API Gateway
                           /     |     \
                    Auth    Product   Order
                      │       │        │
                   Redis   PostgreSQL  OSS
                            /    \
                    Elasticsearch  Redis Cache
```

---

## 2. System Architecture

### 2.1 Microservices vs Monolith Decision

**Recommendation: Modular Monolith (Stage 1) → Microservices (Stage 2)**

| Phase | Architecture | Rationale |
|-------|-------------|-----------|
| Stage 1 | Modular Monolith (Express + modules) | Faster development, single deployable, easier debugging |
| Stage 2 | Microservices (Docker Compose → Swarm) | Scale individual services independently |

### 2.2 Backend Module Organization

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/           # Login, register, JWT, OAuth
│   │   ├── user/           # Profile, addresses, preferences
│   │   ├── product/        # SPU, SKU, categories, search
│   │   ├── cart/           # Shopping cart CRUD
│   │   ├── order/          # Orders, status management
│   │   ├── payment/        # Payment gateways integration
│   │   ├── logistics/      # Shipping, carriers, tracking
│   │   ├── store/          # Store management
│   │   ├── banner/         # Banner management
│   │   ├── upload/         # OSS file upload
│   │   ├── collection/     # User product collections
│   │   └── admin/          # Admin operations
│   ├── common/
│   │   ├── middleware/      # Auth, rate-limit, validation
│   │   ├── database/       # PostgreSQL connection, migrations
│   │   ├── cache/          # Redis client wrapper
│   │   ├── logger/         # Winston logger
│   │   └── utils/          # Shared utilities
│   ├── app.js              # Express app setup
│   └── server.js           # Entry point
├── migrations/             # Database migrations
├── seeds/                  # Seed data
├── tests/
├── Dockerfile
├── docker-compose.yml
└── package.json
```

### 2.3 Database Schema (PostgreSQL)

```
users
├── id (PK, UUID)
├── email (unique)
├── phone (unique)
├── password_hash
├── name
├── avatar_url
├── country_code
├── role (enum: buyer, seller, admin)
├── is_verified
├── cloth_size (JSON)
├── onboarding_data (JSONB)
├── created_at
├── updated_at
└── deleted_at (soft delete)

addresses
├── id (PK, UUID)
├── user_id (FK → users.id)
├── label
├── full_name
├── phone
├── country
├── state
├── city
├── district
├── street
├── zip_code
├── is_default
├── created_at
└── updated_at

categories
├── id (PK, UUID)
├── parent_id (nullable, self-ref)
├── name
├── slug
├── icon_url
├── sort_order
├── is_active
├── created_at
└── updated_at

products (SPU)
├── id (PK, UUID)
├── store_id (FK → stores.id)
├── category_id (FK → categories.id)
├── name
├── description
├── images (JSONB)
├── video_url
├── attributes (JSONB)
├── min_price
├── max_price
├── moq
├── tags (text[])
├── status (enum: draft, active, inactive)
├── view_count
├── sale_count
├── created_at
├── updated_at
└── deleted_at

product_variants (SKU)
├── id (PK, UUID)
├── product_id (FK → products.id)
├── sku_code
├── attributes (JSONB) — e.g. {"color":"red","size":"XL"}
├── price (integer, cents)
├── stock
├── weight (grams)
├── volume_cbm
├── images (JSONB)
├── is_active
├── created_at
└── updated_at

cart_items
├── id (PK, UUID)
├── user_id (FK → users.id)
├── product_id (FK → products.id)
├── variant_id (FK → product_variants.id)
├── quantity
├── created_at
└── updated_at

orders
├── id (PK, UUID)
├── user_id (FK → users.id)
├── order_number (unique, generated)
├── status (enum)
├── items (JSONB)
├── shipping_address_id (FK → addresses.id)
├── logistics_id (FK → logistics.id)
├── subtotal (integer, cents)
├── shipping_cost (integer, cents)
├── discount (integer, cents)
├── total (integer, cents)
├── currency
├── exchange_rate
├── payment_method
├── payment_status
├── paid_at
├── note
├── created_at
├── updated_at
└── deleted_at

stores
├── id (PK, UUID)
├── owner_id (FK → users.id)
├── name
├── slug (unique)
├── description
├── logo_url
├── banner_url
├── contact_email
├── contact_phone
├── is_verified
├── rating
├── created_at
└── updated_at

logistics
├── id (PK, UUID)
├── user_id (FK → users.id)
├── company_name
├── contact_name
├── phone
├── email
├── address
├── is_default
├── created_at
└── updated_at

collections (favorites)
├── id (PK, UUID)
├── user_id (FK → users.id)
├── product_id (FK → products.id)
├── created_at
└── UNIQUE(user_id, product_id)

banners
├── id (PK, UUID)
├── title
├── image_url
├── link_url
├── sort_order
├── is_active
├── created_at
└── updated_at

uploads / oss_files
├── id (PK, UUID)
├── user_id (FK → users.id)
├── file_name
├── file_url
├── file_type
├── file_size
├── md5
├── created_at
└── deleted_at

exchange_rates
├── id (PK, UUID)
├── base_currency
├── target_currency
├── rate
├── updated_at (used as version)

verification_codes
├── id (PK, UUID)
├── user_id (nullable)
├── email / phone
├── code
├── type (enum: register, login, forgot, bind)
├── expires_at
├── is_used
├── created_at
└── updated_at

sessions
├── id (PK, UUID)
├── user_id (FK → users.id)
├── token (JTI)
├── refresh_token
├── expires_at
├── device_info (JSONB)
├── ip_address
├── created_at
└── updated_at

im_chat_history
├── id (PK, UUID)
├── from_user_id
├── to_user_id
├── message_type
├── content
├── store_id
├── created_at
└── updated_at
```

### 2.4 API Endpoints

**Public (No Auth):**
```
POST   /api/v2/login                          # User login
POST   /api/v2/register                        # User registration
POST   /api/v2/forget                          # Forgot password
POST   /api/v2/addVerifyCode                   # Send verification code
POST   /api/v2/addVerifyCodeV2                 # Send verification code v2
POST   /api/v2/getCategoryList                 # Get category list
POST   /api/v2/getBannerList                   # Get banners
POST   /api/v2/getSpuList                      # Get product list
POST   /api/v2/getSpu                          # Get product detail
POST   /api/v2/getSpuListByIds                 # Get multiple products
POST   /api/v2/searchSpu                       # Search products
POST   /api/v2/getRecommListbyTypes            # Get recommendations
POST   /api/v2/getModCategoryList              # Get module categories
POST   /api/v2/getCountryList                  # Get country list
POST   /api/v2/getStore                        # Get store detail
POST   /api/v2/getStorebyName                  # Search store by name
POST   /api/v2/getCategoryChildenList          # Get subcategories
POST   /api/v2/getExchateRateMap               # Get exchange rates
POST   /api/v2/getOssPolicyToken               # Get OSS upload token
POST   /api/v2/registerEasemodUser             # Register IM user
POST   /api/v2/addImChat                       # Add chat message
POST   /api/v2/getImChatList                   # Get chat history
POST   /api/v2/getUserListbyStoreId            # Get store users
POST   /api/v2/prepaymentAttach                # Prepayment attachment
POST   /api/v2/getCategoryByName               # Get category by name
POST   /api/v2/loginQRCode                     # Get login QR code
POST   /api/v2/loginCheckStatus               # Check QR login status
POST   /api/v2/geCountryV2List                 # Get country list v2
POST   /api/v2/getStateAndCityListByCountryId  # Get states/cities
POST   /api/v2/getLogisticChannelList          # Get logistics channels
POST   /api/v2/delCart                         # Delete cart item
POST   /api/v2/updateCart                      # Update cart item
POST   /api/v2/getOrderPayList                 # Get payment list
POST   /api/v2/getAreabyAName                  # Get areas by name
POST   /api/v2/updateUserPhoneOrEmail          # Update phone/email
POST   /api/v2/updateUserClothSize             # Update cloth size
POST   /api/v2/getSpuImagesearch               # Image search
POST   /api/v2/addSpuHistoryImgsearch          # Log image search
```

**Authenticated (Auth Required):**
```
POST   /api/v2/getCartList                     # Get cart items
POST   /api/v2/upsertCartList                  # Add/update cart
POST   /api/v2/addOrderV2                      # Create order
POST   /api/v2/getOrderListbyIds              # Get orders by IDs
POST   /api/v2/checkOrder                      # Pay order
POST   /api/v2/getPayStatus                    # Check payment status
POST   /api/v2/cinetPay                        # CinetPay payment
POST   /api/v2/quikkPay                        # QuikkPay payment
POST   /api/v2/getOrderUserIsOnePay            # Check first purchase
POST   /api/v2/addUserLogistics                # Add logistics
POST   /api/v2/getUserLogistics                # Get logistics
POST   /api/v2/addUserAddress                  # Add address
POST   /api/v2/delUserAddress                  # Delete address
POST   /api/v2/editUserAddress                 # Edit address
POST   /api/v2/getUserAddressList              # Get addresses
POST   /api/v2/getOrderListbyStatus            # Get orders by status
POST   /api/v2/getOrderDetail                  # Get order detail
POST   /api/v2/canceOrder                      # Cancel order
POST   /api/v2/getSpuCollection                # Get collection status
POST   /api/v2/addSpuCollection                # Add to collection
POST   /api/v2/getSpuCollectionList            # Get collection list
POST   /api/v2/delSpuCollection                # Remove from collection
POST   /api/v2/addOssFile                      # Log OSS upload
POST   /api/v2/getIntelligentRecommend         # AI recommendations
POST   /api/v2/idCardCheck                     # ID card verification
POST   /api/v2/getCheckStatus                  # Get verification status
POST   /api/v2/lifeCheckLink                   # Get liveness check URL
POST   /api/v2/shuJuIdCardCheck                # ID verification (Shuju)
POST   /api/v2/faceIdCardCompare               # Face comparison
POST   /api/v2/smsSend                         # Send SMS
POST   /api/v2/smsVerify                       # Verify SMS code
POST   /api/v2/certification                   # Certification
POST   /api/v2/onboarding/submit               # Submit onboarding
POST   /api/v2/hermes/personalizedFeed         # Personalized feed
POST   /api/v2/hermes/updateUserPreference     # Update preferences
POST   /api/v2/getShareCode                    # Get share code
POST   /api/v2/addShareLinks                   # Log share link click
GET    /api/v2/getShareCode                    # Get share code
```

**Admin (Admin Role Required):**
```
POST   /api/v2/addModCategorybyAdmin           # Add category (admin)
POST   /api/v2/editModCategorybyAdmin          # Edit category (admin)
POST   /api/v2/delModCategorybyAdmin           # Delete category (admin)
POST   /api/v2/getModCategoryListbyAdmin       # Get categories (admin)
POST   /api/v2/editBannerbyAdmin               # Edit banner (admin)
POST   /api/v2/delBannerbyAdmin                # Delete banner (admin)
```

---

## 3. Frontend

### 3.1 Current Frontend Architecture

```
sokogate-web (Vue 2.7.16)
├── Vue CLI 5 + Webpack 5
├── Vue Router 3 (history mode)
├── Vuex 4 (state management)
├── Element UI (component library)
├── Bootstrap Vue (responsive layout)
├── vue-i18n (9 languages: en, zh, fra, spa, pt, ara, ru, per, hi)
├── axios (HTTP client)
├── 8 Market SEO pages (guinea, senegal, ghana, etc.)
├── Payment integrations: Flutterwave, Paystack, Stripe, PayPal, CinetPay, QuikkPay, PayDunya, Orange Money, Alipay, WeChat Pay
└── CSS: Custom + Element UI theme + Bootstrap + icon fonts
```

### 3.2 Recommended Frontend Improvements

**Phase 1 (Immediate — No Framework Change):**
- ✅ Add TypeScript via JSDoc annotations incrementally
- ✅ Add Vue Devtools for debugging
- ✅ Implement proper code splitting (already has dynamic imports)
- ✅ Add service worker for offline caching
- ✅ Add PWA manifest
- ✅ Improve bundle analysis
- ✅ Extract shared logic into composables
- ✅ Remove duplicate GA tags (currently 3 GA scripts)
- ✅ Move hardcoded API keys to env variables

**Phase 2 (Medium-term — Migration):**
- Migrate from Vue 2 → Vue 3 with Composition API
- Migrate from Vuex → Pinia
- Migrate from Vue CLI → Vite
- Convert `.vue` files to `<script setup>` syntax
- Add TypeScript (`.ts` and `.d.ts` files)

**Phase 3 (Long-term — Optimization):**
- Consider Nuxt 3+ for SSR/SSG for SEO pages
- Implement ISR (Incremental Static Regeneration) for market pages
- Add Vitest for unit testing
- Add Playwright for E2E testing
- Add Storybook for component library

### 3.3 Bundle Optimization

| Strategy | Current | Target |
|----------|---------|--------|
| Bundle size | ~2-3 MB (estimated) | < 500 KB (gzip) |
| Code splitting | ✅ Dynamic imports | ✅ + Route-based + Component-level |
| Tree shaking | Partial | Full (switch to ES modules) |
| Image optimization | None | WebP + lazy loading + responsive |
| Font optimization | Full icon fonts loaded | Subset + woff2 |
| CSS extraction | ✅ | ✅ + PurgeCSS |
| Gzip/Brotli | ✅ (compression-webpack-plugin) | ✅ + CDN-level |
| Prefetch | Disabled | Critical path only |

### 3.4 Performance Targets

| Metric | Current | Target |
|--------|---------|--------|
| FCP | Unknown | < 1.5s |
| LCP | Unknown | < 2.5s |
| TTI | Unknown | < 3.0s |
| TBT | Unknown | < 200ms |
| CLS | Unknown | < 0.1 |
| Lighthouse Score | Unknown | > 90 |

---

## 4. APIs & Backend Logic

### 4.1 Backend Technology Stack

| Component | Technology | Reason |
|-----------|-----------|--------|
| **Runtime** | Node.js 20 LTS | Team familiarity, NPM ecosystem |
| **Framework** | Express.js 4.x | Mature, well-known, extensive middleware |
| **Language** | JavaScript → TypeScript (incremental) | Type safety |
| **Database** | PostgreSQL 16 | ACID compliance, JSONB support, full-text search |
| **Cache** | Redis 7 | Session store, rate limiting, cache, message queue |
| **Search** | Elasticsearch or MeiliSearch | Product search with typo tolerance |
| **ORM** | Sequelize 6 / Knex.js | Migration support, query building |
| **Validation** | Joi / Zod | Request validation |
| **Documentation** | Swagger / OpenAPI 3.0 | API docs |
| **Auth** | JWT + bcrypt + refresh tokens | Stateless auth |
| **File Upload** | Multer → Alibaba OSS SDK | Direct-to-OSS uploads |
| **Logging** | Winston + Morgan | Structured logging |
| **Testing** | Jest + Supertest | Integration & unit tests |

### 4.2 Project Structure

```
backend/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── server.js              # HTTP server entry
│   ├── config/
│   │   ├── index.js           # Config loader (env-based)
│   │   ├── database.js        # DB connection config
│   │   ├── redis.js           # Redis connection config
│   │   └── payment.js         # Payment gateway configs
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.validation.js
│   │   │   └── auth.test.js
│   │   ├── user/ ...
│   │   ├── product/ ...
│   │   ├── cart/ ...
│   │   ├── order/ ...
│   │   ├── payment/ ...
│   │   ├── logistics/ ...
│   │   ├── store/ ...
│   │   ├── banner/ ...
│   │   ├── upload/ ...
│   │   ├── collection/ ...
│   │   └── admin/ ...
│   ├── common/
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js      # JWT verification
│   │   │   ├── admin.middleware.js     # Admin role check
│   │   │   ├── rateLimiter.middleware.js
│   │   │   ├── validator.middleware.js
│   │   │   └── errorHandler.middleware.js
│   │   ├── database/
│   │   │   ├── models/                # Sequelize models
│   │   │   ├── migrations/            # DB migrations
│   │   │   └── seeds/                 # Seed data
│   │   ├── cache/
│   │   │   └── redisClient.js
│   │   ├── logger/
│   │   │   └── logger.js
│   │   └── utils/
│   │       ├── apiResponse.js         # Standard response helpers
│   │       ├── errors.js              # Custom error classes
│   │       ├── jwt.js                  # JWT helpers
│   │       └── pagination.js          # Pagination utility
│   └── routes/
│       └── index.js                   # Route aggregator
├── tests/
│   ├── integration/
│   └── unit/
├── migrations/                        # Knex/Sequelize migrations
├── seeds/
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .eslintrc.js
├── jest.config.js
└── package.json
```

### 4.3 Response Format (Standardized)

```json
// Success
{
  "errcode": 0,
  "errmsg": "success",
  "data": { ... }
}

// Success with list
{
  "errcode": 0,
  "errmsg": "success",
  "data": {
    "rows": [...],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}

// Error
{
  "errcode": 40001,
  "errmsg": "Invalid parameters",
  "data": null
}

// Auth error (707 = redirect to login)
{
  "errcode": 707,
  "errmsg": "Token expired"
}
```

### 4.4 Error Code Convention

| Code Range | Type |
|-----------|------|
| 0 | Success |
| 707 | Auth required / Token expired |
| 400xx | Validation errors |
| 401xx | Auth errors |
| 403xx | Permission errors |
| 404xx | Not found |
| 409xx | Conflict / Duplicate |
| 429xx | Rate limited |
| 500xx | Server errors |

---

## 5. Auth & Permissions

### 5.1 Authentication Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  Client  │         │   API    │         │  Redis   │
└────┬─────┘         └────┬─────┘         └────┬─────┘
     │                     │                     │
     │  POST /login        │                     │
     │  {email, password}  │                     │
     │────────────────────>│                     │
     │                     │  Verify credentials │
     │                     │────────────────>    │
     │                     │  Store session      │
     │                     │────────────────>    │
     │  {accessToken,      │                     │
     │   refreshToken,     │                     │
     │   expiresIn}        │                     │
     │<────────────────────│                     │
     │                     │                     │
     │  API requests with  │                     │
     │  x-auth-token: JWT  │                     │
     │────────────────────>│                     │
     │                     │  Verify JWT         │
     │                     │  (no Redis lookup)  │
     │  Response           │                     │
     │<────────────────────│                     │
     │                     │                     │
     │  POST /refresh      │                     │
     │  {refreshToken}     │                     │
     │────────────────────>│                     │
     │                     │  Verify refresh     │
     │                     │────────────────>    │
     │  {newAccessToken}   │                     │
     │<────────────────────│                     │
```

### 5.2 JWT Strategy

```javascript
// Access Token (short-lived: 15 minutes)
{
  sub: "user-uuid",
  role: "buyer",
  iat: 1718200000,
  exp: 1718200900
}

// Refresh Token (long-lived: 7 days)
// Stored in Redis with user mapping
// Can be revoked individually (logout from one device)
// or all at once (force logout all sessions)

// Token stored in:
// - localStorage as "auth_token" (current)
// - Should migrate to httpOnly cookie for XSS protection
// - OR keep localStorage but add CSRF token
```

### 5.3 Permission Model

```
Roles:
├── guest        # Unauthenticated — browse only
├── buyer        # Default — can purchase
├── seller       # Can manage store
└── admin        # Full access

Permission Matrix:
├── browse products          │ guest │ buyer │ seller │ admin │
├── view product detail     │   ✅  │   ✅  │   ✅   │   ✅  │
├── add to cart             │   ❌  │   ✅  │   ✅   │   ✅  │
├── checkout                │   ❌  │   ✅  │   ✅   │   ✅  │
├── manage own store        │   ❌  │   ❌  │   ✅   │   ✅  │
├── manage products (admin) │   ❌  │   ❌  │   ❌   │   ✅  │
├── manage banners (admin)  │   ❌  │   ❌  │   ❌   │   ✅  │
└── manage categories(admin)│   ❌  │   ❌  │   ❌   │   ✅  │
```

### 5.4 Security Improvements

| Issue | Current | Fix |
|-------|---------|-----|
| API keys in source | Flutterwave PK in main.js | Move to .env + backend proxy |
| Deploy credentials | Hardcoded in deploy_ps.bat | Remove from repo, use env vars / GitHub Secrets |
| Password storage | Unknown | bcrypt with cost factor 12 |
| Token storage | localStorage | Add httpOnly cookie option |
| CORS | Not configured | Configure strict CORS in backend |
| Helmet headers | Not set | Add helmet.js middleware |
| Rate limiting | None | Add express-rate-limit |
| SQL injection | Unknown | Use parameterized queries (Sequelize/Knex) |

---

## 6. Hosting & Cloud

### 6.1 Current State

- **Frontend:** Static files hosted on Alibaba Cloud OSS (Hong Kong)
- **Backend:** Unknown server at `sokogate.cn` (IP: 47.57.184.253 — Alibaba Cloud ECS)
- **Deployment:** Manual WinSCP upload to `/root/dist`

### 6.2 Target Hosting Architecture

```
                  ┌─────────────────────────┐
                  │     Cloudflare DNS       │
                  │  sokogate.com            │
                  │  www.sokogate.com        │
                  │  *.sokogate.com          │
                  └──────────┬──────────────┘
                             │
                  ┌──────────▼──────────────┐
                  │  Cloudflare CDN + WAF   │
                  │  - DDoS protection      │
                  │  - SSL termination      │
                  │  - Caching rules         │
                  │  - Rate limiting         │
                  └──────────┬──────────────┘
                             │
                  ┌──────────▼──────────────┐
                  │  Alibaba Cloud ALB / NLB │
                  │  (Application LB)        │
                  └──────────┬──────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼───────┐   ┌───────▼───────┐   ┌───────▼───────┐
│  ECS Node 1   │   │  ECS Node 2   │   │  ECS Node 3   │
│  ┌─────────┐  │   │  ┌─────────┐  │   │  ┌─────────┐  │
│  │ Docker  │  │   │  │ Docker  │  │   │  │ Docker  │  │
│  │  nginx  │  │   │  │  nginx  │  │   │  │  nginx  │  │
│  │  api    │  │   │  │  api    │  │   │  │  api    │  │
│  └─────────┘  │   │  └─────────┘  │   │  └─────────┘  │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
              ┌──────────────▼──────────────┐
              │  Alibaba Cloud RDS (Aurora) │
              │  - PostgreSQL 16            │
              │  - Multi-AZ                 │
              │  - Automated backups         │
              └─────────────────────────────┘
                             │
              ┌──────────────▼──────────────┐
              │  Alibaba Cloud Redis        │
              │  - Cache + Sessions         │
              │  - Cluster mode             │
              └─────────────────────────────┘
                             │
              ┌──────────────▼──────────────┐
              │  Alibaba Cloud OSS          │
              │  - Media/CDN storage        │
              │  - Already configured       │
              └─────────────────────────────┘
```

### 6.3 Docker Configuration

**Frontend Dockerfile:**
```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Production stage
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Dockerfile:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - api
    networks:
      - sokogate

  api:
    build: ./backend
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - sokogate

  postgres:
    image: postgis/postgis:16-3.4
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: sokogate
      POSTGRES_USER: sokogate
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sokogate"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - sokogate

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    networks:
      - sokogate

volumes:
  postgres_data:
  redis_data:

networks:
  sokogate:
```

**nginx.conf (Frontend):**
```nginx
server {
    listen 80;
    server_name sokogate.com www.sokogate.com;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1000;
    gzip_comp_level 6;

    # Brotli
    brotli on;
    brotli_types text/plain text/css application/javascript application/json image/svg+xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    # Static assets with long cache
    location /_nuxt/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /img/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # API proxy (optional: use direct or through nginx)
    location /api/ {
        proxy_pass http://api:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
```

---

## 7. CI/CD & Version Control

### 7.1 Current State

- **Version Control:** Git initialized, no commits, no remote
- **CI/CD:** None (manual WinSCP upload with hardcoded credentials)
- **Branching:** No strategy defined

### 7.2 GitHub Actions Workflow

**File: `.github/workflows/deploy.yml`**

```yaml
name: Deploy Sokogate

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  DOCKER_REGISTRY: registry.cn-hongkong.aliyuncs.com

jobs:
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'yarn'
      - run: yarn install --frozen-lockfile
      - run: yarn lint

  test:
    name: Run Tests
    needs: lint
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: sokogate_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'yarn'
      - run: yarn install --frozen-lockfile
      - run: cp .env.example .env
      - run: yarn test
      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  build:
    name: Build Docker Images
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Log in to Docker Registry
        run: echo "${{ secrets.ALIYUN_DOCKER_PASSWORD }}" | docker login ${{ env.DOCKER_REGISTRY }} -u "${{ secrets.ALIYUN_DOCKER_USERNAME }}" --password-stdin
      - name: Build Frontend
        run: |
          docker build -t ${{ env.DOCKER_REGISTRY }}/sokogate/frontend:latest -t ${{ env.DOCKER_REGISTRY }}/sokogate/frontend:${{ github.sha }} -f frontend/Dockerfile ./frontend
      - name: Build Backend
        run: |
          docker build -t ${{ env.DOCKER_REGISTRY }}/sokogate/backend:latest -t ${{ env.DOCKER_REGISTRY }}/sokogate/backend:${{ github.sha }} -f backend/Dockerfile ./backend
      - name: Push Images
        run: |
          docker push ${{ env.DOCKER_REGISTRY }}/sokogate/frontend --all-tags
          docker push ${{ env.DOCKER_REGISTRY }}/sokogate/backend --all-tags

  deploy-production:
    name: Deploy to Production
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Execute SSH Deploy
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /opt/sokogate
            docker compose pull
            docker compose up -d --remove-orphans
            docker system prune -f

  deploy-staging:
    name: Deploy to Staging
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Deploy to staging
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /opt/sokogate-staging
            git pull origin develop
            docker compose -f docker-compose.staging.yml up -d --build --remove-orphans
```

### 7.3 Branch Strategy (GitFlow Simplified)

```
main
  ├── Tags: v1.0.0, v1.1.0, etc.
  └── Protected — requires PR + passing CI
develop
  ├── Integration branch
  └── Protected — requires PR + passing CI
feature/*
  ├── Branch from develop
  └── Merge back to develop via PR
hotfix/*
  ├── Branch from main
  └── Merge back to main and develop
```

### 7.4 Environment Strategy

| Environment | Domain | Purpose | Deploy Trigger |
|-------------|--------|---------|---------------|
| **Development** | localhost:4500 | Local coding | Manual |
| **Staging** | staging.sokogate.com | QA testing | Push to `develop` |
| **Production** | sokogate.com | Live | Push to `main` |

---

## 8. Security

### 8.1 Immediate Security Fixes

| Priority | Issue | Fix |
|----------|-------|-----|
| 🔴 Critical | Hardcoded server password in `deploy_ps.bat` | Remove file from repo, use GitHub Secrets |
| 🔴 Critical | Flutterwave public key hardcoded in `main.js` | Move to .env, proxy payments through backend |
| 🟠 High | No HTTPS enforcement | Add Cloudflare + HSTS headers |
| 🟠 High | 3 Google Analytics tags (duplicate tracking) | Consolidate to single GA4 tag |
| 🟠 High | API keys in client-side source | Proxy all payment calls through backend |
| 🟡 Medium | localStorage for sensitive tokens | Add httpOnly cookie option or encryption |
| 🟡 Medium | No rate limiting | Express-rate-limit middleware |
| 🟡 Medium | No security headers | Helmet.js middleware |
| 🟢 Low | No input sanitization | Add XSS protection middleware |
| 🟢 Low | No dependency scanning | Add `npm audit` / Snyk to CI |

### 8.2 Security Middleware Stack

```javascript
// app.js
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

app.use(helmet());                                           // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://sokogate.com',
  credentials: true
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,                                 // 15 minutes
  max: 100,                                                  // 100 requests per window
  message: { errcode: 429, errmsg: 'Too many requests' }
}));
app.use(express.json({ limit: '10mb' }));                    // Body size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

### 8.3 Environment Variable Security

```bash
# .env.example (committed to repo)
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sokogate
DB_USER=sokogate
DB_PASSWORD=changeme

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=changeme

# JWT
JWT_SECRET=changeme
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Payment Gateways (proxied through backend)
FLUTTERWAVE_PUBLIC_KEY=
FLUTTERWAVE_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=
PAYSTACK_SECRET_KEY=
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=

# Alibaba Cloud OSS
OSS_REGION=oss-cn-hongkong
OSS_ACCESS_KEY_ID=
OSS_ACCESS_KEY_SECRET=
OSS_BUCKET=sokogate-com
OSS_ENDPOINT=https://oss-sokogate-com.oss-cn-hongkong.aliyuncs.com

# Alibaba Cloud ECS/ALB
ALIYUN_ACCESS_KEY_ID=
ALIYUN_ACCESS_KEY_SECRET=

# Easemob (WebIM)
EASEMOB_APPKEY=1101220606096669#demo
EASEMOB_CLIENT_ID=
EASEMOB_CLIENT_SECRET=

# Google Analytics
GA_MEASUREMENT_ID=G-3N56WXZDE0

# SendGrid / Email
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Sentry (error tracking)
SENTRY_DSN=
```

### 8.4 Production Security Checklist

- [ ] Remove all hardcoded secrets from source code
- [ ] Remove `deploy_ps.bat` from repo (or add to .gitignore)
- [ ] Enable Cloudflare WAF (Web Application Firewall)
- [ ] Enable DDoS protection (Cloudflare or Alibaba Cloud)
- [ ] Set up SSL/TLS (Cloudflare Flexible or Full)
- [ ] Add HSTS preload
- [ ] Add Content Security Policy (CSP) headers
- [ ] Set up database encryption at rest
- [ ] Enable database automated backups
- [ ] Add fail2ban for SSH (ECS)
- [ ] Disable root SSH login, use key-based auth only
- [ ] Regular dependency scanning (Dependabot / Snyk)
- [ ] Regular npm audit
- [ ] Set up secrets rotation policy

---

## 9. Rate Limiting

### 9.1 Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| **Cloudflare** | Rate Limiting Rules | Global IP-based, DDoS |
| **Nginx** | limit_req_zone | Per-IP, per-second burst |
| **API (Express)** | express-rate-limit | Per-IP, per-endpoint |
| **Redis** | Rate limiter with sliding window | Per-user for auth routes |

### 9.2 Rate Limit Tiers

```javascript
// Global — 100 requests / 15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { errcode: 429, errmsg: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints — 5 requests / 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { errcode: 429, errmsg: 'Too many login attempts, please try again later' },
  skipSuccessfulRequests: true, // Only count failed attempts
});

// API endpoints — 60 requests / min per user
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: (req) => req.user?.id || req.ip,
});

// OTP/SMS — 3 requests / hour per IP
const smsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { errcode: 429, errmsg: 'Too many SMS requests' },
});
```

### 9.3 Redis-based Rate Limiter (Sliding Window)

```javascript
const redisRateLimiter = async (userId, endpoint, maxRequests, windowSeconds) => {
  const key = `ratelimit:${userId}:${endpoint}`;
  const now = Date.now();
  const windowStart = now - (windowSeconds * 1000);

  // Remove old entries
  await redis.zremrangebyscore(key, 0, windowStart);

  // Count current entries
  const count = await redis.zcard(key);

  if (count >= maxRequests) {
    const ttl = await redis.pttl(key);
    throw new RateLimitError(`Rate limit exceeded. Retry after ${Math.ceil(ttl / 1000)}s`);
  }

  // Add current request
  await redis.zadd(key, now, `${now}-${Math.random()}`);
  await redis.expire(key, windowSeconds);

  return count + 1;
};
```

---

## 10. Caching & CDN

### 10.1 Caching Strategy

| Layer | What | TTL | Invalidation |
|-------|------|-----|-------------|
| **Cloudflare CDN** | Static assets (JS, CSS, fonts, images) | 1 year | Cache purge on deploy |
| **Cloudflare CDN** | HTML pages (market pages) | 1 hour | On content update |
| **Nginx** | Static assets | 1 year | By filename hash |
| **Browser** | Service worker cache | Varies | On new SW version |
| **Redis** | API responses (products, categories) | 5 min | On data mutation |
| **Redis** | Exchange rates | 1 hour | On rate update |
| **Redis** | User sessions | 7 days | On logout |
| **Database** | Query cache (PostgreSQL) | Auto | On row change |

### 10.2 Redis Cache Implementation

```javascript
// Cache wrapper
const getOrSetCache = async (key, fetchFn, ttlSeconds = 300) => {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  const fresh = await fetchFn();
  await redis.setex(key, ttlSeconds, JSON.stringify(fresh));
  return fresh;
};

// Usage: Products
app.post('/api/v2/getSpuList', async (req, res) => {
  const cacheKey = `products:list:${JSON.stringify(req.body)}`;
  const data = await getOrSetCache(cacheKey, () => fetchProducts(req.body), 300);
  res.json({ errcode: 0, errmsg: 'success', data });
});

// Cache invalidation on mutation
app.post('/api/v2/addModCategorybyAdmin', adminMiddleware, async (req, res) => {
  // ... create category
  await redis.del('categories:tree'); // Invalidate cache
  await redis.delPattern('products:list:*'); // Invalidate all product list caches
  res.json({ errcode: 0, errmsg: 'success' });
});
```

### 10.3 CDN Strategy (Cloudflare)

```
Cache Rules:
├── *.css, *.js, *.woff, *.woff2, *.ttf
│   → Cache TTL: 1 year
│   → Edge TTL: 1 year
│   → Browser TTL: 1 year
│
├── /img/*, /static/*
│   → Cache TTL: 30 days
│   → Edge TTL: 30 days
│
├── / (HTML pages)
│   → Cache TTL: 1 hour
│   → Edge TTL: 1 hour
│   → Bypass cache on cookie: auth_token
│
├── /api/*
│   → No cache (dynamic)
│   → Or cache GET endpoints with TTL: 5 min
│
└── /sitemap.xml, /robots.txt
    → Cache TTL: 1 day
```

### 10.4 Service Worker (PWA)

```javascript
// sw.js — registered from main.js
const CACHE_NAME = 'sokogate-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
];

// Install — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
});

// Fetch — network first, fallback to cache
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    // API calls — network only
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
```

---

## 11. Error Tracking & Logging

### 11.1 Logging Architecture

```
Application Logs → Winston (Console + File)
    ↓                          ↓
Structured JSON         Daily Rotate Files
    ↓                          ↓
Elasticsearch (or       Retained 30 days
CloudWatch Logs)
    ↓
Kibana / Grafana
(Visualization)
```

### 11.2 Winston Logger Setup

```javascript
const winston = require('winston');
require('winston-daily-rotate-file');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '30d',
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

module.exports = logger;
```

### 11.3 Morgan HTTP Request Logging

```javascript
const morgan = require('morgan');

app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
  skip: (req) => req.url === '/health',  // Skip health check noise
}));
```

### 11.4 Error Tracking (Sentry)

```javascript
const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  profilesSampleRate: 0.1,
});

// Request handler (must be before other middleware)
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Error handler (must be after all routes)
app.use(Sentry.Handlers.errorHandler());
```

### 11.5 Frontend Error Tracking (Sentry + Vue)

```javascript
// main.js or similar entry point
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';

Sentry.init({
  app,
  dsn: process.env.VUE_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ['localhost', 'sokogate.com', /^\//],
    }),
    new Integrations.Replay(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### 11.6 Structured Log Format

```json
{
  "timestamp": "2026-06-12T10:30:00.000Z",
  "level": "error",
  "message": "Payment failed",
  "service": "payment-service",
  "module": "flutterwave",
  "requestId": "req-abc123",
  "userId": "user-uuid-here",
  "orderId": "order-uuid-here",
  "error": {
    "name": "PaymentError",
    "message": "Insufficient funds",
    "stack": "..."
  },
  "meta": {
    "amount": 50000,
    "currency": "XOF",
    "paymentMethod": "flutterwave"
  }
}
```

---

## 12. Monitoring & Alerts

### 12.1 Monitoring Stack

| Tool | Purpose | Type |
|------|---------|------|
| **Cloudflare Analytics** | Traffic, CDN, security | Cloud |
| **Sentry** | Error tracking, performance | Cloud |
| **Google Analytics 4** | User behavior, conversions | Cloud |
| **Grafana + Prometheus** | Server metrics, custom dashboards | Self-hosted / Cloud |
| **Alibaba Cloud Monitor** | ECS, RDS, Redis metrics | Cloud |
| **Uptime Robot / Checkly** | Uptime monitoring | Cloud |
| **Lighthouse CI** | Performance regression tracking | CI |

### 12.2 Key Metrics to Track

**Infrastructure:**
- CPU / Memory / Disk usage (per container)
- Request rate (RPS)
- Response time (p50, p95, p99)
- Error rate (5xx, 4xx)
- Active database connections
- Cache hit ratio (Redis)
- DB query performance

**Business:**
- Active users (DAU/MAU)
- Conversion rate (visit → order)
- Cart abandonment rate
- Payment success rate
- Average order value
- Most viewed products
- Search queries
- Page load time

### 12.3 Prometheus Metrics

```javascript
const prometheus = require('prom-client');

// Collect default metrics
const collectDefaultMetrics = prometheus.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Custom metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5, 10],
});

const httpRequestsTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

// Middleware to track
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });
    end({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });
  });
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});
```

### 12.4 Alert Rules

```yaml
# Prometheus Alertmanager rules
groups:
  - name: sokogate-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Error rate > 5% in the last 5 minutes"

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "P95 latency > 2 seconds"

      - alert: HighCPUUsage
        expr: 100 - (avg by(instance)(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "CPU usage > 80% for 10 minutes"

      - alert: LowDiskSpace
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100 < 20
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Disk space < 20%"

      - alert: PaymentFailure
        expr: rate(payment_failures_total[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Payment failures detected"

      - alert: ServiceDown
        expr: up{job="sokogate-api"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "API service is down"
```

### 12.5 Notification Channels

| Alert Level | Channel | Response Time |
|-------------|---------|---------------|
| Critical | PagerDuty / OpsGenie | < 5 min |
| Warning | Slack #sokogate-alerts | < 30 min |
| Info | Email | Daily digest |

---

## 13. Testing

### 13.1 Test Pyramid

```
        ╱─────╲
       ╱  E2E  ╲        ← Playwright (5-10 critical paths)
      ╱─────────╲
     ╱Integration╲      ← Supertest + Jest (API endpoints)
    ╱─────────────╲
   ╱   Unit Tests   ╲    ← Jest (Services, Utils, Models)
  ╱───────────────────╲
 ╱ Static Analysis     ╲  ← ESLint, TypeScript, Prettier
╱───────────────────────╲
```

### 13.2 Test Configuration

```javascript
// jest.config.js — Backend
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterSetup: ['./tests/setup.js'],
  testMatch: ['**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### 13.3 Unit Tests (Jest)

```javascript
// src/modules/auth/auth.service.test.js
const authService = require('./auth.service');
const { UserModel } = require('../../common/database/models');
const bcrypt = require('bcrypt');
const jwt = require('../../common/utils/jwt');

jest.mock('../../common/database/models');
jest.mock('bcrypt');
jest.mock('../../common/utils/jwt');

describe('AuthService', () => {
  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      UserModel.findOne.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        passwordHash: '$2b$12$...',
        role: 'buyer',
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.generateAccessToken.mockReturnValue('access-token');
      jwt.generateRefreshToken.mockReturnValue('refresh-token');

      const result = await authService.login({
        email: 'test@example.com',
        password: 'correct-password',
      });

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 900,
      });
    });

    it('should throw for invalid password', async () => {
      UserModel.findOne.mockResolvedValue({
        id: 'user-1',
        passwordHash: '$2b$12$...',
      });
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login({
        email: 'test@example.com',
        password: 'wrong-password',
      })).rejects.toThrow('Invalid credentials');
    });
  });
});
```

### 13.4 Integration Tests (Supertest)

```javascript
// tests/integration/auth.test.js
const request = require('supertest');
const app = require('../../src/app');
const { setupDB, teardownDB } = require('../helpers/db');

beforeAll(setupDB);
afterAll(teardownDB);

describe('POST /api/v2/login', () => {
  it('should return 200 and tokens for valid login', async () => {
    const res = await request(app)
      .post('/api/v2/login')
      .send({
        email: 'test@example.com',
        password: 'TestPass123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.errcode).toBe(0);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
  });

  it('should return 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v2/login')
      .send({
        email: 'test@example.com',
        password: 'WrongPass!',
      });

    expect(res.status).toBe(401);
    expect(res.body.errcode).toBe(40101);
  });

  it('should rate limit after 5 failed attempts', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/v2/login')
        .send({ email: 'test@example.com', password: 'wrong' });
    }
    const res = await request(app)
      .post('/api/v2/login')
      .send({ email: 'test@example.com', password: 'wrong' });
    expect(res.status).toBe(429);
  });
});
```

### 13.5 E2E Tests (Playwright)

```javascript
// tests/e2e/checkout.spec.js
const { test, expect } = require('@playwright/test');

test('complete purchase flow', async ({ page }) => {
  // Navigate to home
  await page.goto('/');
  await expect(page.locator('.product-grid')).toBeVisible();

  // Search for product
  await page.fill('[data-testid="search-input"]', 'shoes');
  await page.press('[data-testid="search-input"]', 'Enter');
  await expect(page).toHaveURL(/.*search=shoes/);

  // Click on product
  await page.click('[data-testid="product-card"]:first-child');
  await expect(page).toHaveURL(/.*product\/detail/);

  // Add to cart
  await page.click('[data-testid="add-to-cart-btn"]');
  await expect(page.locator('[data-testid="cart-count"]')).toContainText('1');

  // Go to cart
  await page.click('[data-testid="cart-icon"]');
  await expect(page).toHaveURL(/.*shopping-cart/);

  // Proceed to checkout
  await page.click('[data-testid="checkout-btn"]');

  // Fill address
  await page.fill('[data-testid="address-input"]', '123 Main St');

  // Complete payment
  await page.click('[data-testid="pay-now-btn"]');
  await expect(page.locator('[data-testid="payment-success"]')).toBeVisible();
});
```

### 13.6 Test Coverage Requirements

| Layer | Coverage Target | Tool |
|-------|----------------|------|
| Backend Services | 80%+ | Jest |
| Backend API Routes | 90%+ (integration) | Supertest |
| Frontend Components | 70%+ | Vitest + Vue Test Utils |
| Frontend Stores (Vuex) | 80%+ | Vitest |
| E2E Critical Paths | 10 journeys | Playwright |
| Security Scanning | All dependencies | npm audit, Snyk |
| Linting | 100% pass | ESLint |

---

## 14. Scaling

### 14.1 Scaling Strategy Overview

```
            ┌──────────────────────┐
            │  Vertical Scaling    │  ← Increase ECS instance size
            │  (Immediate)         │     (CPU/RAM)
            └──────────┬───────────┘
                       │
            ┌──────────▼───────────┐
            │  Horizontal Scaling   │  ← Add more ECS instances
            │  (Stage 2)           │     behind ALB
            └──────────┬───────────┘
                       │
            ┌──────────▼───────────┐
            │  Database Scaling     │  ← RDS read replicas
            │  (Stage 3)           │     + connection pooling
            └──────────┬───────────┘
                       │
            ┌──────────▼───────────┐
            │  Microservices        │  ← Break monolith into
            │  (Stage 4)           │     separate services
            └──────────────────────┘
```

### 14.2 Database Scaling

```javascript
// Read/Write splitting with Sequelize
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  replication: {
    write: {
      host: process.env.DB_WRITER_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    read: [
      { host: process.env.DB_READER_1_HOST },
      { host: process.env.DB_READER_2_HOST },
    ],
  },
  pool: {
    max: 20,
    min: 5,
    idle: 30000,
    acquire: 60000,
  },
});
```

### 14.3 Connection Pooling

```javascript
// PgBouncer for PostgreSQL connection pooling
// Run as sidecar container
pgbouncer:
  image: edoburu/pgbouncer:1.21
  environment:
    DB_HOST: postgres
    DB_PORT: 5432
    DB_USER: sokogate
    DB_PASSWORD: ${DB_PASSWORD}
    DB_NAME: sokogate
    POOL_MODE: transaction
    DEFAULT_POOL_SIZE: 25
    MAX_CLIENT_CONN: 100
```

### 14.4 Cache Scaling

```
Redis Topology (Stage 1 → Stage 3):

Stage 1: Single Redis instance
  → Sufficient for < 10k concurrent users

Stage 2: Redis Sentinel (HA)
  → 1 master + 2 replicas
  → Automatic failover

Stage 3: Redis Cluster
  → Sharded across multiple nodes
  → For > 100k concurrent users
```

### 14.5 Auto-scaling Configuration

```yaml
# Alibaba Cloud Auto Scaling Group
scaling:
  min_size: 2
  max_size: 10
  desired_capacity: 2
  scaling_policies:
    - metric: CPUUtilization
      threshold: > 70%
      adjustment: +1
      cooldown: 300
    - metric: CPUUtilization
      threshold: < 30%
      adjustment: -1
      cooldown: 300
    - metric: RequestCountPerTarget
      threshold: > 5000
      adjustment: +2
      cooldown: 300
```

### 14.6 Performance Budgets

| Metric | Budget | Scaling Action |
|--------|--------|---------------|
| API p95 latency | < 500ms | Add cache, optimize queries |
| API p99 latency | < 2s | Scale up/out |
| Error rate (5xx) | < 1% | Investigate & fix |
| DB connections | < 80% of pool | Add PgBouncer |
| DB CPU | < 70% | Add read replicas |
| Redis memory | < 70% | Increase memory / cluster |
| CDN cache hit ratio | > 80% | Optimize cache rules |
| Frontend bundle (gzip) | < 500KB | Code splitting, tree-shaking |

### 14.7 Disaster Recovery

```
RTO (Recovery Time Objective): 1 hour
RPO (Recovery Point Objective): 15 minutes

Backup Strategy:
├── PostgreSQL: Automated daily snapshot (retained 30 days)
│   └── WAL streaming to standby (15 min RPO)
├── Redis: AOF persistence + periodic RDB snapshots
├── OSS: Cross-region replication (Hong Kong → Singapore)
└── Docker images: Pushed to registry with git SHA tags

Recovery Playbook:
1. Fail DNS to standby region (Cloudflare)
2. Restore DB from latest snapshot
3. Deploy last known-good Docker images
4. Verify health checks
5. Fail DNS back when primary restored
```

---

## Implementation Roadmap (Phased)

### Phase 1: Foundation (Weeks 1-2)
- [ ] Initialize Git remote (GitHub/GitLab)
- [ ] Set up `.gitignore` for secrets and build artifacts
- [ ] Remove `deploy_ps.bat` from version control
- [ ] Add `.env.example` with all required variables
- [ ] Configure ESLint + Prettier (already partially done)
- [ ] Set up basic CI pipeline (GitHub Actions - lint only)
- [ ] Create Dockerfile for frontend
- [ ] Create nginx configuration
- [ ] Consolidate Google Analytics to single GA4 tag
- [ ] Move hardcoded API keys to env files

### Phase 2: Backend (Weeks 3-5)
- [ ] Initialize Node.js backend project
- [ ] Set up Express with middleware (helmet, cors, rate-limit)
- [ ] Configure PostgreSQL + Sequelize with migrations
- [ ] Configure Redis for caching and sessions
- [ ] Implement JWT auth with refresh tokens
- [ ] Build all API endpoints (mapped from existing frontend calls)
- [ ] Implement standardized error handling and response format
- [ ] Set up Winston logger
- [ ] Set up Sentry error tracking
- [ ] Write integration tests for all endpoints

### Phase 3: Infrastructure (Weeks 6-7)
- [ ] docker-compose.yml for local development
- [ ] Cloudflare DNS + CDN configuration
- [ ] Production Docker Compose / Swarm config
- [ ] GitHub Actions CI/CD (lint → test → build → deploy)
- [ ] Set up staging environment
- [ ] Database migration scripts
- [ ] Redis cache strategy implementation

### Phase 4: Frontend Improvements (Weeks 8-9)
- [ ] Add service worker / PWA support
- [ ] Implement bundle optimization (analyze + reduce)
- [ ] Add Sentry Vue integration for frontend error tracking
- [ ] Performance optimization (lazy loading, image optimization)
- [ ] Lighthouse audit and fixes
- [ ] Migrate from Vuex to Pinia (prep for Vue 3)
- [ ] Add type checking (JSDoc → TypeScript)

### Phase 5: Testing & Quality (Week 10)
- [ ] Add Jest + Supertest for backend unit/integration tests
- [ ] Add Playwright for E2E tests (critical paths)
- [ ] Set up coverage thresholds in CI
- [ ] Add npm audit / Snyk dependency scanning
- [ ] Security audit (penetration testing basics)
- [ ] Load testing (k6 or Artillery)

### Phase 6: Monitoring & Scaling (Week 11-12)
- [ ] Prometheus + Grafana setup
- [ ] Set up uptime monitoring
- [ ] Configure alert rules and notification channels
- [ ] Performance baseline measurement
- [ ] Load test and establish scaling thresholds
- [ ] Document runbooks for common incidents

---

## Quick Wins (Do First)

These are high-impact, low-effort items that can be done immediately:

1. 🔥 **Remove hardcoded credentials** — Delete `deploy_ps.bat` secrets, move API keys
2. 🔥 **Consolidate GA tracking** — 3 scripts → 1 GA4 tag
3. ✅ **Add `.env.example`** — Document all required environment variables
4. ✅ **Set up Docker + nginx** — Containerize the existing app
5. ✅ **Add GitHub repo + CI** — Basic lint pipeline
6. ✅ **Add `.gitignore`** — Ensure secrets/build aren't committed
7. 📋 **Write tests** — Start with backend, then frontend
8. 📋 **Set up Sentry** — Error tracking for both frontend and backend
9. 📋 **Configure Cloudflare** — CDN, SSL, caching
10. 📋 **Redis caching** — Quick performance win for API

---

*This document serves as the master blueprint for the sokogate-web project transformation. Each phase should be executed sequentially, with the output of each phase informing the next.*

*Last updated: June 12, 2026*
