import React from "react";
import ThemeToggle from "./ThemeToggle";
import { RiUser3Line, RiMenuLine } from "react-icons/ri";

export default function TopNav({ toggleSideNav }) {
  const navItems = [
    { id: 1, component: <ThemeToggle />, label: "Theme Toggle" },
    { id: 2, component: <RiUser3Line />, label: "User Icon" }
  ];

  return (
    <aside className="rounded-2xl TopNav">
      <header className="bg-background text-text p-4 flex justify-between items-center rounded navigation">
        <button onClick={toggleSideNav} className="text-2xl">
          <RiMenuLine />
        </button>
        <div className="flex items-center m-2 space-x-5">
          {navItems.map((item) => (
            <span
              key={item.id}
              className="flex border-2 rounded-3xl text-2xl"
              title={item.label}
            >
              {item.component}
            </span>
          ))}
        </div>
      </header>
    </aside>
  );
}
