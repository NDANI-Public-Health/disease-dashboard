import { useMemo, useState, useRef } from "react";
import Chart from "react-apexcharts";
import { CaseRecord } from "../types";

interface CaseStackedChartProps {
  cases: CaseRecord[];
  disease?: string;
  year?: number;
  title?: string;
  country?: string;
}

export default function CaseStackedChart({
  cases,
  disease = "all diseases",
  year,
  title,
  country = "",
}: CaseStackedChartProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const chartRef = useRef<ApexCharts | null>(null);

  // Process cases data to extract prevalence categories by year
  const { categories, chartData } = useMemo(() => {
    // Filter by disease if specified
    let filteredCases =
      disease && disease !== "all diseases"
        ? cases.filter((c) => c.disease === disease)
        : cases;

    // Get unique years and sort them
    const years = [...new Set(filteredCases.map((c) => c.year))].sort();
    const yearStrings = years.map((y) => y.toString());

    // Calculate prevalence distribution for each year
    const highPrevalence: number[] = [];
    const moderatePrevalence: number[] = [];
    const lowPrevalence: number[] = [];
    const postIA50Plus: number[] = [];
    const postIA10to49: number[] = [];
    const postIA1to9: number[] = [];
    const surveillance: number[] = [];

    for (const y of years) {
      const yearCases = filteredCases.filter((c) => c.year === y);
      const total = yearCases.length || 1;

      // Categorize based on prevalence percentage
      const high = yearCases.filter((c) => c.prevalence >= 0.5).length;
      const moderate = yearCases.filter(
        (c) => c.prevalence >= 0.1 && c.prevalence < 0.5,
      ).length;
      const low = yearCases.filter(
        (c) => c.prevalence >= 0.01 && c.prevalence < 0.1,
      ).length;
      const surv = yearCases.filter((c) => c.prevalence < 0.01).length;

      // For post-IA categories, using mock distribution based on existing data
      const postHigh = Math.floor(high * 0.3);
      const postMod = Math.floor(moderate * 0.4);
      const postLow = Math.floor(low * 0.2);

      highPrevalence.push((high / total) * 100);
      moderatePrevalence.push((moderate / total) * 100);
      lowPrevalence.push((low / total) * 100);
      postIA50Plus.push((postHigh / total) * 100);
      postIA10to49.push((postMod / total) * 100);
      postIA1to9.push((postLow / total) * 100);
      surveillance.push((surv / total) * 100);
    }

    return {
      categories: yearStrings,
      chartData: {
        highPrevalence,
        moderatePrevalence,
        lowPrevalence,
        postIA50Plus,
        postIA10to49,
        postIA1to9,
        surveillance,
      },
    };
  }, [cases, disease]);

  const handleDownloadImage = () => {
    if (chartRef.current) {
      chartRef.current.dataURI().then((result) => {
        if ("imgURI" in result) {
          const link = document.createElement("a");
          link.href = result.imgURI;
          link.download = "stacked-chart.png";
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
        name: "High prevalence (50% and above)",
        data: chartData.highPrevalence,
      },
      {
        name: "Moderate prevalence (10%-49%)",
        data: chartData.moderatePrevalence,
      },
      {
        name: "Low prevalence (less than 10%)",
        data: chartData.lowPrevalence,
      },
      {
        name: ">=50% post-IA prevalence",
        data: chartData.postIA50Plus,
      },
      {
        name: "10-49% post-IA prevalence",
        data: chartData.postIA10to49,
      },
      {
        name: "1-9.9% post-IA prevalence",
        data: chartData.postIA1to9,
      },
      {
        name: "Surveillance (prevalence <1%)",
        data: chartData.surveillance,
      },
    ],
    [chartData],
  );

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      stackType: "100%",
      fontFamily: "inherit",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: "60%",
      },
    },
    colors: [
      "#ef0001", // High prevalence (50% and above)
      "#fcea00", // Moderate prevalence (10%-49%)
      "#f64ab6", // Low prevalence (less than 10%)
      "#202f5d", // >=50% post-IA prevalence
      "#296790", // 10-49% post-IA prevalence
      "#ffffdf", // 1-9.9% post-IA prevalence
      "#3daeff", // Surveillance (prevalence <1%)
    ],
    xaxis: {
      categories,
      labels: {
        style: { fontSize: "12px" },
      },
    },
    yaxis: {
      title: {
        text: "Number Implementation Units",
        style: { fontSize: "12px", fontWeight: 600 },
      },
      labels: {
        formatter: (val: number) => `${val.toFixed(0)}%`,
        style: { fontSize: "12px" },
      },
    },
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
      y: {
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
    },
    grid: {
      borderColor: "#eef1f5",
      strokeDashArray: 4,
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
  };

  return (
    <div className="chart-container overflow-hidden">
      <div className="bg-primary p-2 -mx-5 -mt-5 mb-4 flex items-center">
        <h3 className="text-lg font-semibold text-white">
          {title ||
            `Endemicity status across all endemic IUs  ${country}, ${disease}`}
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
        type="bar"
        height={400}
      />
    </div>
  );
}
