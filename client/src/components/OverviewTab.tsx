export default function OverviewTab() {
  return (
    <div className="overview-tab">
      <h2>Indicator Definitions</h2>

      <div className="indicator-card">
        <h3>Total Cases</h3>
        <p>
          The cumulative number of confirmed disease cases reported within the
          selected country and time period. This includes all laboratory-confirmed
          and clinically diagnosed cases submitted through national surveillance
          systems.
        </p>
      </div>

      <div className="indicator-card">
        <h3>Total Deaths</h3>
        <p>
          The total number of deaths directly attributed to the selected disease(s).
          Mortality figures are compiled from health facility records and
          community-based surveillance reports.
        </p>
      </div>

      <div className="indicator-card">
        <h3>Countries Affected</h3>
        <p>
          The number of distinct countries reporting at least one confirmed case
          for the selected disease within the reporting period. This indicator
          reflects the geographic spread across the African region.
        </p>
      </div>

      <div className="indicator-card">
        <h3>Average Prevalence (%)</h3>
        <p>
          The mean proportion of the population affected by the selected
          disease(s), expressed as a percentage. Calculated as the average of
          (reported cases / total population) across all filtered records.
        </p>
      </div>

      <div className="indicator-card">
        <h3>Cases by Year</h3>
        <p>
          A year-over-year breakdown of reported cases, used to identify temporal
          trends such as seasonal peaks, outbreak patterns, and the impact of
          intervention programmes over time.
        </p>
      </div>

      <div className="indicator-card">
        <h3>Geographic Distribution</h3>
        <p>
          A map-based visualisation showing the spatial distribution of disease
          burden across countries. Circle size and intensity correspond to the
          total number of cases reported per country.
        </p>
      </div>

      <div className="indicator-card">
        <h3>Prevalence</h3>
        <p>
          The proportion of a given population found to have a condition at a
          specific point in time. Expressed as cases per 100 population. Used to
          compare disease burden across countries of different population sizes.
        </p>
      </div>
    </div>
  );
}
