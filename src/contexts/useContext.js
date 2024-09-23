import React, { createContext, useState, useEffect, useContext } from 'react'; 
import { useNavigate } from 'react-router-dom';

export const CombinedContext = createContext();

export const CombinedProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
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
