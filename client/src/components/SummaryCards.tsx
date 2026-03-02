import { SummaryStats } from '../types';

interface SummaryCardsProps {
  summary: SummaryStats;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    { label: 'Total Cases', value: formatNumber(summary.totalCases) },
    { label: 'Total Deaths', value: formatNumber(summary.totalDeaths) },
    { label: 'Countries Affected', value: summary.countriesAffected.toString() },
    { label: 'Avg Prevalence', value: summary.avgPrevalence.toFixed(3) + '%' },
  ];

  return (
    <div className="summary-cards">
      {cards.map(card => (
        <div key={card.label} className="summary-card">
          <div className="card-label">{card.label}</div>
          <div className="card-value">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
