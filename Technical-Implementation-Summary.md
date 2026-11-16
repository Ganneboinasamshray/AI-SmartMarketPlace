# TECHNICAL IMPLEMENTATION SUMMARY: AI SMART MARKETPLACE

## 1. Executive Project Summary
**AI Smart Marketplace** is an enterprise-grade agricultural e-commerce and price-intelligence platform designed to bridge the structural gap between rural horticultural farmers and retail consumers/aggregators across Telangana and neighboring Karnataka border regions. By replacing exploitative commission middlemen with an authenticated direct-trading network and machine-learning-driven price discovery, the system eliminates 30%–55% value erosion experienced by smallholder producers.

---

## 2. Technology Stack Architecture

| Layer | Framework / Technology | Language / Version | Primary Responsibility |
|---|---|---|---|
| **Frontend SPA** | Next.js 14.2 (App Router), React 18, Tailwind CSS | TypeScript 5.0 | Responsive UI, state management, modal interactions, cart drawer, charts |
| **Enterprise Backend** | Spring Boot 3.2.0, Spring Security 6, Spring Data JPA | Java 17 (OpenJDK) | JWT authentication, RBAC authorization, transaction processing, REST gateway |
| **ML Microservice** | FastAPI 0.109, Uvicorn ASGI, Scikit-learn 1.4 | Python 3.12.10 | Multi-step price forecasting, anomaly detection, mandi arbitrage analysis |
| **Relational Database** | PostgreSQL 15 / SQLite 3 | SQL (ACID) | Relational persistence, user roles, produce listings, orders, inspection logs |
| **Process Orchestration** | PowerShell 5.1 / Windows Batch Scripting | Shell Scripting | Single-command automated daemon boot (
un_all.bat / 
un_all.ps1) |

---

## 3. Multi-Tier Field Agent Physical Verification Protocol
To eliminate fraudulent commission brokers posing as farmers:
1. **Physical On-Site Audit**: Licensed Field Agents (e.g., Vikram Rathore, Badge AGT-TS-042) physically visit applicant farmlands.
2. **Geospatial & Dharani Validation**: Agents verify GPS coordinates (e.g., 17.3195 N, 78.5833 E) and cross-reference government **Pattadar Passbooks** against the official **Dharani Land Records Portal**.
3. **Role-Based Cryptographic Lock**: Farmers with PENDING verification status are cryptographically locked from publishing produce listings. Only after physical agent approval (STATUS_APPROVED) are publication privileges unlocked.

---

## 4. Machine Learning Price Forecasting Engine
- **Underlying Model**: Optimized Random Forest Regressor (100 estimators, max depth 20).
- **Dataset Size**: **92,508 records** spanning 2018–2026 across major wholesale APMC centers (Bowenpally, Gudimalkapur, L.B. Nagar, Kolar).
- **Engineered Feature Space (20 Dimensions)**:
  - Autoregressive price lags: 1-day, 7-day, 14-day, 30-day lags.
  - Rolling volatility metrics: 7-day and 30-day rolling means and standard deviations.
  - Cyclical temporal transforms: Day-of-year and month sine/cosine encodings.
  - Environmental & market variables: Daily arrival volumes (quintals) and localized precipitation.
- **Empirical Held-Out Validation Metrics**:
  - **Root Mean Squared Error (RMSE)**: **1.5107 Rs/kg**
  - **Mean Absolute Error (MAE)**: **0.9949 Rs/kg**
  - **Coefficient of Determination (^2$)**: **0.9974** (99.74% variance explained)
  - **Mean Absolute Percentage Error (MAPE)**: **2.45%**

---

## 5. Verified Horticultural Catalog (20 Regional Crops)
The catalog strictly curates 20 authentic fresh fruits and vegetables with zero missing or hotlinked images:
1. **Vegetables (15)**: Tomato, Red Onion, Potato, Green Chilli, Ginger, Garlic, Lady Finger, Brinjal, Cabbage, Cauliflower, Capsicum, Carrot, Bottle Gourd, Bitter Gourd, Cucumber, Green Beans.
2. **Fresh Fruits (5)**: Banana (Robusta), Pomegranate, Papaya, Guava, Watermelon.
- All product images are optimized local JPEGs stored in /public/images/products/.
- Minimum order quantity enforced at **2.0 kg**, with dynamic wholesale scaling up to full available harvest yield.

---

## 6. Functional & Integration Test Summary (100% Pass Rate)
- **T01: Farmer Authentication**: Mallesh Goud demo credentials successfully log in and route to /farmer.
- **T02: Agent Authentication**: Agent Rathore demo credentials log in and route to /agent.
- **T03: Broker Rejection**: Commercial yard shed application detected and marked REJECTED.
- **T04: Produce Publication**: 2,000 kg Tomatoes successfully published with ML auto-fill price.
- **T05: Verification Lock**: Unverified farmers attempting to publish are blocked with HTTP 403 Forbidden.
- **T06: ML Price Auto-Fill**: Real-time FastAPI inference returns recommended price in 32ms.
- **T07: Asset Integrity**: All 20 produce images return HTTP 200 OK without errors.
- **T08–T09: Order Limits**: Cart clamps quantities between 2.0 kg minimum and harvest stock maximum.
- **T10: COD Checkout**: Cash on Delivery order 503 successfully placed with itemized receipt.
- **T11–T12: Route Guarding & Logout**: Unauthorized tab switching blocked; session logout clears state.

---

## 7. Deliverable Artifacts Index
1. AI-Smart-Marketplace-Final-Report.docx: Complete university-level capstone project report formatted according to SR University guidelines.
2. AI-Smart-Marketplace-Final-Report.pdf: Pixel-perfect PDF conversion generated via native Microsoft Word automation.
3. Project-Screenshots/: 12 high-resolution screenshots capturing live application workflows.
4. Project-Diagrams/: 13 architectural, UML, DFD, ER, and analytical diagrams.
5. Testing-Results/: Machine learning metrics, test matrix CSV, and automated test execution logs.
