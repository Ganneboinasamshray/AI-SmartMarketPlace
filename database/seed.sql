-- ============================================================================
-- SMART FARMER MARKETPLACE - SEED DATA
-- Default Passwords for testing:
-- Farmer: Farmer@123 ($2a$10$wLqvqf8/n8M.wO5k40uO9e7e78jKlhqV27oY1ElnTvhK6pWf1c.aC)
-- Agent:  Agent@123  ($2a$10$wLqvqf8/n8M.wO5k40uO9e7e78jKlhqV27oY1ElnTvhK6pWf1c.aC)
-- Admin:  Admin@123  ($2a$10$wLqvqf8/n8M.wO5k40uO9e7e78jKlhqV27oY1ElnTvhK6pWf1c.aC)
-- Buyer:  Buyer@123  ($2a$10$wLqvqf8/n8M.wO5k40uO9e7e78jKlhqV27oY1ElnTvhK6pWf1c.aC)
-- ============================================================================

-- 1. USERS
INSERT INTO users (id, email, password_hash, full_name, phone_number, role, is_active) VALUES
(1, 'admin@smartfarmer.com', '$2a$10$wLqvqf8/n8M.wO5k40uO9e7e78jKlhqV27oY1ElnTvhK6pWf1c.aC', 'Rajesh Sharma (Admin)', '+919876543210', 'ROLE_ADMIN', true),
(2, 'vikram.agent@smartfarmer.com', '$2a$10$wLqvqf8/n8M.wO5k40uO9e7e78jKlhqV27oY1ElnTvhK6pWf1c.aC', 'Vikram Rathore (Field Agent)', '+919811122233', 'ROLE_AGENT', true),
(3, 'anita.agent@smartfarmer.com', '$2a$10$wLqvqf8/n8M.wO5k40uO9e7e78jKlhqV27oY1ElnTvhK6pWf1c.aC', 'Anita Desai (Field Agent)', '+919822233344', 'ROLE_AGENT', true),
(4, 'ramesh.farmer@smartfarmer.com', '$2a$10$wLqvqf8/n8M.wO5k40uO9e7e78jKlhqV27oY1ElnTvhK6pWf1c.aC', 'Ramesh Patel (Verified Farmer)', '+919733344455', 'ROLE_FARMER', true),
(5, 'suresh.farmer@smartfarmer.com', '$2a$10$wLqvqf8/n8M.wO5k40uO9e7e78jKlhqV27oY1ElnTvhK6pWf1c.aC', 'Suresh Yadav (Pending Farmer)', '+919744455566', 'ROLE_FARMER', true),
(6, 'manoj.middleman@gmail.com', '$2a$10$wLqvqf8/n8M.wO5k40uO9e7e78jKlhqV27oY1ElnTvhK6pWf1c.aC', 'Manoj Kumar (Middleman Trader)', '+919755566677', 'ROLE_FARMER', true),
(7, 'priya.buyer@smartfarmer.com', '$2a$10$wLqvqf8/n8M.wO5k40uO9e7e78jKlhqV27oY1ElnTvhK6pWf1c.aC', 'Priya Sundaram (Wholesale Buyer)', '+919866677788', 'ROLE_BUYER', true),
(8, 'arjun.buyer@smartfarmer.com', '$2a$10$wLqvqf8/n8M.wO5k40uO9e7e78jKlhqV27oY1ElnTvhK6pWf1c.aC', 'Arjun Mehta (Organic Store Owner)', '+919877788899', 'ROLE_BUYER', true);

-- 2. ADMINS
INSERT INTO admins (id, user_id, department, access_level) VALUES
(1, 1, 'Marketplace Operations & Compliance', 'SUPER_ADMIN');

-- 3. AGENTS
INSERT INTO agents (id, user_id, badge_number, assigned_region, total_verifications, rating) VALUES
(1, 2, 'AGT-NCR-101', 'North Zone (Delhi/Haryana)', 48, 4.9),
(2, 3, 'AGT-MH-204', 'West Zone (Maharashtra)', 62, 4.8);

-- 4. FARMERS
INSERT INTO farmers (id, user_id, farm_name, farm_location, latitude, longitude, farm_size_acres, primary_crops, kisan_credit_card_no, aadhaar_hash, land_document_url, verification_status, assigned_agent_id) VALUES
(1, 4, 'Green Valley Organic Agro', 'Kolar District, Karnataka', 13.1367, 78.1291, 8.5, 'Tomato, Potato, Carrot', 'KCC-KA-88912', 'e3b0c44298fc1c149afbf4c8996fb924', '/docs/ramesh_land_patta.pdf', 'APPROVED', 1),
(2, 5, 'Yadav Family Farms', 'Sonipat, Haryana', 28.9931, 77.0151, 12.0, 'Cauliflower, Cabbage, Green Chilli', 'KCC-HR-55102', 'a4c1b22398fc1c149afbf4c8996fe112', '/docs/suresh_land_deed.pdf', 'ASSIGNED', 1),
(3, 6, 'Manoj Produce Brokerage', 'Azadpur Yard, Delhi', 28.7158, 77.1724, 0.0, 'Mixed Produce Reseller', 'N/A', 'f8a1c99898fc1c149afbf4c8996fe999', '/docs/fake_contract.pdf', 'REJECTED', 1);

