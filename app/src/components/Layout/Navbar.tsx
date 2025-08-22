import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-neutral-900 text-white px-4 py-2 flex items-center justify-between border-b border-neutral-700">
      {/* Left: Logo and App Name */}
      <div className="flex items-center gap-2">
        <button className="text-neutral-400 hover:text-white">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="flex items-center gap-1">
          <div className="bg-blue-600 rounded p-1">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
            </svg>
          </div>
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
        <button className="text-neutral-400 hover:text-white">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m8.66-10.66l-.71.71M4.05 4.05l-.71.71m16.97 10.97l-.71-.71M4.05 19.95l-.71-.71M21 12h-1M4 12H3"
            />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            U
          </div>
          <span className="text-sm">User</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
