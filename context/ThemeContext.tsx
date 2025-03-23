import React, { createContext, useState } from "react";
import { DefaultTheme, MD3DarkTheme } from "react-native-paper";

const customLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#FF7F00", // Orange
    background: "#ffffff",
    text: "#000000",
  },
};

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#FF7F00", // Orange
    background: "#000000",
    text: "#ffffff",
  },
};

export const ThemeContext = createContext({
  isDarkMode: false,
  theme: customLightTheme,
  toggleDarkMode: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const theme = isDarkMode ? customDarkTheme : customLightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
