import React from "react";
import { UserIcon } from "@heroicons/react/24/outline";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-neutral-900 text-white px-4 py-2 flex items-center justify-between border-b border-neutral-700">
      {/* Left: Logo and App Name */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <img src="/gee.png" width={40} height={40} />

          <span className="font-semibold text-lg">GEE DASHBOARD</span>
        </div>
      </div>

      {/* Center: Instansi Info */}
      <div className="hidden md:flex items-center gap-2 text-sm text-neutral-300">
        <span>
          Land Surface Temperature and Normalize Difference Vegetation Index
          Visualization
        </span>
      </div>

      {/* Right: Theme Toggle and User */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm">Public</span>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            <UserIcon className="w-4 h-4" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
