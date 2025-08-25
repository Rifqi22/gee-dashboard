# GIS Dashboard Frontend App

This folder contains the frontend application for the GIS Dashboard, built with React, TypeScript, Vite, and Tailwind CSS. The app provides interactive geospatial visualization and analysis features, connecting to the backend API for data.

## Features

- Interactive map with LST and NDVI layers
- Time series chart visualization
- Area selection and date filtering
- Legend and map controls
- Exportable reports
- Responsive layout with sidebar and navbar

## Folder Structure

```
app/
│
├── index.html                # Main HTML entry point for the application, includes the root div for React.
├── package.json              # Lists project dependencies, scripts, and metadata for the frontend app.
├── postcss.config.js         # Configuration for PostCSS, used for processing CSS (e.g., with Tailwind).
├── tailwind.config.js        # Tailwind CSS configuration file, defines custom styles and theme settings.
├── tsconfig*.json            # TypeScript configuration files for app, node, and general settings.
├── vite.config.js            # Vite build and development server configuration.
├── public/
│   ├── gee.png               # Static image asset used in the app.
│   └── vite.svg              # Static SVG asset, typically used for branding or icons.
└── src/
    ├── App.tsx               # Main React component, serves as the root of the component tree.
    ├── main.tsx              # Entry point for React, renders the App component into the DOM.
    ├── App.css               # Styles specific to the App component.
    ├── index.css             # Global styles applied throughout the application.
    ├── assets/               # Folder for static assets used in the frontend.
    │   └── react.svg         # SVG asset, often used for React branding or icons.
    ├── components/           # Contains all reusable and page-level React components.
    │   ├── Chart/
    │   │   └── TimeSeries.tsx        # Component for rendering time series charts (e.g., LST/NDVI).
    │   ├── Core/
    │   │   ├── Panel.tsx             # Panel component for displaying grouped content or controls.
    │   │   └── Wrapper.tsx           # Wrapper component for layout or context management.
    │   ├── Layout/
    │   │   ├── Navbar.tsx            # Top navigation bar component.
    │   │   └── Sidebar.tsx           # Sidebar navigation/menu component.
    │   ├── Map/
    │   │   ├── Copyright.tsx         # Displays copyright information on the map.
    │   │   ├── DateSelector.tsx      # UI for selecting date ranges for map data.
    │   │   ├── Legend.tsx            # Map legend component for LST/NDVI color scales.
    │   │   ├── Map.tsx               # Main interactive map component.
    │   │   ├── MapPopup.tsx          # Popup component for displaying pixel or area data on the map.
    │   │   ├── TileLayerUpdater.tsx  # Handles updating map tile layers based on user input.
    │   │   ├── Control/
    │   │   │   ├── MapControl.tsx    # General map control component (e.g., layer toggles).
    │   │   │   ├── View.tsx          # Controls for changing map view or extent.
    │   │   │   └── Zoom.tsx          # Zoom control buttons for the map.
    │   │   ├── Drawer/
    │   │   │   ├── Control.tsx       # Controls for the drawer UI (side panel).
    │   │   │   └── Drawer.tsx        # Drawer component for additional options or reports.
    │   │   ├── Reports/
    │   │   │   ├── ExportReport.tsx  # Component for exporting map or chart reports.
    │   │   │   ├── Report.tsx        # Displays report data and summaries.
    │   │   │   └── ReportTrigger.tsx # Button or UI to trigger report generation.
    │   │   ├── Toggle/
    │   │   │   ├── Basemap.tsx       # Basemap toggle control for switching map backgrounds.
    │   │   │   ├── Layer.tsx         # Layer toggle control for showing/hiding map layers.
    │   │   │   └── LayerControl.tsx  # Main control for managing map layers.
    │   └── utils/
    │       ├── constant.ts           # File for storing constants used across the app.
    │       └── index.ts              # Utility functions for the frontend
```

## Setup

1. **Install dependencies**

   ```
   pnpm install
   ```

   or

   ```
   npm install
   ```

2. **Create the .env file with this value**
   VITE_API_BASE=http://127.0.0.1:8000/api

3. **Run the development server**

   ```
   pnpm dev
   ```

   or

   ```
   npm run dev
   ```

4. **Build for production**
   ```
   pnpm build
   ```
   or
   ```
   npm run build
   ```

## Notes

- The app expects the backend API to be running and accessible.
- Map and chart components interact with API endpoints for geospatial data.
- Tailwind CSS is used for styling and layout.
