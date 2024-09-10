import React, { useState } from 'react';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';

export default function Homepage() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="flex h-screen">
        {/* Sidebar taking full height without overlapping */}
        <SideNav isOpen={isSideNavOpen} isDarkMode={isDarkMode} />

        <div className="flex flex-col w-full">
          {/* TopNav aligned to right */}
          <TopNav toggleSideNav={toggleSideNav} />

          {/* Main content */}
          <main className={`main-content mt-16 ${isSideNavOpen ? 'side-nav-open' : ''}`}>
            {/* Add your main content here */}
          </main>
        </div>
      </div>
    </div>
  );
}
