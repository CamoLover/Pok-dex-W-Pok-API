import React, { useState, useEffect } from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "../theme/theme";
import "../lib/i18n";
import { useTranslation } from "react-i18next";

export default function App({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const { i18n } = useTranslation();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

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
