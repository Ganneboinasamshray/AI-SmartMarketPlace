# 🌾 Smart Farmer Marketplace

> **Empowering genuine farmers with direct-to-buyer sales, agent physical verification, and ML-driven agricultural price forecasting — eliminating middlemen from the Indian farm supply chain.**

---

## 📌 Project Overview

**Smart Farmer Marketplace** is a production-grade full-stack platform that connects verified farmers directly with buyers using a 3-tier trust model:

1. **Agent-Based Physical Verification** — Field agents inspect land records, Aadhaar, Kisan Credit Cards, and perform on-site farm visits. Middlemen are detected and rejected automatically.
2. **ML Price Intelligence Engine** — Trained on 92,500+ real mandi price records using Random Forest & XGBoost (R² = 0.9974, MAE < ₹1.00/kg). Generates 7–30 day price forecasts with confidence bands.
3. **Direct Farmer-to-Buyer Marketplace** — Verified farmer badges, WhatsApp/phone contact, cart management, and full order workflow.

---

## 🏗️ Architecture

```
smart-farmer-marketplace/
├── ml-service/                    # Python 3.12 · FastAPI · scikit-learn · XGBoost
│   ├── data/                      # 92,508-record historical mandi price dataset
│   ├── models/                    # Serialized RF & XGBoost models + metadata.json
│   ├── generate_dataset.py        # Synthetic mandi data generator (13 crops × 6 markets)
│   ├── train_models.py            # Feature engineering, lag computation, training pipeline
│   ├── main.py                    # FastAPI REST API (5 endpoints)
│   ├── test_ml_service.py         # 13 pytest integration tests
│   └── requirements.txt
│
├── backend-spring-boot/           # Java 17 · Spring Boot 3.2 · PostgreSQL · JWT
│   └── src/main/java/com/smartfarmer/marketplace/
│       ├── controller/            # 7 controllers: Auth, Farmer, Agent, Admin, ...
│       ├── service/               # Business logic + ML client service (with fallback)
│       ├── entity/                # 15 JPA entities
│       ├── repository/            # Spring Data JPA repositories
│       ├── security/              # JWT + UserDetailsService + role-based auth
│       └── config/                # CORS, Security filter chain
│
├── web-frontend/                  # Next.js 14 · React 18 · Tailwind CSS · Recharts
│   ├── app/                       # Next.js App Router pages
│   ├── components/                # 8 dashboard/UI components
│   └── lib/                       # TypeScript types, API helpers, seed data
│
├── mobile-app/                    # React Native · Expo
│   └── src/screens/               # Marketplace, Farmer, Agent, Analytics screens
│
├── database/
│   ├── schema.sql                 # PostgreSQL DDL (16 tables, indexes, constraints)
│   ├── seed.sql                   # Sample data (users, products, verifications, orders)
│   └── sqlite_schema.sql          # Zero-dependency local dev schema
│
├── docker/
│   ├── docker-compose.yml         # Multi-container: Postgres, ML, Backend, Frontend, Redis
│   └── .env.example               # Environment variable template
│
├── run_all.bat                    # Windows: starts ML service + frontend
├── run_all.ps1                    # PowerShell orchestrator
└── README.md                      # This file
```

---

## 🚀 Quick Start (No Docker Required)

### Prerequisites

