import { useMemo, useState, useRef } from "react";
import Chart from "react-apexcharts";
import { CaseRecord } from "../types";
import { useEndemicityData } from "../hooks/useEndimicityData";

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
  const {
    data: endemicityData,
    endemicityLevels,
    loading,
  } = useEndemicityData({
    year,
    disease,
    country,
  });

  // Process endemicity data from API
  const { categories, chartData, colorMap } = useMemo(() => {
    // Generate years from 2014-2024
    const years = Array.from({ length: 11 }, (_, i) => 2014 + i);
    const yearStrings = years.map((y) => y.toString());

    // Get unique endemicity levels and their colors from the API data
    const levelColorMap: Record<string, string> = {};
    endemicityData.forEach((item) => {
      if (!levelColorMap[item.endemicityLevel]) {
        levelColorMap[item.endemicityLevel] = item.colorHex;
      }
    });

    // Calculate IU counts for each endemicity level by year
    const highPrevalence: number[] = [];
    const moderatePrevalence: number[] = [];
    const lowPrevalence: number[] = [];
    const nonEndemic: number[] = [];

    for (const y of years) {
      const yearData = endemicityData.filter((d) => d.year === y);

      const high = yearData.find((d) => d.endemicityLevel === "High");
      const moderate = yearData.find((d) => d.endemicityLevel === "Moderate");
      const low = yearData.find((d) => d.endemicityLevel === "Low");
      const nonEnd = yearData.find((d) => d.endemicityLevel === "Non-endemic");

      highPrevalence.push(high?.iuRequiringPc ?? 0);
      moderatePrevalence.push(moderate?.iuRequiringPc ?? 0);
      lowPrevalence.push(low?.iuRequiringPc ?? 0);
      nonEndemic.push(nonEnd?.iuRequiringPc ?? 0);
    }

    return {
      categories: yearStrings,
      chartData: {
        highPrevalence,
        moderatePrevalence,
        lowPrevalence,
        nonEndemic,
      },
      colorMap: levelColorMap,
    };
  }, [endemicityData]);

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
        name: "Non-endemic",
        data: chartData.nonEndemic,
      },
    ],
    [chartData],
  );

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
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
      colorMap["High"] || "#c62828", // High prevalence (50% and above)
      colorMap["Moderate"] || "#ffb300", // Moderate prevalence (10%-49%)
      colorMap["Low"] || "#fff176", // Low prevalence (less than 10%)
      colorMap["Non-endemic"] || "#b0bec5", // Non-endemic
    ],
    xaxis: {
      categories,
      labels: {
        style: { fontSize: "12px" },
      },
    },
    yaxis: {
      title: {
        text: "Number of Implementation Units",
        style: { fontSize: "12px", fontWeight: 600 },
      },
      labels: {
        formatter: (val: number) => val.toFixed(0),
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
        formatter: (val: number) => `${val.toFixed(0)} IUs`,
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

  if (loading) {
    return (
      <div className="chart-container overflow-hidden">
        <div className="bg-primary p-2 -mx-5 -mt-5 mb-4">
          <h3 className="text-lg font-semibold text-white">
            {title || `Endemicity status across all endemic IUs`}
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
