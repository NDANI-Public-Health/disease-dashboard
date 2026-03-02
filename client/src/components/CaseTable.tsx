import { useState, useMemo } from 'react';
import { CaseRecord } from '../types';

interface CaseTableProps {
  cases: CaseRecord[];
}

type SortKey = keyof CaseRecord;
type SortDir = 'asc' | 'desc';

export default function CaseTable({ cases }: CaseTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('country');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const sorted = useMemo(() => {
    return [...cases].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [cases, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: 'country', label: 'Country' },
    { key: 'disease', label: 'Disease' },
    { key: 'year', label: 'Year' },
    { key: 'cases', label: 'Cases' },
    { key: 'deaths', label: 'Deaths' },
    { key: 'population', label: 'Population' },
    { key: 'prevalence', label: 'Prevalence %' },
  ];

  return (
    <div className="table-container">
      <h3>Case Records ({sorted.length})</h3>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} onClick={() => handleSort(col.key)}>
                {col.label}
                <span className="sort-arrow">
                  {sortKey === col.key ? (sortDir === 'asc' ? ' \u25B2' : ' \u25BC') : ''}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(row => (
            <tr key={row.id}>
              <td>{row.country}</td>
              <td>{row.disease}</td>
              <td>{row.year}</td>
              <td>{row.cases.toLocaleString()}</td>
              <td>{row.deaths.toLocaleString()}</td>
              <td>{row.population.toLocaleString()}</td>
              <td>{row.prevalence.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
