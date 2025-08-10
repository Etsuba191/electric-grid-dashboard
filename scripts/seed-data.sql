-- Seed the database with sample electric grid data

-- Insert sample assets
INSERT INTO assets (id, name, type, status, latitude, longitude, address, voltage, load_percentage, capacity) VALUES
('sub_001', 'Central Substation A', 'substation', 'normal', 40.7128, -74.0060, 'New York, NY 10001', 138000.00, 85.20, 150000.00),
('sub_002', 'North Substation B', 'substation', 'normal', 40.7831, -73.9712, 'New York, NY 10025', 138000.00, 72.50, 120000.00),
('sub_003', 'East Substation C', 'substation', 'maintenance', 40.7282, -73.7949, 'Queens, NY 11375', 138000.00, 0.00, 100000.00),

('trans_001', 'Transformer T-401', 'transformer', 'warning', 40.7589, -73.9851, 'Manhattan, NY 10019', 13800.00, 92.10, 15000.00),
('trans_002', 'Transformer T-402', 'transformer', 'normal', 40.7505, -73.9934, 'Manhattan, NY 10018', 13800.00, 78.30, 15000.00),
('trans_003', 'Transformer T-501', 'transformer', 'normal', 40.7614, -73.9776, 'Manhattan, NY 10019', 13800.00, 65.80, 12000.00),

('tl_001', 'Transmission Line TL-205', 'transmission', 'critical', 40.7282, -73.7949, 'Queens, NY 11375', 345000.00, 98.70, 350000.00),
('tl_002', 'Transmission Line TL-206', 'transmission', 'normal', 40.7489, -73.9680, 'Manhattan, NY 10017', 345000.00, 82.40, 350000.00),
('tl_003', 'Transmission Line TL-301', 'transmission', 'normal', 40.7061, -74.0087, 'New York, NY 10006', 230000.00, 75.60, 250000.00),

('meter_001', 'Smart Meter Grid SM-1024', 'meter', 'normal', 40.6892, -74.0445, 'Brooklyn, NY 11201', 240.00, 67.30, 500.00),
('meter_002', 'Smart Meter Grid SM-1025', 'meter', 'normal', 40.6782, -73.9442, 'Brooklyn, NY 11217', 240.00, 71.20, 500.00),
('meter_003', 'Smart Meter Grid SM-2048', 'meter', 'warning', 40.7282, -73.9942, 'Manhattan, NY 10001', 240.00, 89.50, 500.00),

('gen_001', 'Gas Turbine Generator GT-1', 'generator', 'normal', 40.7128, -74.0160, 'New York, NY 10006', 13800.00, 85.40, 50000.00),
('gen_002', 'Steam Generator SG-2', 'generator', 'normal', 40.6892, -74.0545, 'Brooklyn, NY 11201', 13800.00, 78.90, 75000.00);

-- Insert sample alerts
INSERT INTO alerts (id, asset_id, title, message, severity, acknowledged) VALUES
('alert_001', 'trans_001', 'High Load Warning', 'Transformer T-401 is operating at 92% capacity', 'warning', FALSE),
('alert_002', 'tl_001', 'Critical Overload', 'Transmission Line TL-205 has exceeded safe operating limits', 'critical', FALSE),
('alert_003', 'sub_001', 'Maintenance Required', 'Scheduled maintenance due for Central Substation A', 'info', TRUE),
('alert_004', 'meter_003', 'Load Spike Detected', 'Smart Meter Grid SM-2048 showing unusual load patterns', 'warning', FALSE);

-- Insert sample events
INSERT INTO events (id, asset_id, title, description, event_date, type, severity, duration_hours, status) VALUES
('event_001', 'sub_001', 'Substation A Maintenance', 'Scheduled maintenance for primary transformer', '2024-01-15 08:00:00', 'maintenance', 'medium', 4, 'scheduled'),
('event_002', 'tl_001', 'Power Outage - Grid 5', 'Unplanned outage affecting residential area', '2024-01-18 14:30:00', 'outage', 'high', 2, 'resolved'),
('event_003', 'trans_002', 'Transformer Inspection', 'Routine safety inspection', '2024-01-22 10:00:00', 'inspection', 'low', 1, 'completed'),
('event_004', 'tl_001', 'Critical Alert - Line 401', 'Emergency response required', '2024-01-25 16:45:00', 'alert', 'high', 0, 'in-progress');

-- Insert sample users
INSERT INTO users (id, username, email, role) VALUES
('user_001', 'admin', 'admin@gridmonitor.com', 'admin'),
('user_002', 'operator1', 'operator1@gridmonitor.com', 'operator'),
('user_003', 'viewer1', 'viewer1@gridmonitor.com', 'viewer');

-- Insert sample real-time measurements (last 24 hours)
INSERT INTO measurements (asset_id, voltage, current, power, frequency, temperature, measured_at) 
SELECT 
    'sub_001',
    138000 + (RAND() - 0.5) * 2000,
    850 + (RAND() - 0.5) * 100,
    117300 + (RAND() - 0.5) * 10000,
    60.0 + (RAND() - 0.5) * 0.2,
    75 + (RAND() - 0.5) * 10,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 1440) MINUTE)
FROM 
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t1,
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t2,
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t3
LIMIT 100;
