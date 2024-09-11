import React from "react";
import { RiGovernmentFill } from "react-icons/ri";
import { buttonData } from "../constants/navButtons"; // Import the buttonData array
import "../App.css";

export default function SideNav({ isOpen, isDarkMode }) {
  return (
    <aside
      className={`SideNav text-text h-screen ${
        isOpen ? "w-52" : "w-24"
      } flex flex-col items-center rounded-2xl navigation`}
    >
      <div className="p-4 flex flex-col items-center">
        {/* LGU icon with secondary colors */}
        <RiGovernmentFill className="text-4xl mb-2 text-blue-900" />
        <div className="text-lg font-bold">{isOpen ? "BTS" : "BTS"}</div>
      </div>
      <nav className="mt-10 flex-grow flex flex-col">
        <ul className="w-full">
          {buttonData.map((item, index) => (
            <li
              key={index}
              className="mb-2 w-full border rounded-3xl border-transparent"
            >
              <a
                href={`#${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex items-center p-3 border border-transparent rounded-3xl navList"
              >
                <span className="text-xl flex items-center justify-center p-1 navIcon">
                  {item.icon}
                </span>
                {isOpen && <span className="ml-4">{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
