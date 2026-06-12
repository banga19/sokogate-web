# Sokogate Web

B2B cross-border e-commerce platform connecting African buyers with Chinese suppliers.

**Stack:** Vue 2.7 (frontend) · Node.js/Express (backend) · PostgreSQL · Redis · Docker · GitHub Actions

---

## Project Structure

```
sokogate-web/
├── frontend/                 # Vue.js SPA (Vue CLI 5 + Webpack 5)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── layout/          # Page layouts (nav, header, footer)
│   │   ├── pages/           # Page views (product, user, checkout, etc.)
│   │   ├── router/          # Vue Router (history mode, lazy routes)
│   │   ├── store/           # Vuex state management
│   │   ├── locale/          # i18n (9 languages)
│   │   ├── utils/           # API clients, helpers
│   │   ├── style/           # Element UI theme, Bootstrap, icons
│   │   └── main.js          # App entry point
│   ├── public/              # Static HTML, favicon, sitemap
│   ├── nginx.conf           # Nginx config for production
│   └── Dockerfile           # Multi-stage Docker build
│
├── backend/                  # Node.js API (Express + Sequelize)
│   ├── src/
│   │   ├── app.js           # Express app setup (helmet, cors, rate-limit, etc.)
│   │   ├── server.js        # Entry point with DB sync + graceful shutdown
│   │   ├── config/          # Environment config, DB, Redis connections
│   │   ├── common/
│   │   │   ├── middleware/  # Auth (JWT), rate-limit, validation, error handler
│   │   │   ├── database/models/  # 17 Sequelize models with associations
│   │   │   ├── cache/       # Redis get/set utility
│   │   │   ├── logger/      # Winston + daily rotation
│   │   │   └── utils/       # JWT, pagination, error classes, API response helpers
│   │   ├── modules/         # 15 feature modules
│   │   │   ├── auth/        # Login, register, JWT, refresh tokens
│   │   │   ├── user/        # Profile, addresses (CRUD)
│   │   │   ├── product/     # SPU/SKU, search, categories, recommendations
│   │   │   ├── cart/        # Shopping cart (add, update, delete)
│   │   │   ├── order/       # Orders (create, status, cancel)
│   │   │   ├── payment/     # Flutterwave, Paystack, CinetPay, QuikkPay, etc.
│   │   │   ├── store/       # Store profiles
│   │   │   ├── logistics/   # Shipping carriers, pricing
│   │   │   ├── collection/  # Favorites/wishlist
│   │   │   ├── banner/      # Homepage banners
│   │   │   ├── upload/      # OSS file upload (Alibaba Cloud)
│   │   │   ├── admin/       # Admin CRUD (categories, banners)
│   │   │   ├── im/          # Chat (Easemob WebIM)
│   │   │   ├── general/     # Countries, cities, verification codes, QR login
│   │   │   ├── onboarding/  # User onboarding data
│   │   │   └── share/       # Product sharing codes
│   │   └── routes/          # Route aggregator
│   ├── tests/
│   │   ├── unit/            # Unit tests (Jest)
│   │   └── integration/      # Integration tests (Supertest)
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml        # Full stack: frontend + api + postgres + redis
├── .github/workflows/       # CI/CD (lint → test → build → deploy)
├── .env.example              # All environment variables (frontend + backend)
└── SYSTEM_DESIGN.md          # Full system architecture document
```

---

## Quick Start

### Prerequisites

- **Node.js** 20.x (for frontend: use 16-20 — **Node 22+ may show deprecation warnings** for older Vue CLI dependencies)
- **Yarn** 1.x (required for frontend — do not use npm for install)
- **Docker Desktop** (for full stack)
- **PostgreSQL** 16 (if running backend locally)
- **Redis** 7 (if running backend locally)

### Frontend Only (development)

```bash
# Install dependencies
yarn install

# Copy environment file
cp .env.example .env.development   # and/or .env.production

# Start dev server on port 4500
yarn start
# Or: npx vue-cli-service serve --port 4500 --watch
```

### Backend Only (development)

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start with auto-reload
npm run dev
```

### Full Stack (Docker)

```bash
# Copy backend env file
cp backend/.env.example backend/.env
# Edit backend/.env with your settings

# Build and start all services
docker compose up -d --build

# Verify everything is running
curl http://localhost:80/health          # Frontend health
curl http://localhost:3000/health         # API health

# View logs
docker compose logs -f api               # API logs
docker compose logs -f frontend           # Frontend logs

# Stop everything
docker compose down

