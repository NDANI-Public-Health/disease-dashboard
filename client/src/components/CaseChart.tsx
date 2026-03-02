import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { CaseRecord } from '../types';

interface CaseChartProps {
  cases: CaseRecord[];
}

export default function CaseChart({ cases }: CaseChartProps) {
  const { categories, seriesData } = useMemo(() => {
    const byYear = new Map<number, number>();
    for (const r of cases) {
      byYear.set(r.year, (byYear.get(r.year) || 0) + r.cases);
    }
    const sorted = [...byYear.entries()].sort((a, b) => a[0] - b[0]);
    return {
      categories: sorted.map(([year]) => year.toString()),
      seriesData: sorted.map(([, total]) => total),
    };
  }, [cases]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '55%',
      },
    },
    colors: ['#0779bf'],
    xaxis: {
      categories,
      labels: { style: { fontSize: '12px' } },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => {
          if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'M';
          if (val >= 1_000) return (val / 1_000).toFixed(0) + 'K';
          return val.toString();
        },
        style: { fontSize: '12px' },
      },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#eef1f5',
      strokeDashArray: 4,
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toLocaleString() + ' cases',
      },
    },
  };

  const series = [{ name: 'Cases', data: seriesData }];

  return (
    <div className="chart-container">
      <h3>Cases by Year</h3>
      {categories.length > 0 ? (
        <Chart options={options} series={series} type="bar" height={350} />
      ) : (
        <p style={{ color: '#999', padding: '40px 0', textAlign: 'center' }}>
          No data available
        </p>
      )}
    </div>
  );
}