| Tool | Required Version | Install |
|------|-----------------|---------|
| Python | 3.10+ | [python.org](https://python.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| Java JDK | 17 or 21 | [adoptium.net](https://adoptium.net/temurin/releases/) |
| Maven | 3.8+ | [maven.apache.org](https://maven.apache.org/download.cgi) |
| PostgreSQL | 14+ | [postgresql.org](https://postgresql.org) |

> **Minimum working setup (no DB/Java required):** Python + Node.js is enough to run the ML service and web frontend with in-memory state.

---

### Step 1 — ML Prediction Service (FastAPI)

```bash
cd ml-service

# Install Python dependencies
pip install -r requirements.txt

# Models are already trained — skip training if models/ folder exists
# To retrain from scratch:
python generate_dataset.py
python train_models.py

# Start the ML API server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

| Endpoint | Description |
|---|---|
| `GET /health` | Service status + model info |
| `GET /commodities` | Supported crops and markets |
| `POST /predict-price` | 7–60 day price forecast |
| `POST /compare-price` | FAIR / UNDER / OVERPRICED verdict |
| `GET /historical-analytics` | Historical mandi trends |

- **Swagger UI:** http://localhost:8000/docs
- **Health check:** http://localhost:8000/health

**Run Tests:**
```bash
cd ml-service
python -m pytest test_ml_service.py -v
```

---

### Step 2 — Spring Boot Backend

> **Requires:** JDK 17+, Maven 3.8+, and a running PostgreSQL instance.

```bash
# 1. Create the database
psql -U postgres -c "CREATE DATABASE smartfarmer_db;"
psql -U postgres -d smartfarmer_db -f database/schema.sql
psql -U postgres -d smartfarmer_db -f database/seed.sql

# 2. Configure connection in backend-spring-boot/src/main/resources/application.yml
#    (default: postgres://localhost:5432/smartfarmer_db, user=postgres, pass=postgres)

# 3. Build and run
cd backend-spring-boot
mvn spring-boot:run
```

- **REST API Base:** http://localhost:8080/api
- **Swagger UI:** http://localhost:8080/swagger-ui.html

**Java / Maven Setup Links:**
- Download JDK 17: https://adoptium.net/temurin/releases/?version=17
- Download Maven 3.9: https://maven.apache.org/download.cgi

---

### Step 3 — Web Frontend (Next.js)

```bash
cd web-frontend

# Install dependencies (requires internet)
npm install

# Start development server
npm run dev
```

- **Web App:** http://localhost:3000

**Build for production:**
```bash
npm run build
npm start
```

**Environment variables** (`web-frontend/.env.local`):
```env
NEXT_PUBLIC_ML_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080/api
```

---

### Step 4 — Mobile App (React Native / Expo)

```bash
cd mobile-app
npm install
npx expo start

# Scan QR code with Expo Go app on Android/iOS
```

---

## 🐳 Docker Compose (All Services at Once)

> Requires Docker Desktop installed.

```bash
# Copy env file and configure
cp docker/.env.example docker/.env

# Build and start everything
docker-compose -f docker/docker-compose.yml up --build

# Access:
#   Web Frontend:  http://localhost:3000
#   Backend API:   http://localhost:8080/api
#   ML Service:    http://localhost:8000
#   Swagger UI:    http://localhost:8080/swagger-ui.html
```

---

## 👥 Demo Accounts

| Role | Email | Password | Capabilities |
|------|-------|----------|-------------|
| **Admin** | `admin@smartfarmer.com` | `Admin@123` | System overview, agent assignment, analytics |
| **Field Agent** | `vikram.agent@smartfarmer.com` | `Agent@123` | Verify farmers, detect middlemen, approve/reject |
| **Verified Farmer** | `ramesh.farmer@smartfarmer.com` | `Farmer@123` | List produce, ML price advisor, manage orders |
| **Pending Farmer** | `suresh.farmer@smartfarmer.com` | `Farmer@123` | Under review — cannot list yet |
| **Buyer** | `priya.buyer@smartfarmer.com` | `Buyer@123` | Browse marketplace, add to cart, place orders |

> **Note:** The web frontend supports quick role-switching via the top navbar — no login required for demo purposes.

---

## 🔑 Key Features

### 🛡️ Agent Verification Workflow

```
Farmer Registers → Submits Documents
        ↓
Admin Assigns Agent → Agent Schedules Field Visit
        ↓
Agent Checks: [Land Records] [Aadhaar] [Physical Crops] [Location GPS]
        ↓
     ┌──────┴──────┐
  APPROVED       REJECTED (middleman detected)
     ↓                 ↓
Can List Produce    Blacklisted + Notified
```

### 🤖 ML Price Advisor

The price prediction pipeline:

1. **Feature Engineering:** 20 features — commodity/market IDs, lag prices (1/7/14/30 day), rolling statistics, seasonal harmonics (sin/cos), weather, demand scores.
2. **Training:** Time-based train/test split, Random Forest (best R² = 0.9974) + XGBoost ensemble.
3. **Inference:** Auto-loads from serialized `.joblib` model on startup; generates day-by-day predictions with expanding confidence intervals.
4. **Fallback:** If ML service is offline, `MlClientService.java` returns a statistical fallback using 30-day commodity averages.

### 🛒 Marketplace Flow

```
Browse Verified Products
        ↓
Contact Farmer (WhatsApp / Call) OR Add to Cart
        ↓
Cart Review → Delivery Address → Payment Method
        ↓
Order Placed → Farmer Notified → Status: CONFIRMED → DISPATCHED → DELIVERED
```

---

## 🔌 REST API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login → JWT token |

### Farmer Portal
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/PUT | `/api/farmer/profile` | View/update farm profile |
| GET/POST | `/api/farmer/products` | List own products / add product |
| POST | `/api/farmer/consult-price` | Get ML price advice |
| GET/PATCH | `/api/farmer/orders` | View/update order status |

### Agent Portal
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agent/pending-verifications` | Queue of pending farmers |
| POST | `/api/agent/verify` | Submit verification decision |

### Admin Portal
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/overview` | KPIs dashboard |
| POST | `/api/admin/assign-agent` | Assign agent to farmer |
| GET | `/api/admin/verification-logs` | Full audit trail |

### Marketplace (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/marketplace/products` | All verified products |
| GET | `/api/marketplace/products/{id}` | Single product detail |
| GET | `/api/marketplace/categories` | Product categories |

### Orders & Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place new order |
| GET | `/api/orders/my-orders` | Buyer's order history |
| GET | `/api/notifications` | Current user notifications |
| PATCH | `/api/notifications/{id}/read` | Mark notification as read |
| PATCH | `/api/notifications/mark-all-read` | Mark all as read |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/price-trends` | Historical price chart data |
| GET | `/api/analytics/forecast` | ML forecast data |

---

## 🗄️ Database Schema

16 PostgreSQL tables:

```
users → farmers / agents / admins
     → farmer_verifications → agent_assignments → verification_logs
     → products (via farmers) → product_categories
     → orders → order_items → payments
     → notifications
     → farmer_price_listings
     → historical_market_prices / price_predictions
```

For local dev without PostgreSQL, use the SQLite schema:
```bash
sqlite3 smartfarmer_local.db < database/sqlite_schema.sql
```

---

## 🧪 Testing

```bash
# ML Service (13 integration tests)
cd ml-service
python -m pytest test_ml_service.py -v

# Spring Boot Backend
cd backend-spring-boot
mvn test   # Uses H2 in-memory DB (see src/test/resources/application-test.yml)
```

---

## 🤝 Contributing

1. Fork the repo and create a feature branch
2. Run tests before submitting a PR
3. Follow Java/TypeScript/Python style guides in each service
4. For ML changes, always retrain and include new model metrics in your PR

---

## 📄 License

MIT — Free for educational and commercial use.

---

*Built with ❤️ to empower India's 140 million farming families.*
