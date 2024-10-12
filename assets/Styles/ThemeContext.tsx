import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './Theme';  // Importe seus temas light e dark

interface ThemeContextProps {
  theme: typeof lightTheme | typeof darkTheme;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

function AuthThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme === 'dark' ? darkTheme : lightTheme);

  useEffect(() => {
    setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default AuthThemeProvider;

/*import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './Theme';  // Importe seus temas light e dark

interface ThemeContextProps {
  theme: typeof lightTheme | typeof darkTheme;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

function AuthThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme === 'dark' ? darkTheme : lightTheme);

  useEffect(() => {
    setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default AuthThemeProvider;
----------------------------------------
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './Theme';

export const ThemeProvider = createContext({});

function AuthThemeProvider({children}:any){

  return(
      <ThemeProvider.Provider value={{
      }}>
          {children}
      </ThemeProvider.Provider>
  )
}

export default AuthThemeProvider;*/