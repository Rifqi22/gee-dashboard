import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import TimeSeries from "../../Chart/TimeSeries";
import { exportReport } from "./ExportReport";

interface Props {
  summary: {
    layer: string;
    min: number;
    max: number;
    unit?: string;
  }[];
  mapContainerId: string;
  timeSeries: {
    lst: { month: string; value: number | null }[];
    ndvi: { month: string; value: number | null }[];
  };
}

const Report: React.FC<Props> = ({ summary, timeSeries }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  console.log("SUMMARY", summary);
  console.log("✅ Report component loaded from Map/Reports/Report.tsx");

  return (
    <div className="bg-neutral-900 rounded-md p-4 mt-4 w-full max-w-3xl mx-auto shadow-lg">
      <div className="flex flex-col gap-6 items-center justify-between">
        <div>
          <h2 className="text-white text-sm font-semibold">
            📄 Export Dashboard Report
          </h2>
          <p className="text-neutral-400 text-xs mt-1">
            Includes chart, summary stats, and map snapshot.
          </p>
        </div>
        <button
          onClick={() => exportReport({ summary, chartRef })}
          className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm px-4 py-2 rounded-md transition"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          Export PDF
        </button>
      </div>

      {/* Chart container to capture */}
      <div
        ref={chartRef}
        style={{ backgroundColor: "#171717", color: "#fff" }}
        className="mt-4"
      >
        <TimeSeries data={timeSeries} />
      </div>
    </div>
  );
};

export default Report;
