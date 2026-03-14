import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const themes = {
  normal: {
    name: 'Normal',
    primary: '#FF6B6B',
    background: '#f9fafb',
    cardBg: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    hover: '#f3f4f6'
  },
  dark: {
    name: 'Dark',
    primary: '#FF6B6B',
    background: '#0f0f23',
    cardBg: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#94a3b8',
    border: '#2d2d44',
    hover: '#252538'
  },
  blue: {
    name: 'Azul',
    primary: '#3b82f6',
    background: '#eff6ff',
    cardBg: '#ffffff',
    text: '#1e3a8a',
    textSecondary: '#60a5fa',
    border: '#bfdbfe',
    hover: '#dbeafe'
  },
  pink: {
    name: 'Rosa',
    primary: '#ec4899',
    background: '#fdf2f8',
    cardBg: '#ffffff',
    text: '#831843',
    textSecondary: '#f472b6',
    border: '#fbcfe8',
    hover: '#fce7f3'
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('dashboardTheme');
    return savedTheme || 'normal';
  });

  useEffect(() => {
    localStorage.setItem('dashboardTheme', currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
  };

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    changeTheme,
    availableThemes: Object.keys(themes)
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
