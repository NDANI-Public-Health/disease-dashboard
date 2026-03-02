import { useState } from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import Filters from './components/Filters';
import SummaryCards from './components/SummaryCards';
import CaseChart from './components/CaseChart';
import CaseMap from './components/CaseMap';
import CaseTable from './components/CaseTable';
import OverviewTab from './components/OverviewTab';
import DataTab from './components/DataTab';

type Tab = 'overview' | 'progress' | 'data';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('progress');

  const {
    countries,
    diseases,
    cases,
    summary,
    selectedCountry,
    selectedDisease,
    setSelectedCountry,
    setSelectedDisease,
    loading,
  } = useDashboardData();

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'progress', label: 'Progress Dashboard' },
    { key: 'data', label: 'Data' },
  ];

  return (
    <>
      <header className="header">
        <div>
          <h1>Disease Surveillance Dashboard</h1>
          <div className="subtitle">Neglected Tropical Diseases &amp; Malaria Reporting</div>
        </div>
      </header>

      <main className="dashboard">
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab-btn${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && <OverviewTab />}

        {activeTab === 'progress' && (
          <>
            <Filters
              countries={countries}
              diseases={diseases}
              selectedCountry={selectedCountry}
              selectedDisease={selectedDisease}
              onCountryChange={setSelectedCountry}
              onDiseaseChange={setSelectedDisease}
            />
            {loading ? (
              <div className="loading">Loading dashboard data...</div>
            ) : (
              <>
                <SummaryCards summary={summary} />

                <div className="charts-row">
                  <CaseChart cases={cases} />
                  <CaseMap cases={cases} />
                </div>

                <CaseTable cases={cases} />
              </>
            )}
          </>
        )}

        {activeTab === 'data' && <DataTab />}
      </main>
    </>
  );
}
