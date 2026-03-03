import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import casesRouter from './routes/cases';
import aggKeyStatsRouter from './routes/aggKeyStats';
import aggGeoCoverageRouter from './routes/aggGeoCoverage';
import aggCoverageTrendsRouter from './routes/aggCoverageTrends';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', casesRouter);
app.use('/api', aggKeyStatsRouter);
app.use('/api', aggGeoCoverageRouter);
app.use('/api', aggCoverageTrendsRouter);

// Serve static files in production
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
