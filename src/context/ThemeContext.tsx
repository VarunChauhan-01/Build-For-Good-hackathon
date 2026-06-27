import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, getTranslation, LanguageType } from '../utils/translations';
import { authAPI, getStoredUser } from '../services/api';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    const saved = localStorage.getItem('highContrast');
    return saved ? JSON.parse(saved) : false;
  });

  const [language, setLanguageState] = useState<LanguageType>(() => {
    const savedUser = getStoredUser();
    if (savedUser?.language && translations[savedUser.language as LanguageType]) {
      return savedUser.language as LanguageType;
    }
    return (localStorage.getItem('language') as LanguageType) || 'en';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', JSON.stringify(highContrast));
  }, [highContrast]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleHighContrast = () => setHighContrast(!highContrast);
  
  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Sync with backend profile silently if user logged in
    const user = getStoredUser();
    if (user) {
      authAPI.updateProfile({ language: lang }).catch(() => {});
    }
  };

  const t = (key: string) => getTranslation(language, key);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        highContrast,
        toggleHighContrast,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
