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

    // Generate years from 2014-2024
    const years = Array.from({ length: 11 }, (_, i) => 2014 + i);
    const yearStrings = years.map((y) => y.toString());

    // Calculate metrics for each year
    const programmeAdultCoverage: number[] = [];
    const programmeTotalCoverage: number[] = [];
    const nationalAdultCoverage: number[] = [];
    const nationalTotalCoverage: number[] = [];
    const uisRequiringTreatment: number[] = [];
    const uisTreated: number[] = [];
    const uisAchievingEffectiveCoverage: number[] = [];

    // Seed for consistent random generation
    const seededRandom = (seed: number): number => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < years.length; i++) {
      const y = years[i];
      const yearCases = filteredCases.filter((c) => c.year === y);

      // Calculate population metrics
      const totalPopulation =
        yearCases.length > 0
          ? yearCases.reduce((sum, c) => sum + c.population, 0)
          : 100000000; // Default population for years without data

      const totalTreated = yearCases.reduce((sum, c) => sum + c.cases, 0);

      // Simulate population breakdown (adults ~60% of total population)
      const adultPopulationRatio = 0.6;
      const popTotalEveryone = totalPopulation;
      const popTotalAdults = Math.floor(totalPopulation * adultPopulationRatio);

      // PopTrg (Programme Target Population) - typically 70-85% of total
      const targetRatio = 0.7 + seededRandom(y * 100) * 0.15;
      const popTrgEveryone = Math.floor(popTotalEveryone * targetRatio);
      const popTrgAdults = Math.floor(popTotalAdults * targetRatio);

      // PopReq (Required Population) - national level requirement, typically 80-95% of total
      const reqRatio = 0.8 + seededRandom(y * 200) * 0.15;
      const popReqEveryone = Math.floor(popTotalEveryone * reqRatio);
      const popReqAdults = Math.floor(popTotalAdults * reqRatio);

      // PopTreat (Treated Population) - simulate based on actual data with year progression
      // Coverage generally improves over time (2014-2024)
      const yearProgress = (y - 2014) / 10; // 0 to 1 over the decade
      const baseTreatmentRatio = 0.3 + yearProgress * 0.45; // 30% to 75% over time
      const treatmentVariation = seededRandom(y * 300) * 0.1 - 0.05;
      const treatmentRatio = Math.min(
        Math.max(baseTreatmentRatio + treatmentVariation, 0.2),
        0.9,
      );

      const popTreatEveryone =
        yearCases.length > 0
          ? totalTreated
          : Math.floor(popTotalEveryone * treatmentRatio);
      const popTreatAdults = Math.floor(
        popTreatEveryone *
          adultPopulationRatio *
          (1 + seededRandom(y * 400) * 0.1),
      );

      // Calculate coverage percentages
      // Programme Adult Coverage: (PopTreat (adults) / PopTrg (adults)) * 100%
      const progAdultCov =
        popTrgAdults > 0
          ? Math.min((popTreatAdults / popTrgAdults) * 100, 100)
          : 0;
      programmeAdultCoverage.push(progAdultCov);

      // Programme Total Coverage: (PopTreat (everyone) / PopTrg (everyone)) * 100%
      const progTotalCov =
        popTrgEveryone > 0
          ? Math.min((popTreatEveryone / popTrgEveryone) * 100, 100)
          : 0;
      programmeTotalCoverage.push(progTotalCov);

      // National Adult Coverage: (PopTreat (adults) / PopReq (adults)) * 100%
      const natAdultCov =
        popReqAdults > 0
          ? Math.min((popTreatAdults / popReqAdults) * 100, 100)
          : 0;
      nationalAdultCoverage.push(natAdultCov);

      // National Total Coverage: (PopTreat (everyone) / PopReq (everyone)) * 100%
      const natTotalCov =
        popReqEveryone > 0
          ? Math.min((popTreatEveryone / popReqEveryone) * 100, 100)
          : 0;
      nationalTotalCoverage.push(natTotalCov);

      // UIs (Implementation Units) metrics
      const totalUIs = Math.max(
        yearCases.length,
        Math.floor(10 + yearProgress * 20),
      );

      // UIs requiring treatment (count)
      const uisNeedingTreatment =
        yearCases.length > 0
          ? yearCases.filter((c) => c.prevalence >= 0.01).length
          : Math.floor(totalUIs * (0.7 + seededRandom(y * 500) * 0.2));
      uisRequiringTreatment.push(uisNeedingTreatment);

      // UIs treated (count of UIs with cases > 0)
      const uisTreatedCount =
        yearCases.length > 0
          ? yearCases.filter((c) => c.cases > 0).length
          : Math.floor(uisNeedingTreatment * treatmentRatio);
      uisTreated.push(uisTreatedCount);

      // UIs achieving effective coverage (>75% coverage)
      const uisEffective =
        yearCases.length > 0
          ? yearCases.filter(
              (c) => c.population > 0 && c.cases / c.population >= 0.75,
            ).length
          : Math.floor(uisTreatedCount * (0.3 + yearProgress * 0.4));
      uisAchievingEffectiveCoverage.push(uisEffective);
    }

    return {
      categories: yearStrings,
      chartData: {
        programmeAdultCoverage,
        programmeTotalCoverage,
        nationalAdultCoverage,
        nationalTotalCoverage,
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
        name: "Programme Adult Coverage",
        type: "line",
        data: chartData.programmeAdultCoverage,
      },
      {
        name: "Programme Total Coverage",
        type: "line",
        data: chartData.programmeTotalCoverage,
      },
      {
        name: "National Adult Coverage",
        type: "line",
        data: chartData.nationalAdultCoverage,
      },
      {
        name: "National Total Coverage",
        type: "line",
        data: chartData.nationalTotalCoverage,
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
      width: [3, 3, 3, 3, 0, 0, 0],
      curve: "smooth",
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
        borderRadius: 4,
      },
    },
    colors: [
      "#d86422", // Programme Adult Coverage
      "#fac916", // Programme Total Coverage
      "#2ecc71", // National Adult Coverage
      "#9b59b6", // National Total Coverage
      "#e9f1f7", // UIs requiring treatment
      "#3daeff", // UIs treated
      "#202f5d", // UIs achieving effective coverage
    ],
    fill: {
      opacity: [1, 1, 1, 1, 0.85, 0.85, 0.85],
    },
    markers: {
      size: [4, 4, 4, 4, 0, 0, 0],
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
          // First 4 series are coverage lines (percentages)
          if (seriesIndex < 4) {
            return `${val.toFixed(1)}%`;
          }
          // Last 3 series are implementation units (numbers)
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
