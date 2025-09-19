-- V2__electronics_seed.sql
-- Example data for electronics between SG <-> US.
-- Assumes the fresh electronics V1__init.sql with:
-- - products(product_type, brand, model) present
-- - indirect_tax_rules table (GST/VAT)
-- - NO excise_rules table

-- (Countries SG/US were seeded in V1; no need to re-insert)

-- If you DIDN'T insert electronics products in V1, uncomment these:
-- INSERT INTO products (hs_code, name, product_type) VALUES
-- ('8517.12', 'Smartphones', 'PHONE'),
-- ('8471.30', 'Laptops/Portable computers', 'LAPTOP'),
-- ('8471.41', 'Tablets/Other ADP machines', 'TABLET'),
-- ('8528.72', 'Television receivers', 'TV'),
-- ('8528.52', 'Monitors (excl. TV)', 'MONITOR');

-- ------------------------------------------------------------------
-- Tariff rules (illustrative; adjust to authoritative data if needed)
-- Many electronics lanes are 0% ad valorem; monitors/TVs can vary.
-- We seed SG->US and US->SG for five HS codes with open-ended validity.
-- ------------------------------------------------------------------

-- Smartphones
INSERT INTO tariff_rules (
  origin_iso2, dest_iso2, hs_code, rule_type, rate_value, rate_unit, valid_from, valid_to
) VALUES
('SG','US','8517.12','ad_valorem',0.0,'PERCENT','2025-01-01',NULL),
('US','SG','8517.12','ad_valorem',0.0,'PERCENT','2025-01-01',NULL);

-- Laptops / portable computers
INSERT INTO tariff_rules (
  origin_iso2, dest_iso2, hs_code, rule_type, rate_value, rate_unit, valid_from, valid_to
) VALUES
('SG','US','8471.30','ad_valorem',0.0,'PERCENT','2025-01-01',NULL),
('US','SG','8471.30','ad_valorem',0.0,'PERCENT','2025-01-01',NULL);

-- Tablets / other ADP machines
INSERT INTO tariff_rules (
  origin_iso2, dest_iso2, hs_code, rule_type, rate_value, rate_unit, valid_from, valid_to
) VALUES
('SG','US','8471.41','ad_valorem',0.0,'PERCENT','2025-01-01',NULL),
('US','SG','8471.41','ad_valorem',0.0,'PERCENT','2025-01-01',NULL);

-- Televisions
INSERT INTO tariff_rules (
  origin_iso2, dest_iso2, hs_code, rule_type, rate_value, rate_unit, valid_from, valid_to
) VALUES
('SG','US','8528.72','ad_valorem',0.0,'PERCENT','2025-01-01',NULL),
('US','SG','8528.72','ad_valorem',0.0,'PERCENT','2025-01-01',NULL);

-- Monitors (non-TV). Set non-zero to demonstrate your calc path.
INSERT INTO tariff_rules (
  origin_iso2, dest_iso2, hs_code, rule_type, rate_value, rate_unit, valid_from, valid_to
) VALUES
('SG','US','8528.52','ad_valorem',3.9,'PERCENT','2025-01-01',NULL),
('US','SG','8528.52','ad_valorem',0.0,'PERCENT','2025-01-01',NULL);

-- ------------------------------------------------------------------
-- Indirect taxes (optional)
-- If you want landed cost for SG, seed GST (9% from 2024-01-01).
-- ------------------------------------------------------------------
INSERT INTO indirect_tax_rules (
  country_iso2, tax_type, rate_value, rate_unit, valid_from, valid_to
) VALUES
('SG','GST',0.090000,'PERCENT','2024-01-01',NULL);
