import { Router, Request, Response } from 'express';
import pool from '../../db';
import { AggCoverageTrend } from '../../../../shared/types';

const router = Router();

router.get('/agg_coverage_trends', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT year, prog_adult_cov_pct, prog_total_cov_pct, nat_adult_cov_pct, nat_total_cov_pct FROM aggregates.agg_coverage_trends ORDER BY year'
    );

    const data: AggCoverageTrend[] = result.rows.map((row) => ({
      year: row.year,
      progAdultCovPct: row.prog_adult_cov_pct,
      progTotalCovPct: row.prog_total_cov_pct,
      natAdultCovPct: row.nat_adult_cov_pct,
      natTotalCovPct: row.nat_total_cov_pct,
    }));

    const years = data.map((d) => d.year);

    res.json({ meta: { years }, data });
  } catch (err) {
    console.error('Error fetching agg_coverage_trends:', err);
    res.status(500).json({ error: 'Failed to fetch coverage trends' });
  }
});

export default router;
