import { describe, it, expect, afterAll } from 'vitest';
import express from 'express';
import request from 'supertest';
import 'dotenv/config';
import aggGeoCoverageRouter from './index';
import pool from '../../db';

const app = express();
app.use('/api', aggGeoCoverageRouter);

afterAll(async () => {
  await pool.end();
});

describe('GET /api/agg_geo_coverage', () => {
  it('returns 200 with meta and data from the database', async () => {
    const res = await request(app).get('/api/agg_geo_coverage');

    expect(res.status).toBe(200);

    expect(res.body.meta).toHaveProperty('years');
    expect(res.body.meta).toHaveProperty('endemicityLevels');
    expect(res.body.meta.years.length).toBeGreaterThan(0);
    expect(res.body.meta.endemicityLevels.length).toBeGreaterThan(0);

    const years: number[] = res.body.meta.years;
    expect(years).toEqual([...years].sort((a, b) => a - b));

    expect(res.body.data.length).toBeGreaterThan(0);

    for (const row of res.body.data) {
      expect(row).toEqual(
        expect.objectContaining({
          year: expect.any(Number),
          endemicityLevel: expect.any(String),
          endemicityLabel: expect.any(String),
          colorHex: expect.any(String),
          iuRequiringPc: expect.any(Number),
          iuReceivedPc: expect.any(Number),
          geoCoveragePct: expect.any(Number),
        })
      );
    }
  });

  it('meta.years and meta.endemicityLevels contain only unique values', async () => {
    const res = await request(app).get('/api/agg_geo_coverage');

    const { years, endemicityLevels } = res.body.meta;
    expect(new Set(years).size).toBe(years.length);
    expect(new Set(endemicityLevels).size).toBe(endemicityLevels.length);
  });

  it('data count equals years × endemicityLevels (no missing combinations)', async () => {
    const res = await request(app).get('/api/agg_geo_coverage');

    const { years, endemicityLevels } = res.body.meta;
    expect(res.body.data.length).toBe(years.length * endemicityLevels.length);
  });
});
