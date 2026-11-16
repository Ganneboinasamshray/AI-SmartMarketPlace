-- ============================================================================
-- SMART FARMER MARKETPLACE - POSTGRESQL RELATIONAL SCHEMA
-- ============================================================================

-- Drop existing tables if re-initializing
DROP TABLE IF EXISTS verification_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS price_predictions CASCADE;
DROP TABLE IF EXISTS historical_market_prices CASCADE;
DROP TABLE IF EXISTS farmer_price_listings CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS agent_assignments CASCADE;
DROP TABLE IF EXISTS farmer_verifications CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS farmers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ROLE_FARMER', 'ROLE_AGENT', 'ROLE_ADMIN', 'ROLE_BUYER')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 2. FARMERS TABLE
CREATE TABLE farmers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(150) NOT NULL,
    farm_location VARCHAR(200) NOT NULL,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    farm_size_acres DECIMAL(6, 2) NOT NULL,
    primary_crops VARCHAR(255) NOT NULL,
    kisan_credit_card_no VARCHAR(50),
    aadhaar_hash VARCHAR(64),
    land_document_url VARCHAR(500),
    verification_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'ASSIGNED', 'APPROVED', 'REJECTED')),
    assigned_agent_id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_farmers_verification_status ON farmers(verification_status);

-- 3. AGENTS TABLE
CREATE TABLE agents (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    badge_number VARCHAR(50) NOT NULL UNIQUE,
    assigned_region VARCHAR(100) NOT NULL,
    total_verifications INT NOT NULL DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 5.0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ADMINS TABLE
CREATE TABLE admins (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    department VARCHAR(100) NOT NULL,
    access_level VARCHAR(30) NOT NULL DEFAULT 'SUPER_ADMIN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. FARMER VERIFICATIONS TABLE
CREATE TABLE farmer_verifications (
    id BIGSERIAL PRIMARY KEY,
    farmer_id BIGINT NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    agent_id BIGINT NOT NULL REFERENCES agents(id),
    physical_visit_date DATE,
    land_records_verified BOOLEAN NOT NULL DEFAULT FALSE,
    crop_cultivation_verified BOOLEAN NOT NULL DEFAULT FALSE,
    identity_proof_verified BOOLEAN NOT NULL DEFAULT FALSE,
    genuine_farmer_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    photo_evidence_url VARCHAR(500),
    gps_coordinates_verified VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    agent_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. AGENT ASSIGNMENTS TABLE
CREATE TABLE agent_assignments (
    id BIGSERIAL PRIMARY KEY,
    agent_id BIGINT NOT NULL REFERENCES agents(id),
    farmer_id BIGINT NOT NULL REFERENCES farmers(id),
    assigned_by_admin_id BIGINT REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'ASSIGNED' CHECK (status IN ('ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'REASSIGNED')),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 7. PRODUCT CATEGORIES TABLE
CREATE TABLE product_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    slug VARCHAR(80) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500)
);

-- 8. PRODUCTS TABLE
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    farmer_id BIGINT NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES product_categories(id),
    crop_name VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    quantity_kg DECIMAL(10, 2) NOT NULL,
    min_order_kg DECIMAL(8, 2) NOT NULL DEFAULT 5.0,
    price_per_kg DECIMAL(8, 2) NOT NULL,
    quality_grade VARCHAR(20) NOT NULL DEFAULT 'Grade A' CHECK (quality_grade IN ('Grade A', 'Grade B', 'Export Quality')),
    harvest_date DATE NOT NULL,
    shelf_life_days INT DEFAULT 7,
    is_organic BOOLEAN NOT NULL DEFAULT FALSE,
    image_url VARCHAR(500),
    farm_location VARCHAR(200) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'LOW_STOCK', 'OUT_OF_STOCK', 'DELISTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_crop_name ON products(crop_name);
CREATE INDEX idx_products_farmer_id ON products(farmer_id);
CREATE INDEX idx_products_status ON products(status);

-- 9. FARMER PRICE LISTINGS (Audit & Comparison with ML Predictions)
CREATE TABLE farmer_price_listings (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    farmer_id BIGINT NOT NULL REFERENCES farmers(id),
    crop_name VARCHAR(100) NOT NULL,
    proposed_price DECIMAL(8, 2) NOT NULL,
    predicted_market_price DECIMAL(8, 2) NOT NULL,
    recommended_min_price DECIMAL(8, 2) NOT NULL,
    recommended_max_price DECIMAL(8, 2) NOT NULL,
    pricing_status VARCHAR(30) NOT NULL, -- UNDERPRICED, FAIR_MARKET, OVERPRICED
    price_difference_pct DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. HISTORICAL MARKET PRICES TABLE
CREATE TABLE historical_market_prices (
    id BIGSERIAL PRIMARY KEY,
    commodity VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    market VARCHAR(100) NOT NULL,
    region VARCHAR(50) NOT NULL,
    modal_price DECIMAL(8, 2) NOT NULL,
    min_price DECIMAL(8, 2) NOT NULL,
    max_price DECIMAL(8, 2) NOT NULL,
    arrival_quintals DECIMAL(10, 2) NOT NULL,
    rainfall_mm DECIMAL(6, 2),
    temperature_c DECIMAL(5, 2),
    price_date DATE NOT NULL
);

CREATE INDEX idx_historical_commodity_market_date ON historical_market_prices(commodity, market, price_date);

-- 11. PRICE PREDICTIONS CACHE TABLE
CREATE TABLE price_predictions (
    id BIGSERIAL PRIMARY KEY,
    commodity VARCHAR(100) NOT NULL,
    market VARCHAR(100) NOT NULL,
    forecast_horizon_days INT NOT NULL,
    avg_predicted_price DECIMAL(8, 2) NOT NULL,
    trend VARCHAR(20) NOT NULL,
    confidence_score DECIMAL(5, 2) NOT NULL,
    recommended_min_price DECIMAL(8, 2) NOT NULL,
    recommended_max_price DECIMAL(8, 2) NOT NULL,
    forecast_json TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. ORDERS TABLE
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    buyer_id BIGINT NOT NULL REFERENCES users(id),
    farmer_id BIGINT NOT NULL REFERENCES farmers(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    special_instructions TEXT,
    order_status VARCHAR(30) NOT NULL DEFAULT 'PLACED' CHECK (order_status IN ('PLACED', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED')),
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'REFUNDED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_farmer_id ON orders(farmer_id);
CREATE INDEX idx_orders_status ON orders(order_status);

-- 13. ORDER ITEMS TABLE
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity_kg DECIMAL(8, 2) NOT NULL,
    unit_price DECIMAL(8, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL
);

-- 14. PAYMENTS TABLE
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL, -- UPI, NetBanking, Card, CashOnDelivery
    transaction_reference VARCHAR(100) UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(40) NOT NULL DEFAULT 'INFO',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. VERIFICATION LOGS TABLE (AUDIT TRAIL)
CREATE TABLE verification_logs (
    id BIGSERIAL PRIMARY KEY,
    farmer_id BIGINT NOT NULL REFERENCES farmers(id),
    performed_by_id BIGINT NOT NULL REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- ASSIGNED, VISIT_COMPLETED, APPROVED, REJECTED, FLAGGED_MIDDLEMAN
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_verif_logs_farmer_id ON verification_logs(farmer_id);
