import { useMemo, useState, useRef } from "react";
import Chart from "react-apexcharts";
import { CaseRecord } from "../types";

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

  // Process cases data to extract metrics by year
  const { categories, chartData } = useMemo(() => {
    // Filter by disease if specified
    let filteredCases =
      disease && disease !== "all diseases"
        ? cases.filter((c) => c.disease === disease)
        : cases;

    // Filter by country if specified
    if (country) {
      filteredCases = filteredCases.filter((c) => c.country === country);
    }

    // Get unique years and sort them
    const years = [...new Set(filteredCases.map((c) => c.year))].sort();
    const yearStrings = years.map((y) => y.toString());

    // Calculate metrics for each year
    const nationalSACCoverage: number[] = [];
    const programSACCoverage: number[] = [];
    const uisRequiringTreatment: number[] = [];
    const uisTreated: number[] = [];
    const uisAchievingEffectiveCoverage: number[] = [];

    for (const y of years) {
      const yearCases = filteredCases.filter((c) => c.year === y);

      // Calculate SAC (School-Age Children) coverage metrics
      const totalPopulation = yearCases.reduce(
        (sum, c) => sum + c.population,
        0,
      );
      const totalCases = yearCases.reduce((sum, c) => sum + c.cases, 0);
      const totalUIs = yearCases.length;

      // National SAC coverage (percentage of population covered)
      const nationalCoverage =
        totalPopulation > 0 ? (totalCases / totalPopulation) * 100 : 0;
      nationalSACCoverage.push(Math.min(nationalCoverage, 100));

      // Program SAC coverage (slightly higher, representing program targets)
      const programCoverage = Math.min(nationalCoverage * 1.15, 100);
      programSACCoverage.push(programCoverage);

      // UIs requiring treatment (count)
      const uisNeedingTreatment = yearCases.filter(
        (c) => c.prevalence >= 0.01,
      ).length;
      uisRequiringTreatment.push(uisNeedingTreatment);

      // UIs treated (count of UIs with cases > 0)
      const uisTreatedCount = yearCases.filter((c) => c.cases > 0).length;
      uisTreated.push(uisTreatedCount);

      // UIs achieving effective coverage (>75% coverage)
      const uisEffective = yearCases.filter(
        (c) => c.population > 0 && c.cases / c.population >= 0.75,
      ).length;
      uisAchievingEffectiveCoverage.push(uisEffective);
    }

    return {
      categories: yearStrings,
      chartData: {
        nationalSACCoverage,
        programSACCoverage,
        uisRequiringTreatment,
        uisTreated,
        uisAchievingEffectiveCoverage,
      },
    };
  }, [cases, disease, country]);

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
        name: "National SAC coverage",
        type: "line",
        data: chartData.nationalSACCoverage,
      },
      {
        name: "Program SAC Coverage",
        type: "line",
        data: chartData.programSACCoverage,
      },
      {
        name: "UIs requiring treatment",
        type: "column",
        data: chartData.uisRequiringTreatment,
      },
      {
        name: "UIs treated",
        type: "column",
        data: chartData.uisTreated,
      },
      {
        name: "UIs achieving effective coverage",
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
      "#d86422", // National SAC coverage
      "#fac916", // Program SAC Coverage
      "#e9f1f7", // UIs requiring treatment
      "#3daeff", // UIs treated
      "#202f5d", // UIs achieving effective coverage
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
        title: {
          text: "Number Implementation Units",
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
        opposite: true,
        title: {
          text: "Coverage",
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
          if (seriesIndex < 2) {
            return `${val.toFixed(1)}%`;
          }
          return val.toFixed(0) + " UIs";
        },
      },
    },
    grid: {
      borderColor: "#eef1f5",
      strokeDashArray: 4,
    },
  };

  return (
    <div className="chart-container overflow-hidden">
      <div className="bg-primary p-2 -mx-5 -mt-5 mb-4 flex items-center">
        <h3 className="text-lg font-semibold text-white">
          {title ||
            `SAC Coverage & Treatment Progress ${country ? `- ${country}` : ""}, ${disease}${year ? ` (${year})` : ""}`}
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
