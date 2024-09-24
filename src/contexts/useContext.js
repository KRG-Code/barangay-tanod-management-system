import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const CombinedContext = createContext();

export const CombinedProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userType, setUserType] = useState(null); // State to store userType
  const navigate = useNavigate();

  // Fetch user data to get userType
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserType(data.userType); // Set userType from fetched data
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    if (token) {
      fetchData(); // Fetch user type on token change or mount
    }
  }, [token]);

  // Logout function clears token and userType
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserType(null); // Clear userType on logout
    navigate('/');
  };

  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const [isOpen, setIsOpen] = useState(false);
  const toggleSideNav = () => setIsOpen((prev) => !prev);
  const closeSideNav = () => setIsOpen(false);

  return (
    <CombinedContext.Provider
      value={{
        token,
        setToken,
        userType, // Add userType to context
        logout,
        isDarkMode,
        toggleTheme: () => setIsDarkMode(prev => !prev),
        isOpen,
        toggleSideNav,
        closeSideNav,
      }}
    >
      {children}
    </CombinedContext.Provider>
  );
};

export const useCombinedContext = () => useContext(CombinedContext);