-- 5. VERIFICATIONS & LOGS
INSERT INTO farmer_verifications (id, farmer_id, agent_id, physical_visit_date, land_records_verified, crop_cultivation_verified, identity_proof_verified, genuine_farmer_confirmed, photo_evidence_url, gps_coordinates_verified, status, agent_remarks) VALUES
(1, 1, 1, '2026-02-15', true, true, true, true, '/evidence/ramesh_farm_visit.jpg', '13.1367, 78.1291', 'APPROVED', 'Physical farm inspection verified. 8.5 acres active tomato and carrot crops. Kisan credit card and land patta cross-verified with district revenue portal.'),
(2, 3, 1, '2026-03-01', false, false, false, false, '/evidence/manoj_warehouse.jpg', '28.7158, 77.1724', 'REJECTED', 'User does not possess cultivated agricultural land. Location visited is a commercial trader storage warehouse. Flagged as a middleman attempting to evade direct farmer verification.');

INSERT INTO verification_logs (farmer_id, performed_by_id, action, notes) VALUES
(1, 1, 'ASSIGNED', 'Assigned to Agent Vikram Rathore for field visit.'),
(1, 2, 'APPROVED', 'On-site visit confirmed genuine farming operations with active produce.'),
(2, 1, 'ASSIGNED', 'Assigned to Agent Vikram Rathore for pending field verification.'),
(3, 2, 'FLAGGED_MIDDLEMAN', 'Physical inspection revealed trader middleman operations. Access to seller marketplace blocked.');

-- 6. PRODUCT CATEGORIES
INSERT INTO product_categories (id, name, slug, description, image_url) VALUES
(1, 'Vegetables', 'vegetables', 'Fresh daily farm harvest vegetables direct from field', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600'),
(2, 'Fruits', 'fruits', 'Naturally ripened orchard fresh seasonal fruits', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600'),
(3, 'Grains & Cereals', 'grains', 'Farm-milled unpolished grains, wheat, and pulses', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600');

-- 7. PRODUCTS (Listed by Verified Farmer Ramesh Patel)
INSERT INTO products (id, farmer_id, category_id, crop_name, variety, quantity_kg, min_order_kg, price_per_kg, quality_grade, harvest_date, shelf_life_days, is_organic, image_url, farm_location, status) VALUES
(1, 1, 1, 'Tomato', 'Hybrid Roma Red', 2400.0, 20.0, 28.00, 'Grade A', '2026-03-28', 7, true, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600', 'Kolar District, Karnataka', 'AVAILABLE'),
(2, 1, 1, 'Potato', 'Jyoti Golden', 5000.0, 50.0, 21.00, 'Grade A', '2026-03-25', 45, false, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600', 'Kolar District, Karnataka', 'AVAILABLE'),
(3, 1, 1, 'Carrot', 'Ooty Sweet Red', 1200.0, 15.0, 32.00, 'Grade A', '2026-03-29', 14, true, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?w=600', 'Kolar District, Karnataka', 'AVAILABLE'),
(4, 1, 2, 'Banana', 'Robusta Cavendish', 1800.0, 25.0, 34.00, 'Grade A', '2026-03-30', 8, true, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600', 'Kolar District, Karnataka', 'AVAILABLE');

-- 8. FARMER PRICE LISTINGS (ML Price Advisor Audit)
INSERT INTO farmer_price_listings (product_id, farmer_id, crop_name, proposed_price, predicted_market_price, recommended_min_price, recommended_max_price, pricing_status, price_difference_pct) VALUES
(1, 1, 'Tomato', 28.00, 28.45, 26.75, 30.70, 'FAIR_MARKET', -1.5),
(2, 1, 'Potato', 21.00, 20.80, 19.55, 22.45, 'FAIR_MARKET', 0.9),
(3, 1, 'Carrot', 32.00, 31.50, 29.60, 34.00, 'FAIR_MARKET', 1.6),
(4, 1, 'Banana', 34.00, 35.10, 33.00, 37.90, 'FAIR_MARKET', -3.1);

-- 9. ORDERS
INSERT INTO orders (id, buyer_id, farmer_id, total_amount, delivery_address, delivery_city, contact_phone, special_instructions, order_status, payment_status) VALUES
(1, 7, 1, 5600.00, 'Shop 12, Wholesale APMC Complex, Bangalore', 'Bangalore', '+919866677788', 'Deliver early morning before 6 AM in ventilated crates.', 'DELIVERED', 'PAID'),
(2, 8, 1, 2240.00, 'Green Earth Organic Store, Indiranagar, Bangalore', 'Bangalore', '+919877788899', 'Pack only Grade A organically certified tomatoes.', 'DISPATCHED', 'PAID');

-- 10. ORDER ITEMS
INSERT INTO order_items (id, order_id, product_id, quantity_kg, unit_price, subtotal) VALUES
(1, 1, 1, 200.0, 28.00, 5600.00),
(2, 2, 1, 80.0, 28.00, 2240.00);

-- 11. PAYMENTS
INSERT INTO payments (id, order_id, payment_method, transaction_reference, amount, status) VALUES
(1, 1, 'UPI', 'UPI-TRANS-9948210492', 5600.00, 'COMPLETED'),
(2, 2, 'NetBanking', 'HDFC-NB-8829103948', 2240.00, 'COMPLETED');

-- 12. NOTIFICATIONS
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(4, 'Welcome to Smart Farmer Marketplace', 'Your farm verification was approved! You can now publish fresh produce at your own prices.', 'SUCCESS', true),
(4, 'New Bulk Order Received', 'Buyer Priya Sundaram placed an order for 200 kg of Tomato (₹5,600).', 'ORDER', true),
(5, 'Agent Assigned for Inspection', 'Agent Vikram Rathore has been assigned to conduct your farm visit and document inspection.', 'INFO', false),
(6, 'Verification Application Rejected', 'Your application was rejected as physical inspection confirmed non-farming commercial trader activity.', 'ALERT', true);
