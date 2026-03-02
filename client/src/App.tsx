import { useDashboardData } from './hooks/useDashboardData';
import Filters from './components/Filters';
import SummaryCards from './components/SummaryCards';
import CaseChart from './components/CaseChart';
import CaseMap from './components/CaseMap';
import CaseTable from './components/CaseTable';

export default function App() {
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

  return (
    <>
      <header className="header">
        <div>
          <h1>Disease Surveillance Dashboard</h1>
          <div className="subtitle">Neglected Tropical Diseases &amp; Malaria Reporting</div>
        </div>
      </header>

      <main className="dashboard">
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
      </main>
    </>
  );
}
