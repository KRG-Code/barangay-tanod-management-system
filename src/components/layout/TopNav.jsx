import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../forms/ThemeToggle";
import { RiUser3Line, RiMenuLine } from "react-icons/ri";

export default function TopNav({ toggleSideNav }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    console.log("Logging out..."); // Debug log

    // Clear authentication tokens or user data
    localStorage.removeItem('token'); 
    sessionStorage.removeItem('token');

    closeDropdown(); // Close the dropdown

    // Redirect to the login page
    navigate('/');
  };

  const handleMyAccount = () => {
    closeDropdown(); // Close the dropdown
    navigate('/MyAccount'); // Redirect to the My Account page
  };

  const navItems = [
    { id: 1, component: <ThemeToggle />, label: "Theme Toggle" },
  ];

  return (
    <aside className="rounded-2xl TopNav relative">
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

          {/* User Icon with Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="text-2xl border-2 rounded-full p-1"
            >
              <RiUser3Line />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-6 w-48 TopNav shadow-lg rounded-lg z-50 hover:cursor-pointer text-center">
                <ul className="py-2 ml-5 mr-5 my-5">
                  <li
                    className="px-4 py-2 hover:bg-blue5 rounded-3xl"
                    onClick={handleMyAccount} // Navigate to My Account
                  >
                    My Account
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-blue5 rounded-3xl"
                    onClick={handleLogout} // Log out and redirect to login
                  >
                    Log Out
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Clicking outside the dropdown should close it */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={closeDropdown} // Close dropdown when clicking outside
        ></div>
      )}
    </aside>
  );
}