# Stop and remove volumes (destroys data)
docker compose down -v
```

---

## Docker Services

| Service | Port | Image | Purpose |
|---------|------|-------|---------|
| `frontend` | 80 | nginx:1.25-alpine | Vue SPA served via Nginx |
| `api` | 3000 | node:20-alpine | Express API server |
| `postgres` | 5432 | postgis/postgis:16 | Primary database |
| `redis` | 6379 | redis:7-alpine | Cache + sessions |

The Nginx config includes:
- Gzip compression + pre-compressed `.gz` file support
- Security headers (HSTS, X-Frame, X-Content-Type, XSS, Permissions-Policy)
- Static asset caching (1 year for JS/CSS, 30 days for images)
- API proxy to backend (`/api/` → `api:3000`)
- SPA fallback routing

---

## Key Features

### 🌍 Multi-Language
9 languages: English, Chinese, French, Spanish, Portuguese, Arabic, Russian, Persian, Hindi

### 💳 Payment Gateways
Flutterwave · Paystack · Stripe · PayPal · CinetPay · QuikkPay · PayDunya · Orange Money · Alipay · WeChat Pay

### 📦 E-Commerce
- Product catalog with SPU/SKU variants
- Shopping cart with persistence
- Order management (create, pay, track, cancel)
- Logistics carriers and pricing
- Product collections/favorites
- Address management (multi-country)

### 🔐 Authentication
- JWT-based auth (access + refresh tokens)
- bcrypt password hashing (cost factor 12)
- Role-based access (guest, buyer, seller, admin)
- Login via email/password or QR code
- Rate-limited auth endpoints
- Redis-backed sessions

### 🗺️ African Market SEO
8 zero-click SEO market pages with FAQPage, HowTo, and LocalBusiness schema markup:
- Guinea · Senegal · Ghana · Côte d'Ivoire · Cameroon · Sierra Leone · Kenya · Zimbabwe

### 🌍 African Market SEO
8 zero-click SEO-optimized market pages with structured data markup:
- `/guinea` · `/senegal` · `/ghana` · `/cote-divoire` · `/cameroon` · `/sierra-leone` · `/kenya` · `/zimbabwe`
- Each page includes: FAQPage, HowTo, LocalBusiness, BreadcrumbList schema
- Multi-language (French for Francophone markets, English for Anglophone)

### 🤖 AI Features (Hermes)
- Personalized product feed
- User preference tracking
- Intelligent product recommendations

### 📊 Analytics & Monitoring
- Google Analytics 4 (single consolidated tag)
- Sentry error tracking (frontend + backend)
- Winston structured logging with daily rotation
- Morgan HTTP request logging

---

## API Endpoints

All endpoints are POST, mounted under `/api/v2/`.

### Public (No Auth Required)
| Endpoint | Description |
|----------|-------------|
| `POST /api/v2/login` | User login (rate-limited) |
| `POST /api/v2/register` | User registration (rate-limited) |
| `POST /api/v2/forget` | Forgot password |
| `POST /api/v2/addVerifyCode` | Send verification code |
| `POST /api/v2/getCategoryList` | Get category tree |
| `POST /api/v2/getBannerList` | Get active banners |
| `POST /api/v2/getSpuList` | List/search products |
| `POST /api/v2/getSpu` | Product detail |
| `POST /api/v2/searchSpu` | Search products |
| `POST /api/v2/getStore` | Get store detail |
| `POST /api/v2/geCountryV2List` | List countries |
| `POST /api/v2/loginQRCode` | Get QR code for login |
| `POST /api/v2/loginCheckStatus` | Check QR scan status |
| `POST /api/v2/getExchateRateMap` | Get exchange rates |
| `POST /api/v2/getOssPolicyToken` | Get OSS upload token |

### Authenticated (Auth Required)
| Endpoint | Description |
|----------|-------------|
| `POST /api/v2/getCartList` | Get cart items |
| `POST /api/v2/upsertCartList` | Add/update cart |
| `POST /api/v2/addOrderV2` | Create order |
| `POST /api/v2/checkOrder` | Initiate payment |
| `POST /api/v2/getPayStatus` | Check payment status |
| `POST /api/v2/addUserAddress` | Add shipping address |
| `POST /api/v2/getUserAddressList` | List addresses |
| `POST /api/v2/editUserAddress` | Edit address |
| `POST /api/v2/delUserAddress` | Delete address |
| `POST /api/v2/addUserLogistics` | Add logistics company |
| `POST /api/v2/getUserLogistics` | List logistics companies |
| `POST /api/v2/getOrderListbyStatus` | List orders by status |
| `POST /api/v2/getOrderDetail` | Get order detail |
| `POST /api/v2/canceOrder` | Cancel order |
| `POST /api/v2/addSpuCollection` | Add product to favorites |
| `POST /api/v2/delSpuCollection` | Remove from favorites |
| `POST /api/v2/getSpuCollectionList` | List favorites |
| `POST /api/v2/idCardCheck` | ID card verification |
| `POST /api/v2/smsSend` | Send SMS verification |
| `POST /api/v2/smsVerify` | Verify SMS code |
| `POST /api/v2/onboarding/submit` | Submit onboarding data |

### Admin (Requires Admin Role)
| Endpoint | Description |
|----------|-------------|
| `POST /api/v2/addModCategorybyAdmin` | Create category |
| `POST /api/v2/editModCategorybyAdmin` | Edit category |
| `POST /api/v2/delModCategorybyAdmin` | Delete category |
| `POST /api/v2/editBannerbyAdmin` | Edit banner |
| `POST /api/v2/delBannerbyAdmin` | Delete banner |

### Standard Response Format
```json
// Success
{ "errcode": 0, "errmsg": "success", "data": { ... } }

