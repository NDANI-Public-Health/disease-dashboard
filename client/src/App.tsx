import { useState } from "react";
import { useDashboardData } from "./hooks/useDashboardData";
import Filters from "./components/Filters";
import CaseMap from "./components/CaseMap";
import CaseStackedChart from "./components/CaseStackedChart";
import CaseCombinedChart from "./components/CaseCombinedChart";
import CoverageDataTable from "./components/CoverageDataTable";
import EndemicityTable from "./components/EndemicityTable";
import NationalCasePieChart from "./components/NationalCasePieChart";
import PopulationCasePieChart from "./components/PopulationCasePieChart";
import CaseDelaysChart from "./components/CaseDelaysChart";

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
          <div className="flex items-center gap-4 ml-auto shrink-0">
            <span className="text-gray-700 font-medium">Dashboard</span>
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
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 transition-colors">
              Update
            </button>
          </div>
        </div>
        {loading ? (
          <div className="loading">Loading dashboard data...</div>
        ) : (
          <>
            <h1 className="text-5xl font-bold mb-2 border-l-4 border-amber-400 pl-2">
              Dashboards
            </h1>
            <p className="text-gray-600 mb-4">
              Please select a <span className="font-semibold">Country</span> and{" "}
              <span className="font-semibold">Disease</span>, and either{" "}
              <span className="font-semibold">Progress</span> or
              <span className="font-semibold"> Forecast</span> and click
              <span className="font-semibold"> Update</span> to view the
              dashboard.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <CoverageDataTable
                country={selectedCountry}
                disease={selectedDisease}
                year={2024}
              />
              <EndemicityTable
                country={selectedCountry}
                disease={selectedDisease}
                year={2024}
              />
              {/* <DemographicsTable cases={cases} year={2026} /> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <NationalCasePieChart
                cases={cases}
                year={2024}
                title="National PC Coverage"
                labels={[
                  "Population requiring PC that received PC",
                  "Population requiring PC that did not receive PC",
                ]}
                country={selectedCountry}
                disease={selectedDisease}
              />
              <PopulationCasePieChart
                cases={cases}
                year={2024}
                title="Population requiring PC that received PC vs. Population that was target for PC"
                labels={[
                  "Total population that was target for PC",
                  "Total population that was treated",
                ]}
                country={selectedCountry}
                disease={selectedDisease}
              />
            </div>

            <div className="charts-row">
              <CaseCombinedChart
                cases={cases}
                country={selectedCountry}
                year={2024}
                disease={selectedDisease}
              />
              <CaseStackedChart
                cases={cases}
                disease={selectedDisease}
                year={2024}
                country={selectedCountry}
              />
            </div>

            <CaseMap cases={cases} />

            <CaseDelaysChart
              country={selectedCountry}
              year={2024}
              disease={selectedDisease}
            />
          </>
        )}
      </main>
    </>
  );
}
