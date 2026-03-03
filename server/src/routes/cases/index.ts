import { Router, Request, Response } from 'express';
import { mockData, countries, diseases } from '../../data/mockData';

const router = Router();

router.get('/filters/countries', (_req: Request, res: Response) => {
  res.json({ countries });
});

router.get('/filters/diseases', (_req: Request, res: Response) => {
  res.json({ diseases });
});

router.get('/cases', (req: Request, res: Response) => {
  const { country, disease } = req.query;

  let filtered = mockData;

  if (country && typeof country === 'string') {
    filtered = filtered.filter(r => r.country === country);
  }
  if (disease && typeof disease === 'string') {
    filtered = filtered.filter(r => r.disease === disease);
  }

  res.json({ cases: filtered });
});

router.get('/cases/summary', (req: Request, res: Response) => {
  const { country, disease } = req.query;

  let filtered = mockData;

  if (country && typeof country === 'string') {
    filtered = filtered.filter(r => r.country === country);
  }
  if (disease && typeof disease === 'string') {
    filtered = filtered.filter(r => r.disease === disease);
  }

  const totalCases = filtered.reduce((sum, r) => sum + r.cases, 0);
  const totalDeaths = filtered.reduce((sum, r) => sum + r.deaths, 0);
  const countriesAffected = new Set(filtered.map(r => r.country)).size;
  const avgPrevalence = filtered.length > 0
    ? parseFloat((filtered.reduce((sum, r) => sum + r.prevalence, 0) / filtered.length).toFixed(4))
    : 0;

  res.json({ totalCases, totalDeaths, countriesAffected, avgPrevalence });
});

export default router;
