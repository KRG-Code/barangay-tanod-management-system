import React, { useEffect } from "react";
import { RiGovernmentFill } from "react-icons/ri";
import { buttonData } from "../constants/navButtons";
import { NavLink } from "react-router-dom";
import { useCombinedContext } from "../../contexts/useContext";

export default function SideNav() {
  const { isOpen, closeSideNav } = useCombinedContext();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && !isOpen) {
        closeSideNav(); // Ensure it remains open above 768px
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  const handleNavClick = () => {
    if (window.innerWidth <= 768) {
      closeSideNav(); // Close on mobile view only
    }
  };

  return (
    <>
      <aside className={`SideNav mr-5 text-text h-screen ${isOpen ? "SideNav-open" : "SideNav-close"} flex flex-col items-center rounded-2xl`}>
        <div className="p-4 flex flex-col items-center">
          <RiGovernmentFill className="text-4xl mb-2 text-blue-900" />
          <div className="text-lg font-bold">BTMS</div>
        </div>
        <nav className="mt-10 flex-grow flex flex-col">
          <ul className="w-full">
            {buttonData.map((item, index) => (
              <li key={index} className="mb-2 w-full border rounded-3xl border-transparent">
                <NavLink
                  to={`/${item.label.charAt(0).toUpperCase() + item.label.slice(1).toLowerCase().replace(/\s+/g, "")}`}
                  className="flex items-center p-3 border border-transparent rounded-3xl navList"
                  onClick={handleNavClick} // Close the sidebar on mobile only
                >
                  <span className="text-xl flex items-center justify-center p-1 navIcon">
                    {item.icon}
                  </span>
                  {isOpen && <span className="ml-4">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {isOpen && <div className="overlay" onClick={closeSideNav}></div>}
    </>
  );
}
