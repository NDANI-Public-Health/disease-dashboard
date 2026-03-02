export default function DataTab() {
  return (
    <div className="data-tab">
      <h2>Data Downloads</h2>
      <p className="data-tab-description">
        Download the underlying datasets used in this dashboard for your own
        analysis and reporting.
      </p>

      <div className="download-card">
        <div className="download-info">
          <h3>Disease Surveillance Dataset</h3>
          <p>
            Complete case records including country, disease, year, cases,
            deaths, population, and prevalence figures.
          </p>
          <span className="file-meta">CSV format</span>
        </div>
        <a href="#" className="download-link" onClick={e => e.preventDefault()}>
          Download File
        </a>
      </div>
    </div>
  );
}
