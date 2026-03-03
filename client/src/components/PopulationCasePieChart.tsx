import { useMemo, useState, useRef } from "react";
import Chart from "react-apexcharts";
import { CaseRecord } from "../types";
import { usePieChartData } from "../hooks/usePieChartData";

interface PopulationCasePieChartProps {
  cases?: CaseRecord[];
  year?: number;
  labels?: string[];
  country?: string;
  disease?: string;
  title?: string;
}

export default function PopulationCasePieChart({
  cases,
  year = 2024,
  labels = ["Pop targeted treated", "Pop targeted not treated"],
  country,
  disease = "all diseases",
  title,
}: PopulationCasePieChartProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const chartRef = useRef<ApexCharts | null>(null);
  const { targetVsTreatedData, loading } = usePieChartData({
    country,
    disease,
    year,
  });

  const handleDownloadImage = () => {
    if (chartRef.current) {
      chartRef.current.dataURI().then((result) => {
        if ("imgURI" in result) {
          const link = document.createElement("a");
          link.href = result.imgURI;
          link.download = "chart.png";
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
          // Create a simple PDF with the chart image
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

  const { seriesData, totalPopulation } = useMemo(() => {
    // Use targetVsTreatedData from the API (Total targetPop)
    return {
      seriesData: [targetVsTreatedData.treated, targetVsTreatedData.notTreated],
      totalPopulation: targetVsTreatedData.targeted,
    };
  }, [targetVsTreatedData]);

  if (loading) {
    return (
      <div className="chart-container overflow-hidden">
        <div className="bg-primary p-2 -mx-5 -mt-5 mb-4">
          <h3 className="text-lg font-semibold text-white">
            {title || `Population Targeted vs Treated`}
          </h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "pie",
      fontFamily: "inherit",
    },
    labels,
    colors: ["#646464", "#3daeff"],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: {
        fontSize: "12px",
        fontWeight: 600,
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toLocaleString() + " people",
      },
    },
    stroke: {
      width: 2,
      colors: ["#fff"],
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="chart-container overflow-hidden">
      <div className="bg-primary p-2 -mx-5 -mt-5 mb-4 flex items-center">
        <h3 className="text-lg font-semibold text-white">
          {title ||
            `${title} ${country || "All Countries"}, ${disease} (${year})`}
        </h3>
        <div className="ml-auto relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-white hover:bg-white/20 rounded transition-colors"
          >
            {/* Hamburger icon (3 dots vertical) */}
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
      {seriesData.some((val) => val > 0) ? (
        <>
          <Chart
            ref={(chart: any) => {
              if (chart) {
                chartRef.current = chart.chart;
              }
            }}
            options={options}
            series={seriesData}
            type="pie"
            height={280}
          />
          <div className="text-center py-3">
            <span className="text-sm font-semibold text-gray-700">
              Total population requiring PC {year}:{" "}
              <span className="text-primary">
                {totalPopulation.toLocaleString()}
              </span>
            </span>
          </div>
          {/* Custom Legend */}
          <div className="flex justify-center gap-6 pb-3">
            {labels?.map((label, index) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: ["#646464", "#3daeff"][index] }}
                />
                <span className="text-xs text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p style={{ color: "#999", padding: "40px 0", textAlign: "center" }}>
          No data available
        </p>
      )}
    </div>
  );
}
