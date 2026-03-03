import { useMemo, useState, useRef } from "react";
import Chart from "react-apexcharts";
import { CaseRecord } from "../types";
import { useCoverageData } from "../hooks/useCoverageData";

interface CaseCombinedChartProps {
  cases: CaseRecord[];
  disease?: string;
  year?: number;
  title?: string;
  country?: string;
}

export default function CaseCombinedChart({
  cases,
  disease = "all diseases",
  year,
  title,
  country = "",
}: CaseCombinedChartProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const chartRef = useRef<ApexCharts | null>(null);
  const { data: coverageData, loading } = useCoverageData({
    country,
    disease,
    year,
  });

  // Process coverage data from API
  const { categories, chartData } = useMemo(() => {
    // Generate years from 2014-2024
    const years = Array.from({ length: 11 }, (_, i) => 2014 + i);
    const yearStrings = years.map((y) => y.toString());

    // Use coverage data from API
    const programmeSacCoverage: (number | null)[] = [];
    const nationalSacCoverage: (number | null)[] = [];
    const uisRequiringTreatment: number[] = [];
    const uisTreated: number[] = [];
    const uisAchievingEffectiveCoverage: number[] = [];

    for (let i = 0; i < years.length; i++) {
      const y = years[i];

      // Get coverage data from API for this year
      const yearCoverageData = coverageData.find((d) => d.year === y);

      // Use API data for coverage percentages
      programmeSacCoverage.push(yearCoverageData?.progSacCovPct ?? null);
      nationalSacCoverage.push(yearCoverageData?.natSacCovPct ?? null);

      // Use API data for IU metrics
      uisRequiringTreatment.push(yearCoverageData?.iuRequiringTreatment ?? 0);
      uisTreated.push(yearCoverageData?.iuTreated ?? 0);
      uisAchievingEffectiveCoverage.push(
        yearCoverageData?.iuEffectiveCoverage ?? 0,
      );
    }

    return {
      categories: yearStrings,
      chartData: {
        programmeSacCoverage,
        nationalSacCoverage,
        uisRequiringTreatment,
        uisTreated,
        uisAchievingEffectiveCoverage,
      },
    };
  }, [coverageData]);

  const handleDownloadImage = () => {
    if (chartRef.current) {
      chartRef.current.dataURI().then((result) => {
        if ("imgURI" in result) {
          const link = document.createElement("a");
          link.href = result.imgURI;
          link.download = "combined-chart.png";
          link.click();
        }
      });
    }
    setMenuOpen(false);
  };

  const handleDownloadPDF = () => {
    if (chartRef.current) {
      chartRef.current.dataURI().then((result) => {
        if ("imgURI" in result) {
          const win = window.open("", "_blank");
          if (win) {
            win.document.write(`
              <html>
                <head><title>Chart PDF</title></head>
                <body style="margin:0;display:flex;justify-content:center;align-items:center;">
                  <img src="${result.imgURI}" style="max-width:100%;"/>
                </body>
              </html>
            `);
            win.document.close();
            win.print();
          }
        }
      });
    }
    setMenuOpen(false);
  };

  const series = useMemo(
    () => [
      {
        name: "Programme SAC Coverage",
        type: "line",
        data: chartData.programmeSacCoverage,
      },
      {
        name: "National SAC Coverage",
        type: "line",
        data: chartData.nationalSacCoverage,
      },
      {
        name: "IUs requiring treatment",
        type: "column",
        data: chartData.uisRequiringTreatment,
      },
      {
        name: "IUs treated",
        type: "column",
        data: chartData.uisTreated,
      },
      {
        name: "IUs achieving effective coverage",
        type: "column",
        data: chartData.uisAchievingEffectiveCoverage,
      },
    ],
    [chartData],
  );

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "inherit",
      toolbar: { show: false },
      stacked: false,
    },
    stroke: {
      width: [3, 3, 0, 0, 0],
      curve: "smooth",
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
        borderRadius: 4,
      },
    },
    colors: [
      "#d86422", // Programme SAC Coverage
      "#2ecc71", // National SAC Coverage
      "#e9f1f7", // IUs requiring treatment
      "#3daeff", // IUs treated
      "#202f5d", // IUs achieving effective coverage
    ],
    fill: {
      opacity: [1, 1, 0.85, 0.85, 0.85],
    },
    markers: {
      size: [4, 4, 0, 0, 0],
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      categories,
      labels: {
        style: { fontSize: "12px" },
      },
    },
    yaxis: [
      {
        opposite: true,
        title: {
          text: "Coverage (%)",
          style: { fontSize: "12px", fontWeight: 600 },
        },
        labels: {
          formatter: (val: number) => `${val.toFixed(0)}%`,
          style: { fontSize: "12px" },
        },
        min: 0,
        max: 100,
      },
      {
        title: {
          text: "Number of Implementation Units",
          style: { fontSize: "12px", fontWeight: 600 },
        },
        labels: {
          formatter: (val: number) => val.toFixed(0),
          style: { fontSize: "12px" },
        },
        min: 0,
      },
    ],
    legend: {
      position: "bottom",
      fontSize: "11px",
      markers: {
        size: 10,
        offsetX: -4,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number, { seriesIndex }) => {
          // First 2 series are coverage lines (percentages)
          if (seriesIndex < 2) {
            return val !== null ? `${val.toFixed(1)}%` : "N/A";
          }
          // Last 3 series are implementation units (numbers)
          return val.toFixed(0) + " IUs";
        },
      },
    },
    grid: {
      borderColor: "#eef1f5",
      strokeDashArray: 4,
    },
  };

  if (loading) {
    return (
      <div className="chart-container overflow-hidden">
        <div className="bg-primary p-2 -mx-5 -mt-5 mb-4">
          <h3 className="text-lg font-semibold text-white">
            {title || `PC Coverage Trends Over Time`}
          </h3>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container overflow-hidden">
      <div className="bg-primary p-2 -mx-5 -mt-5 mb-4 flex items-center">
        <h3 className="text-lg font-semibold text-white">
          {title ||
            `PC Coverage Trends Over Time ${country ? `- ${country}` : ""}, ${disease}${year ? ` (${year})` : ""}`}
        </h3>
        <div className="ml-auto relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-white hover:bg-white/20 rounded transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-20 py-1">
                <button
                  onClick={handleDownloadImage}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Download Chart Image
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Download Chart PDF
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Chart
        ref={(chart: any) => {
          if (chart) {
            chartRef.current = chart.chart;
          }
        }}
        options={options}
        series={series}
        type="line"
        height={400}
      />
    </div>
  );
}
