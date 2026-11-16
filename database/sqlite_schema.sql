-- ============================================================
-- Smart Farmer Marketplace — SQLite Schema
-- For local zero-dependency development and testing.
-- Compatible with SQLite 3.x (no PostgreSQL-specific types).
-- ============================================================

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- ─────────────────── Core User Table ────────────────────────

CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT NOT NULL,
    email           TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    phone           TEXT,
    role            TEXT NOT NULL CHECK(role IN ('FARMER','AGENT','ADMIN','BUYER')),
    is_active       INTEGER NOT NULL DEFAULT 1,
    profile_pic_url TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────── Farmers ────────────────────────────────

CREATE TABLE IF NOT EXISTS farmers (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id             INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    farm_name           TEXT NOT NULL,
    location            TEXT NOT NULL,
    state               TEXT NOT NULL,
    district            TEXT,
    pincode             TEXT,
    land_area_acres     REAL DEFAULT 0,
    crops_grown         TEXT,            -- comma-separated
    farm_description    TEXT,
    is_verified         INTEGER NOT NULL DEFAULT 0,
    verification_status TEXT NOT NULL DEFAULT 'PENDING'
        CHECK(verification_status IN ('PENDING','UNDER_REVIEW','APPROVED','REJECTED')),
    rejection_reason    TEXT,
    middleman_flag      INTEGER NOT NULL DEFAULT 0,
    aadhar_number       TEXT,
    bank_account        TEXT,
    ifsc_code           TEXT,
    created_at          TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────── Agents ─────────────────────────────────

CREATE TABLE IF NOT EXISTS agents (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id                 INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    employee_id             TEXT NOT NULL UNIQUE,
    zone                    TEXT NOT NULL,
    total_verifications     INTEGER NOT NULL DEFAULT 0,
    approved_count          INTEGER NOT NULL DEFAULT 0,
    rejected_count          INTEGER NOT NULL DEFAULT 0,
    is_active               INTEGER NOT NULL DEFAULT 1,
    created_at              TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────── Admins ─────────────────────────────────

CREATE TABLE IF NOT EXISTS admins (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    employee_id TEXT NOT NULL UNIQUE,
    department  TEXT NOT NULL DEFAULT 'Operations',
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────── Farmer Verifications ───────────────────

CREATE TABLE IF NOT EXISTS farmer_verifications (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id               INTEGER NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    assigned_agent_id       INTEGER REFERENCES agents(id),
    status                  TEXT NOT NULL DEFAULT 'PENDING'
        CHECK(status IN ('PENDING','ASSIGNED','SITE_VISITED','APPROVED','REJECTED')),
    visit_date              TEXT,
    crops_verified          INTEGER DEFAULT 0,
    land_size_verified      INTEGER DEFAULT 0,
    documents_verified      INTEGER DEFAULT 0,
    location_verified       INTEGER DEFAULT 0,
    agent_notes             TEXT,
    rejection_reason        TEXT,
    is_middleman_detected   INTEGER NOT NULL DEFAULT 0,
    middleman_evidence      TEXT,
    submitted_at            TEXT NOT NULL DEFAULT (datetime('now')),
    reviewed_at             TEXT,
    approved_at             TEXT
);

-- ─────────────────── Agent Assignments ──────────────────────

CREATE TABLE IF NOT EXISTS agent_assignments (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id        INTEGER NOT NULL REFERENCES agents(id),
    farmer_id       INTEGER NOT NULL REFERENCES farmers(id),
    assigned_by     INTEGER NOT NULL REFERENCES admins(id),
    assigned_at     TEXT NOT NULL DEFAULT (datetime('now')),
    due_date        TEXT,
    priority        TEXT NOT NULL DEFAULT 'NORMAL'
        CHECK(priority IN ('LOW','NORMAL','HIGH','URGENT')),
    status          TEXT NOT NULL DEFAULT 'PENDING'
        CHECK(status IN ('PENDING','IN_PROGRESS','COMPLETED','OVERDUE'))
);

-- ─────────────────── Product Categories ─────────────────────

CREATE TABLE IF NOT EXISTS product_categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url    TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────── Products ───────────────────────────────

CREATE TABLE IF NOT EXISTS products (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id           INTEGER NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    category_id         INTEGER NOT NULL REFERENCES product_categories(id),
    name                TEXT NOT NULL,
    description         TEXT,
    price_per_kg        REAL NOT NULL,
    ml_suggested_price  REAL,
    quantity_kg         REAL NOT NULL DEFAULT 0,
    unit                TEXT NOT NULL DEFAULT 'kg',
    image_url           TEXT,
    is_organic          INTEGER NOT NULL DEFAULT 0,
    is_active           INTEGER NOT NULL DEFAULT 1,
    harvest_date        TEXT,
    expiry_date         TEXT,
    created_at          TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────── Farmer Price Listings ──────────────────

CREATE TABLE IF NOT EXISTS farmer_price_listings (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id       INTEGER NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    product_id      INTEGER REFERENCES products(id),
    commodity       TEXT NOT NULL,
    market          TEXT NOT NULL,
    proposed_price  REAL NOT NULL,
    ml_fair_price   REAL,
    ml_status       TEXT,   -- UNDERPRICED | FAIR_MARKET | OVERPRICED
    is_active       INTEGER NOT NULL DEFAULT 1,
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────── Historical Market Prices ───────────────

CREATE TABLE IF NOT EXISTS historical_market_prices (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    commodity           TEXT NOT NULL,
    market              TEXT NOT NULL,
    price_date          TEXT NOT NULL,
    modal_price         REAL NOT NULL,
    min_price           REAL NOT NULL,
    max_price           REAL NOT NULL,
    arrival_quintals    REAL,
    state               TEXT,
    created_at          TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(commodity, market, price_date)
);

-- ─────────────────── Price Predictions ──────────────────────

CREATE TABLE IF NOT EXISTS price_predictions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    commodity       TEXT NOT NULL,
    market          TEXT NOT NULL,
    prediction_date TEXT NOT NULL,
    predicted_price REAL NOT NULL,
    lower_bound     REAL,
    upper_bound     REAL,
    model_name      TEXT NOT NULL DEFAULT 'RandomForest',
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────── Orders ─────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    buyer_id            INTEGER NOT NULL REFERENCES users(id),
    total_amount        REAL NOT NULL,
    status              TEXT NOT NULL DEFAULT 'PENDING'
        CHECK(status IN ('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED')),
    delivery_address    TEXT NOT NULL,
    delivery_city       TEXT,
    delivery_pincode    TEXT,
    payment_method      TEXT,
    notes               TEXT,
    created_at          TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────── Order Items ────────────────────────────

CREATE TABLE IF NOT EXISTS order_items (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id        INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id      INTEGER NOT NULL REFERENCES products(id),
    farmer_id       INTEGER NOT NULL REFERENCES farmers(id),
    quantity_kg     REAL NOT NULL,
    price_per_kg    REAL NOT NULL,
    total_price     REAL NOT NULL,
    status          TEXT NOT NULL DEFAULT 'PENDING'
        CHECK(status IN ('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'))
);

-- ─────────────────── Payments ────────────────────────────────

CREATE TABLE IF NOT EXISTS payments (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id        INTEGER NOT NULL REFERENCES orders(id),
    amount          REAL NOT NULL,
    payment_method  TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'PENDING'
        CHECK(status IN ('PENDING','PROCESSING','SUCCESS','FAILED','REFUNDED')),
    transaction_id  TEXT,
    paid_at         TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────── Notifications ──────────────────────────

CREATE TABLE IF NOT EXISTS notifications (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    message     TEXT NOT NULL,
    type        TEXT NOT NULL DEFAULT 'INFO'
        CHECK(type IN ('INFO','SUCCESS','WARNING','ALERT')),
    is_read     INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────── Verification Logs ──────────────────────

CREATE TABLE IF NOT EXISTS verification_logs (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    verification_id     INTEGER NOT NULL REFERENCES farmer_verifications(id),
    agent_id            INTEGER REFERENCES agents(id),
    action              TEXT NOT NULL,
    old_status          TEXT,
    new_status          TEXT,
    notes               TEXT,
    created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────── Indexes ────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_farmers_verification_status ON farmers(verification_status);
CREATE INDEX IF NOT EXISTS idx_products_farmer ON products(farmer_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_hist_prices_commodity ON historical_market_prices(commodity, market);
CREATE INDEX IF NOT EXISTS idx_hist_prices_date ON historical_market_prices(price_date);

-- ─────────────────── Seed Data ───────────────────────────────

-- Product categories
INSERT OR IGNORE INTO product_categories(name, description) VALUES
  ('Vegetables', 'Fresh farm vegetables'),
  ('Fruits', 'Fresh farm fruits'),
  ('Grains', 'Cereals, pulses and grains');

-- Admin user (password: Admin@1234)
INSERT OR IGNORE INTO users(id, name, email, password_hash, phone, role) VALUES
  (1, 'Admin User', 'admin@smartfarmer.com',
   '$2a$10$dummyHashForAdmin', '9000000001', 'ADMIN');

INSERT OR IGNORE INTO admins(user_id, employee_id, department) VALUES
  (1, 'ADM-001', 'Platform Operations');

-- Agent (password: Agent@1234)
INSERT OR IGNORE INTO users(id, name, email, password_hash, phone, role) VALUES
  (2, 'Rajan Kumar', 'agent1@smartfarmer.com',
   '$2a$10$dummyHashForAgent1', '9000000002', 'AGENT');

INSERT OR IGNORE INTO agents(user_id, employee_id, zone) VALUES
  (2, 'AGT-001', 'North India');

-- Verified Farmer (password: Farmer@1234)
INSERT OR IGNORE INTO users(id, name, email, password_hash, phone, role) VALUES
  (3, 'Ramesh Patel', 'farmer1@smartfarmer.com',
   '$2a$10$dummyHashForFarmer1', '9000000003', 'FARMER');

INSERT OR IGNORE INTO farmers(user_id, farm_name, location, state, district, land_area_acres,
  crops_grown, is_verified, verification_status)
VALUES (3, 'Patel Organic Farm', 'Nashik', 'Maharashtra', 'Nashik', 5.5,
  'Tomato,Onion,Potato', 1, 'APPROVED');

-- Buyer (password: Buyer@1234)
INSERT OR IGNORE INTO users(id, name, email, password_hash, phone, role) VALUES
  (4, 'Priya Sharma', 'buyer1@smartfarmer.com',
   '$2a$10$dummyHashForBuyer1', '9000000004', 'BUYER');
