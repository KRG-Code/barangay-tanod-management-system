import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../forms/ThemeToggle";
import { RiUser3Line, RiMenuLine } from "react-icons/ri";
import { useCombinedContext } from "../../contexts/useContext";

export default function TopNav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();
  const { toggleSideNav } = useCombinedContext();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.profilePicture) {
      setProfilePicture(`http://localhost:5000/uploads/${storedUser.profilePicture}`);
    }
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    closeDropdown();
    navigate('/');
  };

  const handleMyAccount = () => {
    closeDropdown();
    navigate('/MyAccount');
  };

  const navItems = [{ id: 1, component: <ThemeToggle />, label: "Theme Toggle" }];

  return (
    <aside className="rounded-2xl TopNav relative">
      <header className="bg-background text-text p-4 flex justify-between items-center rounded navigation">
        <button onClick={toggleSideNav} className="text-2xl">
          <RiMenuLine />
        </button>
        <div className="flex items-center m-2 space-x-5">
          {navItems.map((item) => (
            <span key={item.id} className="flex border-2 rounded-3xl text-2xl" title={item.label}>
              {item.component}
            </span>
          ))}
          <div className="relative">
            <button onClick={toggleDropdown} className="text-2xl border-2 rounded-full p-1">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="rounded-full w-8 h-8 object-cover" />
              ) : (
                <RiUser3Line />
              )}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-6 w-48 TopNav shadow-lg rounded-lg z-50 hover:cursor-pointer text-center">
                <ul className="py-2 ml-5 mr-5 my-5">
                  <li className="px-4 py-2 hover:bg-blue5 rounded-3xl" onClick={handleMyAccount}>
                    My Account
                  </li>
                  <li className="px-4 py-2 hover:bg-blue5 rounded-3xl" onClick={handleLogout}>
                    Log Out
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>
      {isDropdownOpen && <div className="fixed inset-0 z-10" onClick={closeDropdown}></div>}
    </aside>
  );
}
