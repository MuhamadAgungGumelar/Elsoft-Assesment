CREATE DATABASE IF NOT EXISTS elsoft_app;
USE elsoft_app;

CREATE TABLE IF NOT EXISTS items (
  oid VARCHAR(36) PRIMARY KEY,
  code VARCHAR(100),
  label VARCHAR(255),
  item_unit_name VARCHAR(100),
  is_active TINYINT(1) DEFAULT 1,
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stock_issues (
  oid VARCHAR(36) PRIMARY KEY,
  code VARCHAR(100),
  date DATE,
  account_name VARCHAR(255),
  status_name VARCHAR(100),
  note TEXT,
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stock_issue_details (
  oid VARCHAR(36) PRIMARY KEY,
  stock_issue_oid VARCHAR(36),
  item_name VARCHAR(255),
  quantity DECIMAL(10,2),
  item_unit_name VARCHAR(100),
  note TEXT,
  INDEX idx_stock_issue (stock_issue_oid)
);
