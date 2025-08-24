import React from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

interface Props {
  isDrawing: boolean;
  toggleDrawing: () => void;
  applyAOI: () => void;
  hasAOI: boolean;
  sameAOI: boolean;
}

const Control: React.FC<Props> = ({
  isDrawing,
  toggleDrawing,
  applyAOI,
  hasAOI,
  sameAOI,
}) => {
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 space-y-3">
      <h2 className="text-white font-semibold text-sm flex items-center gap-2">
        <PencilSquareIcon className="w-4 h-4 text-white" />
        AOI Drawing
      </h2>
      <hr className="text-neutral-500" />

      <div className="space-y-4">
        <button
          onClick={toggleDrawing}
          className={`w-full py-2 rounded text-sm font-semibold ${
            isDrawing
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white `}
        >
          {isDrawing ? "Cancel Drawing" : "Start Drawing"}
        </button>

        <button
          onClick={applyAOI}
          disabled={!hasAOI || sameAOI}
          className={`w-full py-2 rounded text-sm font-semibold disabled:cursor-not-allowed ${
            hasAOI && !sameAOI
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
          }`}
        >
          Apply AOI
        </button>
      </div>
    </div>
  );
};

export default Control;
