import React, { useState } from "react";
import SideNav from "../components/layout/SideNav";
import TopNav from "../components/layout/TopNav";
import MyAcc from "../components/auth/MyAcc";

export default function MyAccount(){
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [isDarkMode] = useState(false); // If only isDarkMode is being used

  
    const toggleSideNav = () => {
      setIsSideNavOpen(!isSideNavOpen);
    };

    return(
    <div className={`App ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="flex h-screen">
        {/* Sidebar taking full height without overlapping */}
        <SideNav isOpen={isSideNavOpen} toggleSideNav={toggleSideNav} />

        <div className="flex flex-col w-full">
          {/* TopNav aligned to right */}
          <TopNav toggleSideNav={toggleSideNav} />

          {/* Main content with routes */}
          <main className="main-content mt-16">
            <MyAcc />
          </main>
        </div>
      </div>
    </div>
    );
}