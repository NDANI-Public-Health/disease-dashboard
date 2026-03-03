import { Router, Request, Response } from 'express';
import pool from '../../db';
import { AggGeoCoverage } from '../../../../shared/types';

const router = Router();

router.get('/agg_geo_coverage', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT year, endemicity_level, endemicity_label, color_hex, iu_requiring_pc, iu_received_pc, geo_coverage_pct FROM aggregates.agg_geo_coverage ORDER BY year, endemicity_level'
    );

    const data: AggGeoCoverage[] = result.rows.map((row) => ({
      year: row.year,
      endemicityLevel: row.endemicity_level,
      endemicityLabel: row.endemicity_label,
      colorHex: row.color_hex,
      iuRequiringPc: row.iu_requiring_pc,
      iuReceivedPc: row.iu_received_pc,
      geoCoveragePct: row.geo_coverage_pct,
    }));

    const years = [...new Set(data.map((d) => d.year))].sort((a, b) => a - b);
    const endemicityLevels = [...new Set(data.map((d) => d.endemicityLevel))].sort();

    res.json({ meta: { years, endemicityLevels }, data });
  } catch (err) {
    console.error('Error fetching agg_geo_coverage:', err);
    res.status(500).json({ error: 'Failed to fetch geo coverage' });
  }
});

export default router;