// Success with pagination
{ "errcode": 0, "errmsg": "success", "data": { "rows": [...], "total": 100, "page": 1, "pageSize": 20 } }

// Error
{ "errcode": 40001, "errmsg": "Validation failed", "data": null }

// Token expired (frontend auto-redirects to login)
{ "errcode": 707, "errmsg": "Token expired" }
```

---

## Environment Variables

See [`.env.example`](./.env.example) for the complete list with documentation.

Key variables:
- `VUE_APP_V2_API_URL` — Backend API URL (frontend uses this)
- `DB_HOST` / `DB_PASSWORD` — PostgreSQL connection
- `REDIS_HOST` / `REDIS_PASSWORD` — Redis connection
- `JWT_SECRET` — JWT signing key (change in production!)
- `FLUTTERWAVE_SECRET_KEY` — Payment gateway secrets
- `SENTRY_DSN` — Error tracking
- `VUE_APP_GA_MEASUREMENT_ID` — Google Analytics

---

## Environment Strategy

| Environment | Domain | Purpose | Deploy Trigger |
|-------------|--------|---------|---------------|
| **Development** | `localhost:4500` | Local coding | Manual |
| **Staging** | `staging.sokogate.com` | QA testing | Push to `develop` |
| **Production** | `sokogate.com` | Live | Push to `main` |

---

## CI/CD

Located in `.github/workflows/ci.yml`:

| Job | Description |
|-----|-------------|
| `lint` | ESLint check |
| `build` | Production build |
| `security-audit` | npm/yarn audit |

**Branch strategy:** GitFlow Simplified
- `main` → production (protected, requires PR)
- `develop` → integration (protected, requires PR)
- `feature/*` → branch from develop

---

## Scripts

### Frontend
```bash
yarn start              # Dev server on port 4500
yarn build              # Production build → dist/
yarn build:test         # Test build
yarn lint               # ESLint
yarn generate-sitemap   # Generate SEO sitemap
```

### Backend
```bash
npm run dev             # Dev server with auto-reload
npm start               # Production start
npm test                # Run all tests
npm run test:coverage   # Tests with coverage report
npm run migrate         # Run DB migrations
npm run seed            # Seed database
npm run lint            # ESLint
```

---

## Troubleshooting

### Frontend: `$store` / undefined errors
- **Token auth state:** checkout/order APIs require `auth_token` in localStorage
- **Menu state:** `GetCategoryLists` must return data for navigation to work
- **Locale mismatch:** Category names must match i18n keys (e.g., `category.Vehicle`)

### Frontend: Images missing / clicks not working
- Backend API must return populated product/category rows
- Empty database = empty UI (no products displayed)

### Docker: Port conflicts
- Stop local PostgreSQL/Redis before `docker compose up`
- Or change port mappings in `docker-compose.yml`

### Docker: Permission issues
- On Linux, ensure user has docker group access
- On Windows/Mac, ensure Docker Desktop is running

### Backend: Database connection refused
- Ensure PostgreSQL is running (check `docker compose ps` or local service)
- Verify credentials in `backend/.env`

### Frontend: npm scripts approval errors
If you see `npm approve-scripts --allow-scripts-pending` errors, ensure `package.json` has the correct `allowScripts` entry matching installed versions.

### Mobile Navigation
The mobile layout uses a hamburger button at the bottom-left to open a drawer. Tapping any category row navigates to the filtered product list.

---

## Full Architecture Reference

For the complete system architecture covering all 14 domains (system design, architecture, frontend, backend, auth, hosting, CI/CD, security, rate limiting, caching, error tracking, monitoring, testing, and scaling), see:

**[📄 SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md)**

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Vue | 2.7.16 | UI framework |
| Vue CLI | 5.x | Build tooling |
| Vue Router | 3.x | Client-side routing |
| Vuex | 4.x | State management |
| Element UI | 2.x | UI component library |
| Bootstrap Vue | 1.5 | Responsive layout |
| vue-i18n | 8.x | Internationalization |
| Axios | 1.x | HTTP client |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20 LTS | Runtime |
| Express | 4.x | Web framework |
| Sequelize | 6.x | ORM |
| PostgreSQL | 16 | Database |
| Redis | 7 | Cache + sessions |
| JWT | 9.x | Authentication |
| Joi | 17.x | Request validation |
| Winston | 3.x | Logging |
| Jest | 29.x | Testing |
| Supertest | 7.x | HTTP testing |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-service orchestration |
| Nginx | Reverse proxy + static serving |
| GitHub Actions | CI/CD |
| Alibaba Cloud OSS | Media storage |
| Cloudflare (recommended) | CDN + WAF + DNS |

---

## License

Private — Sokogate internal project.
