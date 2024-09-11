import React, { useState } from "react";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import MainContent from "../components/MainContent";

export default function Homepage() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  return (
    <div className={`App ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="flex h-screen">
        {/* Sidebar taking full height without overlapping */}
        <SideNav isOpen={isSideNavOpen} toggleSideNav={toggleSideNav} />

        <div className="flex flex-col w-full">
          {/* TopNav aligned to right */}
          <TopNav toggleSideNav={toggleSideNav} />

          {/* Main content */}
          <main
            className={`main-content mt-16 ${isSideNavOpen ? "side-nav-open" : ""}`}
          >
            <MainContent />
          </main>
        </div>
      </div>
    </div>
  );
}
