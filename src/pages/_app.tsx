import React, { useState } from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "../theme/theme";

export default function App({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

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
