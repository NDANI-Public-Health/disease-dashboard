import { Router, Request, Response } from 'express';
import pool from '../../db';
import { AggKeyStat } from '../../../../shared/types';

const router = Router();

router.get('/agg_key_stats', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT year, target_pop, pop_req, pop_trg, pop_treat, pop_req_received, pop_req_not_received, pop_not_treat, prog_cov_pct, nat_cov_pct FROM aggregates.agg_key_stats ORDER BY year, target_pop'
    );

    const data: AggKeyStat[] = result.rows.map((row) => ({
      year: row.year,
      targetPop: row.target_pop,
      popReq: row.pop_req,
      popTrg: row.pop_trg,
      popTreat: row.pop_treat,
      popReqReceived: row.pop_req_received,
      popReqNotReceived: row.pop_req_not_received,
      popNotTreat: row.pop_not_treat,
      progCovPct: row.prog_cov_pct,
      natCovPct: row.nat_cov_pct,
    }));

    const years = [...new Set(data.map((d) => d.year))].sort((a, b) => a - b);
    const targetPops = [...new Set(data.map((d) => d.targetPop))].sort();

    res.json({ meta: { years, targetPops }, data });
  } catch (err) {
    console.error('Error fetching agg_key_stats:', err);
    res.status(500).json({ error: 'Failed to fetch key stats' });
  }
});

export default router;
