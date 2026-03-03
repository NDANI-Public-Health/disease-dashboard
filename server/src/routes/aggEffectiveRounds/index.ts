import { Router, Request, Response } from 'express';
import pool from '../../db';
import { AggEffectiveRound } from '../../../../shared/types';

const router = Router();

router.get('/agg_effective_rounds', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT iu_id, iu_name, state, country, total_mda_rounds, effective_rounds, ineffective_rounds, latest_year, latest_endemicity, latest_coverage, has_transmission_risk FROM aggregates.agg_effective_rounds ORDER BY state, iu_name'
    );

    const data: AggEffectiveRound[] = result.rows.map((row) => ({
      iuId: row.iu_id,
      iuName: row.iu_name,
      state: row.state,
      country: row.country,
      totalMdaRounds: row.total_mda_rounds,
      effectiveRounds: row.effective_rounds,
      ineffectiveRounds: row.ineffective_rounds,
      latestYear: row.latest_year,
      latestEndemicity: row.latest_endemicity,
      latestCoverage: row.latest_coverage,
      hasTransmissionRisk: row.has_transmission_risk,
    }));

    const states = [...new Set(data.map((d) => d.state))].sort();
    const endemicities = [...new Set(data.map((d) => d.latestEndemicity))].sort();

    res.json({ meta: { states, endemicities }, data });
  } catch (err) {
    console.error('Error fetching agg_effective_rounds:', err);
    res.status(500).json({ error: 'Failed to fetch effective rounds' });
  }
});

export default router;
