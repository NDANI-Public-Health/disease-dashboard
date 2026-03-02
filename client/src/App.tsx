import { useState } from "react";
import { useDashboardData } from "./hooks/useDashboardData";
import Filters from "./components/Filters";
import SummaryCards from "./components/SummaryCards";
import CaseChart from "./components/CaseChart";
import CaseMap from "./components/CaseMap";
import CaseTable from "./components/CaseTable";
import OverviewTab from "./components/OverviewTab";
import DataTab from "./components/DataTab";
import DemographicsTable from "./components/DemographicsTable";
import CasePieChart from "./components/CasePieChart";
import CaseStackedChart from "./components/CaseStackedChart";
import CaseCombinedChart from "./components/CaseCombinedChart";

type Tab = "overview" | "progress" | "data";

const checkboxOptions = [
  { key: "progress", label: "Progress" },
  { key: "forecast", label: "Forecast" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("progress");

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
    { key: "overview", label: "Overview" },
    { key: "progress", label: "Progress Dashboard" },
    { key: "data", label: "Data" },
  ];

  return (
    <>
      <header className="header">
        <div>
          <h1>Disease Surveillance Dashboard</h1>
          <div className="subtitle">
            Neglected Tropical Diseases &amp; Malaria Reporting
          </div>
        </div>
      </header>

      <main className="dashboard">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <Filters
            countries={countries}
            diseases={diseases}
            selectedCountry={selectedCountry}
            selectedDisease={selectedDisease}
            onCountryChange={setSelectedCountry}
            onDiseaseChange={setSelectedDisease}
          />
          <div className="flex gap-4 ml-auto flex-shrink-0">
            Dashboard
            {checkboxOptions.map((option) => (
              <label
                key={option.key}
                className="inline-flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  checked={activeTab === option.key}
                  onChange={() => setActiveTab(option.key as Tab)}
                />
                <span className="ml-2 text-gray-700 font-medium">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn${activeTab === tab.key ? " active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && <OverviewTab />}

        {activeTab === "progress" &&
          (loading ? (
            <div className="loading">Loading dashboard data...</div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-2">Dashboards</h1>
              <p className="text-gray-600 mb-4">
                Please select a <span className="font-semibold">Country</span>{" "}
                and <span className="font-semibold">Disease</span>, and either{" "}
                <span className="font-semibold">Progress</span> or
                <span className="font-semibold"> Forecast</span> and click
                <span className="font-semibold"> Update</span> to view the
                dashboard.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <DemographicsTable />
                <CasePieChart
                  cases={cases}
                  year={2026}
                  labels={[
                    "Population requiring PC that received PC",
                    "Population requiring PC that did not receive PC",
                  ]}
                  country={selectedCountry}
                  disease={selectedDisease}
                />
              </div>

              <div className="charts-row">
                <CaseCombinedChart cases={cases} />
                <CaseStackedChart
                  cases={cases}
                  disease={selectedDisease}
                  year={2026}
                  country={selectedCountry}
                />
              </div>

              <CaseMap cases={cases} />

              {/* <CaseTable cases={cases} /> */}
            </>
          ))}

        {activeTab === "data" && <DataTab />}
      </main>
    </>
  );
}
