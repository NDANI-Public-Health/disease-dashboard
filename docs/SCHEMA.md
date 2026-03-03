# Database Schema

**Database:** `espen_ntd_analysis`
**Schema:** `aggregates`

---

## Tables

### `agg_supply_delay`

Drug supply delivery tracking for MDA (Mass Drug Administration) campaigns.

**Rows:** 13

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `po_number` | integer | yes | Purchase order number |
| `year` | integer | yes | Campaign year |
| `stage` | varchar | yes | Delivery stage |
| `drug` | varchar | yes | Drug name |
| `quantity_tablets` | integer | yes | Number of tablets ordered |
| `implied_doses` | integer | yes | Number of implied doses |
| `mda_date` | timestamp | yes | Scheduled MDA date |
| `actual_arrival_date` | timestamp | yes | Actual arrival date |
| `actual_delivery_date` | varchar | yes | Actual delivery date |
| `est_delivery_date` | varchar | yes | Estimated delivery date |
| `days_before_mda` | integer | yes | Days between delivery and MDA |
| `is_late` | boolean | yes | Whether delivery was late |
| `is_very_late` | boolean | yes | Whether delivery was very late |
| `delivery_delay_days` | varchar | yes | Number of days delivery was delayed |

---

### `agg_key_stats`

Yearly population and coverage statistics by target population group.

**Rows:** 44

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `year` | integer | yes | Reporting year |
| `target_pop` | varchar | yes | Target population group label |
| `pop_req` | integer | yes | Population requiring treatment |
| `pop_trg` | integer | yes | Population targeted for treatment |
| `pop_treat` | integer | yes | Population actually treated |
| `prog_cov_pct` | double precision | yes | Programme coverage percentage |
| `nat_cov_pct` | double precision | yes | National coverage percentage |

---

### `agg_geo_coverage`

Geographic coverage of preventive chemotherapy by endemicity level per year.

**Rows:** 44

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `year` | integer | yes | Reporting year |
| `endemicity_level` | varchar | yes | Endemicity level code |
| `endemicity_label` | varchar | yes | Human-readable endemicity label |
| `color_hex` | varchar | yes | Display color for the endemicity level |
| `iu_requiring_pc` | integer | yes | Implementation units requiring preventive chemotherapy |
| `iu_received_pc` | integer | yes | Implementation units that received preventive chemotherapy |
| `geo_coverage_pct` | double precision | yes | Geographic coverage percentage |

---

### `agg_effective_rounds`

MDA round effectiveness per implementation unit (IU).

**Rows:** 605

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `iu_id` | integer | yes | Implementation unit ID |
| `iu_name` | varchar | yes | Implementation unit name |
| `state` | varchar | yes | State / administrative region |
| `country` | varchar | yes | Country |
| `total_mda_rounds` | integer | yes | Total number of MDA rounds conducted |
| `effective_rounds` | integer | yes | Number of rounds meeting effectiveness threshold |
| `ineffective_rounds` | integer | yes | Number of rounds below effectiveness threshold |
| `latest_year` | integer | yes | Most recent year of data |
| `latest_endemicity` | varchar | yes | Most recent endemicity classification |
| `latest_coverage` | double precision | yes | Most recent coverage percentage |
| `has_transmission_risk` | boolean | yes | Whether transmission risk remains |

---

### `agg_coverage_trends`

National and programme-level coverage trends over time.

**Rows:** 11

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `year` | integer | yes | Reporting year |
| `prog_adult_cov_pct` | double precision | yes | Programme adult coverage percentage |
| `prog_total_cov_pct` | double precision | yes | Programme total coverage percentage |
| `nat_adult_cov_pct` | double precision | yes | National adult coverage percentage |
| `nat_total_cov_pct` | double precision | yes | National total coverage percentage |
