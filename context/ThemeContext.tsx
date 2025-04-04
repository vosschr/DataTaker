import React, { createContext, useState, useEffect } from "react";
import { DefaultTheme, MD3DarkTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const customLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#00008b", // Darkblue
    background: "#ffffff",
    text: "#000000",
  },
};

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#b88f16", // Orange
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

  // Lade die gespeicherte Dark Mode Einstellung beim Start
  useEffect(() => {
    const loadDarkModeSetting = async () => {
      try {
        const storedValue = await AsyncStorage.getItem("isDarkMode");
        if (storedValue !== null) {
          setIsDarkMode(storedValue === "true");
        }
      } catch (error) {
        console.error("Failed to load dark mode setting", error);
      }
    };

    loadDarkModeSetting();
  }, []);

  const toggleDarkMode = async () => {
    try {
      const newValue = !isDarkMode;
      setIsDarkMode(newValue);
      await AsyncStorage.setItem("isDarkMode", newValue ? "true" : "false");
    } catch (error) {
      console.error("Failed to save dark mode setting", error);
    }
  };

  const theme = isDarkMode ? customDarkTheme : customLightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
