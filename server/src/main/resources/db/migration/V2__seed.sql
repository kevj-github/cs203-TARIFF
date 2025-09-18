-- V2__seed.sql
-- Example data for countries, products, tariff rules, and excise rules.
-- Works on both H2 and Postgres.

-- Countries (already seeded in V1, but adding a couple more for variety)
INSERT INTO countries (iso2, name) VALUES ('JP','Japan');
INSERT INTO countries (iso2, name) VALUES ('FR','France');

-- Products (already some seeded in V1, adding more)
INSERT INTO products (hs_code, name) VALUES ('2205','Vermouth and other wine of fresh grapes');
INSERT INTO products (hs_code, name) VALUES ('2206','Other fermented beverages');
INSERT INTO products (hs_code, name) VALUES ('2207','Undenatured ethyl alcohol');

-- Tariff Rules
-- Example SG → US wine rule: $10 per liter of alcohol (specific)
INSERT INTO tariff_rules (
  origin_iso2, dest_iso2, hs_code, rule_type,
  rate_value, rate_unit, valid_from, valid_to
) VALUES (
  'SG', 'US', '2204', 'specific',
  10.00, 'USD_PER_LAA', '2025-06-01', NULL
);

-- Example SG → US wine rule: 5% ad valorem (older rule)
INSERT INTO tariff_rules (
  origin_iso2, dest_iso2, hs_code, rule_type,
  rate_value, rate_unit, valid_from, valid_to
) VALUES (
  'SG', 'US', '2204', 'ad_valorem',
  5.0, 'PERCENT', '2025-01-01', '2025-05-31'
);

-- Example JP → US beer rule: 20% ad valorem
INSERT INTO tariff_rules (
  origin_iso2, dest_iso2, hs_code, rule_type,
  rate_value, rate_unit, valid_from, valid_to
) VALUES (
  'JP', 'US', '2203', 'ad_valorem',
  20.0, 'PERCENT', '2025-01-01', NULL
);

-- Excise Rules
-- Example excise for SG spirits: SGD 90 per liter of alcohol
INSERT INTO excise_rules (
  country_iso2, hs_code, rate_value, rate_unit, valid_from, valid_to
) VALUES (
  'SG', '2208', 90.0, 'SGD_PER_LAA', '2025-01-01', NULL
);

-- Example excise for US beer: USD 0.21 per liter
INSERT INTO excise_rules (
  country_iso2, hs_code, rate_value, rate_unit, valid_from, valid_to
) VALUES (
  'US', '2203', 0.21, 'USD_PER_LITER', '2025-01-01', NULL
);
