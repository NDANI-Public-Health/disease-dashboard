import { describe, it, expect, afterAll } from 'vitest';
import express from 'express';
import request from 'supertest';
import 'dotenv/config';
import aggKeyStatsRouter from './index';
import pool from '../../db';

const app = express();
app.use('/api', aggKeyStatsRouter);

afterAll(async () => {
  await pool.end();
});

describe('GET /api/agg_key_stats', () => {
  it('returns 200 with meta and data from the database', async () => {
    const res = await request(app).get('/api/agg_key_stats');

    expect(res.status).toBe(200);

    // meta has expected structure
    expect(res.body.meta).toHaveProperty('years');
    expect(res.body.meta).toHaveProperty('targetPops');
    expect(res.body.meta.years.length).toBeGreaterThan(0);
    expect(res.body.meta.targetPops.length).toBeGreaterThan(0);

    // years are sorted ascending
    const years: number[] = res.body.meta.years;
    expect(years).toEqual([...years].sort((a, b) => a - b));

    // data is a non-empty array
    expect(res.body.data.length).toBeGreaterThan(0);

    // each row has the expected camelCase keys with correct types
    for (const row of res.body.data) {
      expect(row).toEqual(
        expect.objectContaining({
          year: expect.any(Number),
          targetPop: expect.any(String),
          popReq: expect.any(Number),
          popTrg: expect.any(Number),
          popTreat: expect.any(Number),
          popReqReceived: expect.any(Number),
          popReqNotReceived: expect.any(Number),
          popNotTreat: expect.any(Number),
        })
      );
      // coverage fields are number or null
      expect(typeof row.progCovPct === 'number' || row.progCovPct === null).toBe(true);
      expect(typeof row.natCovPct === 'number' || row.natCovPct === null).toBe(true);
    }
  });

  it('meta.years and meta.targetPops contain only unique values', async () => {
    const res = await request(app).get('/api/agg_key_stats');

    const { years, targetPops } = res.body.meta;
    expect(new Set(years).size).toBe(years.length);
    expect(new Set(targetPops).size).toBe(targetPops.length);
  });

  it('data count equals years × targetPops (no missing combinations)', async () => {
    const res = await request(app).get('/api/agg_key_stats');

    const { years, targetPops } = res.body.meta;
    expect(res.body.data.length).toBe(years.length * targetPops.length);
  });
});
