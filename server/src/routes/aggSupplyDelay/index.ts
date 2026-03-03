import { Router, Request, Response } from 'express';
import pool from '../../db';
import { AggSupplyDelay } from '../../../../shared/types';

const router = Router();

router.get('/agg_supply_delay', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT year, delivery_delay_days FROM aggregates.agg_supply_delay ORDER BY year'
    );

    const data: AggSupplyDelay[] = result.rows.map((row) => ({
      year: row.year,
      deliveryDelayDays: row.delivery_delay_days,
    }));

    const years = [...new Set(data.map((d) => d.year))].sort((a, b) => a - b);

    res.json({ meta: { years }, data });
  } catch (err) {
    console.error('Error fetching agg_supply_delay:', err);
    res.status(500).json({ error: 'Failed to fetch supply delay' });
  }
});

export default router;
