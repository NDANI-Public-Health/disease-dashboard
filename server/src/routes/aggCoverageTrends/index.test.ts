import { describe, it, expect, afterAll } from 'vitest';
import express from 'express';
import request from 'supertest';

import aggCoverageTrendsRouter from './index';
import pool from '../../db';

const app = express();
app.use('/api', aggCoverageTrendsRouter);

afterAll(async () => {
  await pool.end();
});

describe('GET /api/agg_coverage_trends', () => {
  it('returns 200 with meta and data from the database', async () => {
    const res = await request(app).get('/api/agg_coverage_trends');

    expect(res.status).toBe(200);

    expect(res.body.meta).toHaveProperty('years');
    expect(res.body.meta.years.length).toBeGreaterThan(0);

    const years: number[] = res.body.meta.years;
    expect(years).toEqual([...years].sort((a, b) => a - b));

    expect(res.body.data.length).toBeGreaterThan(0);

    for (const row of res.body.data) {
      expect(row).toHaveProperty('year');
      expect(typeof row.year).toBe('number');
      for (const field of ['progAdultCovPct', 'progTotalCovPct', 'natAdultCovPct', 'natTotalCovPct']) {
        expect(typeof row[field] === 'number' || row[field] === null).toBe(true);
      }
    }
  });

  it('meta.years matches data rows (one row per year)', async () => {
    const res = await request(app).get('/api/agg_coverage_trends');

    const { years } = res.body.meta;
    expect(res.body.data.length).toBe(years.length);
    expect(res.body.data.map((d: any) => d.year)).toEqual(years);
  });

  it('meta.years contain only unique values', async () => {
    const res = await request(app).get('/api/agg_coverage_trends');

    const { years } = res.body.meta;
    expect(new Set(years).size).toBe(years.length);
  });
});
