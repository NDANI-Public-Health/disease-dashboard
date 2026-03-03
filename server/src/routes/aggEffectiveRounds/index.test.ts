import { describe, it, expect, afterAll } from 'vitest';
import express from 'express';
import request from 'supertest';
import 'dotenv/config';
import aggEffectiveRoundsRouter from './index';
import pool from '../../db';

const app = express();
app.use('/api', aggEffectiveRoundsRouter);

afterAll(async () => {
  await pool.end();
});

describe('GET /api/agg_effective_rounds', () => {
  it('returns 200 with meta and data from the database', async () => {
    const res = await request(app).get('/api/agg_effective_rounds');

    expect(res.status).toBe(200);

    expect(res.body.meta).toHaveProperty('states');
    expect(res.body.meta).toHaveProperty('endemicities');
    expect(res.body.meta.states.length).toBeGreaterThan(0);
    expect(res.body.meta.endemicities.length).toBeGreaterThan(0);

    expect(res.body.data.length).toBeGreaterThan(0);

    // Spot-check first row for correct shape
    const row = res.body.data[0];
    expect(row).toEqual(
      expect.objectContaining({
        iuId: expect.any(Number),
        iuName: expect.any(String),
        state: expect.any(String),
        country: expect.any(String),
        totalMdaRounds: expect.any(Number),
        effectiveRounds: expect.any(Number),
        ineffectiveRounds: expect.any(Number),
        latestYear: expect.any(Number),
        latestEndemicity: expect.any(String),
        hasTransmissionRisk: expect.any(Boolean),
      })
    );
    expect(typeof row.latestCoverage === 'number' || row.latestCoverage === null).toBe(true);
  });

  it('meta.states and meta.endemicities contain only unique values', async () => {
    const res = await request(app).get('/api/agg_effective_rounds');

    const { states, endemicities } = res.body.meta;
    expect(new Set(states).size).toBe(states.length);
    expect(new Set(endemicities).size).toBe(endemicities.length);
  });

  it('every row references a state present in meta.states', async () => {
    const res = await request(app).get('/api/agg_effective_rounds');

    const stateSet = new Set(res.body.meta.states);
    for (const row of res.body.data) {
      expect(stateSet.has(row.state)).toBe(true);
    }
  });
});
