import { createContext, ReactNode, useContext } from 'react';
import { DeepPartialTheme, theme, Theme } from './theme';

type ValuesType = {
  theme: Theme
}

const defaultProvider: ValuesType = {
  theme,
};

const ThemeContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
  theme?: DeepPartialTheme;
}

const ThemeProvider = ({ children, theme: themeOverride = {} }: Props) => {
  return (
    <ThemeContext.Provider value={{ theme: mergeTheme(theme, themeOverride) as Theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useThemeContext = () => useContext(ThemeContext);

export { ThemeContext, ThemeProvider, useThemeContext };

function mergeTheme(theme: Record<string, any>, themeOverride: Record<string, any>) {
  for (const key in themeOverride) {
    if (typeof themeOverride[key] === 'object') {
      theme[key] = mergeTheme(theme[key], themeOverride[key]);
    } else {
      theme[key] = themeOverride[key];
    }
  }

  return theme;
}
