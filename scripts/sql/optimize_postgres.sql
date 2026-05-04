-- Postgres analytics optimization for uk_price_paid (~30M rows).
--
-- Targets the top-offending queries surfaced by Insights:
--   priceByType, soldOverTime, priceIncrease, priceOverTime,
--   soldByDuration, getHouseSales.
--
-- Strategy:
--   1. Index (town, district, postcode1) + (date) so filtered scans use index.
--   2. Materialized views precompute the *unfiltered* aggregates that drive
--      every dashboard panel. The query rewrite joins the filtered side
--      (now an index lookup) against the MV instead of two full scans.
--
-- After data load: refresh the views with
--   REFRESH MATERIALIZED VIEW CONCURRENTLY uk_price_paid_type_summary;
--   REFRESH MATERIALIZED VIEW CONCURRENTLY uk_price_paid_yearly_summary;
--   REFRESH MATERIALIZED VIEW CONCURRENTLY uk_price_paid_monthly_summary;

BEGIN;

CREATE INDEX IF NOT EXISTS idx_uk_price_paid_location
    ON uk_price_paid (town, district, postcode1);

-- Covering index for the priceByType CTE: satisfies the WHERE clause and
-- lets Postgres read price/type without a heap fetch.
CREATE INDEX IF NOT EXISTS idx_uk_price_paid_location_type_price
    ON uk_price_paid (town, district, postcode1, type, price);

CREATE INDEX IF NOT EXISTS idx_uk_price_paid_date
    ON uk_price_paid (date);

CREATE INDEX IF NOT EXISTS idx_uk_price_paid_district
    ON uk_price_paid (district);

DROP MATERIALIZED VIEW IF EXISTS uk_price_paid_type_summary;
CREATE MATERIALIZED VIEW uk_price_paid_type_summary AS
SELECT
    type,
    COUNT(*)::bigint                                              AS total_count,
    COUNT(DISTINCT town)::int                                     AS distinct_towns,
    COUNT(DISTINCT district)::int                                 AS distinct_districts,
    COUNT(DISTINCT postcode1)::int                                AS distinct_postcodes,
    MIN(price)::int                                               AS min_price,
    MAX(price)::int                                               AS max_price,
    percentile_cont(0.25) WITHIN GROUP (ORDER BY price)::numeric  AS p25_price,
    percentile_cont(0.50) WITHIN GROUP (ORDER BY price)::numeric  AS p50_price,
    percentile_cont(0.75) WITHIN GROUP (ORDER BY price)::numeric  AS p75_price
FROM uk_price_paid
GROUP BY type;

CREATE UNIQUE INDEX ON uk_price_paid_type_summary (type);

DROP MATERIALIZED VIEW IF EXISTS uk_price_paid_yearly_summary;
CREATE MATERIALIZED VIEW uk_price_paid_yearly_summary AS
SELECT
    date_trunc('year', date)::date  AS year,
    EXTRACT(YEAR FROM date)::int    AS year_int,
    COUNT(*)::bigint                AS total_count,
    SUM(price)::bigint              AS sum_price,
    COUNT(DISTINCT town)::int       AS distinct_towns,
    COUNT(DISTINCT district)::int   AS distinct_districts,
    COUNT(DISTINCT postcode1)::int  AS distinct_postcodes
FROM uk_price_paid
GROUP BY year, year_int;

CREATE UNIQUE INDEX ON uk_price_paid_yearly_summary (year);

DROP MATERIALIZED VIEW IF EXISTS uk_price_paid_monthly_summary;
CREATE MATERIALIZED VIEW uk_price_paid_monthly_summary AS
SELECT
    date_trunc('month', date)::date AS month,
    COUNT(*)::bigint                AS total_count,
    SUM(price)::bigint              AS sum_price
FROM uk_price_paid
GROUP BY month;

CREATE UNIQUE INDEX ON uk_price_paid_monthly_summary (month);

ANALYZE uk_price_paid;
ANALYZE uk_price_paid_type_summary;
ANALYZE uk_price_paid_yearly_summary;
ANALYZE uk_price_paid_monthly_summary;

COMMIT;
