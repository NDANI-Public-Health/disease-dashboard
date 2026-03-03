import { describe, it, expect, afterAll } from 'vitest';
import express from 'express';
import request from 'supertest';

import aggSupplyDelayRouter from './index';
import pool from '../../db';

const app = express();
app.use('/api', aggSupplyDelayRouter);

afterAll(async () => {
  await pool.end();
});

describe('GET /api/agg_supply_delay', () => {
  it('returns 200 with meta and data from the database', async () => {
    const res = await request(app).get('/api/agg_supply_delay');

    expect(res.status).toBe(200);

    expect(res.body.meta).toHaveProperty('years');
    expect(res.body.meta.years.length).toBeGreaterThan(0);

    const years: number[] = res.body.meta.years;
    expect(years).toEqual([...years].sort((a, b) => a - b));

    expect(res.body.data.length).toBeGreaterThan(0);

    for (const row of res.body.data) {
      expect(row).toEqual(
        expect.objectContaining({
          year: expect.any(Number),
          deliveryDelayDays: expect.any(Number),
        })
      );
    }
  });

  it('meta.years contain only unique values', async () => {
    const res = await request(app).get('/api/agg_supply_delay');

    const { years } = res.body.meta;
    expect(new Set(years).size).toBe(years.length);
  });

  it('every row has a year present in meta.years', async () => {
    const res = await request(app).get('/api/agg_supply_delay');

    const yearSet = new Set(res.body.meta.years);
    for (const row of res.body.data) {
      expect(yearSet.has(row.year)).toBe(true);
    }
  });
});
