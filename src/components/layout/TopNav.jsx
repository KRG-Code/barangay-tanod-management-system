import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RiUser3Line, RiMenuLine, RiMessage3Line, RiNotification3Line } from "react-icons/ri";
import ThemeToggle from "../forms/ThemeToggle";
import { useCombinedContext } from "../../contexts/useContext";
import NotificationList from "../notifications/NotificationList";
import MessageList from "../messages/MessageList"; // Assuming you'll create a MessageList component similar to NotificationList

export default function TopNav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showNotificationList, setShowNotificationList] = useState(false); // For notifications dropdown
  const [showMessageList, setShowMessageList] = useState(false); // For messages dropdown
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false); // For unread notification badge
  const dropdownRef = useRef(null); // For detecting outside clicks
  const notificationRef = useRef(null); // For detecting outside clicks on notification
  const messageRef = useRef(null); // For detecting outside clicks on message dropdown
  const navigate = useNavigate();
  const { toggleSideNav } = useCombinedContext();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      fetch(`${process.env.REACT_APP_API_URL}/users/${storedUser.id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.profilePicture) {
            setProfilePicture(data.profilePicture);
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }

    // Check for unread notifications
    checkUnreadNotifications();

    // Close dropdown when clicking outside
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to check if there are unread notifications
  const checkUnreadNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications/unread`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setHasUnreadNotifications(data.hasUnread);
    } catch (error) {
      console.error("Error checking unread notifications:", error);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMessagesDropdown = () => {
    setShowMessageList(!showMessageList);
    setShowNotificationList(false); // Close notification dropdown when opening messages
  };

  const toggleNotificationsDropdown = () => {
    setShowNotificationList(!showNotificationList);
    setShowMessageList(false); // Close message dropdown when opening notifications
    if (showNotificationList) markNotificationsAsRead();
  };

  // Mark notifications as read when dropdown is opened
  const markNotificationsAsRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/notifications/mark-read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setHasUnreadNotifications(false);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Handle click outside to close dropdowns
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current && !dropdownRef.current.contains(event.target) &&
      notificationRef.current && !notificationRef.current.contains(event.target) &&
      messageRef.current && !messageRef.current.contains(event.target)
    ) {
      closeAllDropdowns();
    }
  };

  const closeAllDropdowns = () => {
    setIsDropdownOpen(false);
    setShowMessageList(false);
    setShowNotificationList(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    closeAllDropdowns();
    navigate("/");
  };

  const handleMyAccount = () => {
    closeAllDropdowns();
    navigate("/myaccount");
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

          {/* Message Button with Dropdown */}
          <div className="relative" ref={messageRef}>
            <button onClick={toggleMessagesDropdown} className="text-2xl p-1" title="Messages">
              <RiMessage3Line />
            </button>
            {showMessageList && <MessageList />}
          </div>

          {/* Notification Button with Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button onClick={toggleNotificationsDropdown} className="text-2xl p-1 relative" title="Notifications">
              <RiNotification3Line />
              {hasUnreadNotifications && (
                <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </button>
            {showNotificationList && <NotificationList onClose={toggleNotificationsDropdown} />}
          </div>

          {/* Profile Picture and Account Dropdown */}
          <div className="relative" ref={dropdownRef}>
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
    </aside>
  );
}
