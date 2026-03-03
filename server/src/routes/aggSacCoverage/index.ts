import { Router, Request, Response } from "express";
import pool from "../../db";
import { AggSacCoverage } from "../../../../shared/types";

const router = Router();

router.get("/agg_sac_coverage", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT year, iu_requiring_treatment, iu_treated, iu_effective_coverage, iu_requiring_treatment_pct, nat_sac_cov_pct, prog_sac_cov_pct, prog_adult_cov_pct, prog_total_cov_pct, nat_adult_cov_pct, nat_total_cov_pct FROM aggregates.agg_sac_coverage ORDER BY year",
    );

    const data: AggSacCoverage[] = result.rows.map((row) => ({
      year: row.year,
      iuRequiringTreatment: row.iu_requiring_treatment,
      iuTreated: row.iu_treated,
      iuEffectiveCoverage: row.iu_effective_coverage,
      iuRequiringTreatmentPct: row.iu_requiring_treatment_pct,
      natSacCovPct: row.nat_sac_cov_pct,
      progSacCovPct: row.prog_sac_cov_pct,
      progAdultCovPct: row.prog_adult_cov_pct,
      progTotalCovPct: row.prog_total_cov_pct,
      natAdultCovPct: row.nat_adult_cov_pct,
      natTotalCovPct: row.nat_total_cov_pct,
    }));

    const years = data.map((d) => d.year);

    res.json({ meta: { years }, data });
  } catch (err) {
    console.error("Error fetching agg_sac_coverage:", err);
    res.status(500).json({ error: "Failed to fetch SAC coverage" });
  }
});

export default router;
