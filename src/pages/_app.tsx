import React, { useState, useEffect } from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "../theme/theme";
import "../lib/i18n";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

export default function App({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const { i18n } = useTranslation();

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    Cookies.set('theme', newDarkMode ? 'dark' : 'light', { expires: 365 });
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    Cookies.set('language', newLanguage, { expires: 365 });
  };

  useEffect(() => {
    const savedTheme = Cookies.get('theme');
    const savedLanguage = Cookies.get('language');
    
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Component 
        {...pageProps} 
        darkMode={darkMode} 
        onThemeToggle={toggleTheme}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
    </ThemeProvider>
  );
}
