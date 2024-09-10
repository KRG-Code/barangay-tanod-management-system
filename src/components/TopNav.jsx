import React from "react";
import ThemeToggle from "./ThemeToggle";
import { RiUser3Line, RiMenuLine } from "react-icons/ri";


export default function TopNav({ toggleSideNav }) {
  // Array of components and their corresponding key identifiers
  const navItems = [
    { id: 1, component: <ThemeToggle />, label: "Theme Toggle" },,
    { id: 2, component: <RiUser3Line />, label: "User Icon" }
  ];

  return (
    <aside className="rounded-xl ml-5">
      <header className="bg-background text-text shadow p-4 flex justify-between items-center rounded">
        <button onClick={toggleSideNav} className="text-2xl">
        <RiMenuLine /> {/* Hamburger Icon */}
        </button>
        <div className="flex items-center m-2 space-x-5">
          {navItems.map((item) => (
            <span
              key={item.id}
              className="flex border-2 rounded-3xl border-transparent text-2xl"
              title={item.label}  // Adding label as a tooltip for clarity
            >
              {item.component}
            </span>
          ))}
        </div>
      </header>
    </aside>
  );
}