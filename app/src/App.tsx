import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Map from "./components/Map/Map";
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";

function App() {
  return (
    <>
      <Navbar />
      <Map />
    </>
  );
}

export default App;
