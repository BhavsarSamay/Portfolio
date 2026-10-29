import { createContext, useContext } from "react";

// Motion-folio is always dark mode.
// This shim keeps existing components that call useTheme() from crashing.
const ThemeContext = createContext({ isDark: true, theme: 'dark', toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={{ isDark: true, theme: 'dark', toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
