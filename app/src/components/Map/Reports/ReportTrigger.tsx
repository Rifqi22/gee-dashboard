import { useRef } from "react";
import { exportReport } from "./ExportReport";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

interface Props {
  summary: SummaryItem[];
}
interface SummaryItem {
  layer: string;
  min: number;
  max: number;
  mean?: number;
  unit?: string;
}

const ReportTrigger: React.FC<Props> = ({ summary }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  return (
    <button
      onClick={() =>
        exportReport({
          summary,
          chartRef,
        })
      }
      className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-md transition flex items-center gap-2"
    >
      <ArrowDownTrayIcon className="h-4 w-4" />
      Export Report
    </button>
  );
};

export default ReportTrigger;
