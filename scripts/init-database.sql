-- Initialize the electric grid monitoring database

-- Create database
CREATE DATABASE IF NOT EXISTS grid_monitor;
USE grid_monitor;

-- Assets table
CREATE TABLE assets (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('substation', 'transformer', 'transmission', 'meter', 'generator') NOT NULL,
    status ENUM('normal', 'warning', 'critical', 'maintenance') DEFAULT 'normal',
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    voltage DECIMAL(10, 2) NOT NULL,
    load_percentage DECIMAL(5, 2) DEFAULT 0,
    capacity DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Alerts table
CREATE TABLE alerts (
    id VARCHAR(50) PRIMARY KEY,
    asset_id VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    severity ENUM('info', 'warning', 'critical') NOT NULL,
    acknowledged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP NULL,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- Events table
CREATE TABLE events (
    id VARCHAR(50) PRIMARY KEY,
    asset_id VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATETIME NOT NULL,
    type ENUM('maintenance', 'outage', 'inspection', 'alert') NOT NULL,
    severity ENUM('low', 'medium', 'high') DEFAULT 'low',
    duration_hours INT DEFAULT 0,
    status ENUM('scheduled', 'in-progress', 'completed', 'resolved') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- Real-time measurements table
CREATE TABLE measurements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    asset_id VARCHAR(50),
    voltage DECIMAL(10, 2),
    current DECIMAL(10, 2),
    power DECIMAL(10, 2),
    frequency DECIMAL(5, 2),
    temperature DECIMAL(5, 2),
    measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    INDEX idx_asset_time (asset_id, measured_at)
);

-- Users table for role-based access
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('admin', 'operator', 'viewer') DEFAULT 'viewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Create indexes for better performance
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_acknowledged ON alerts(acknowledged);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_type ON events(type);
