import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { GlobalStyle } from '../styles/GlobalStyle';
import { quantumTheme } from '../styles/quantum-components';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StyledThemeProvider theme={quantumTheme}>
      <GlobalStyle />
      {children}
    </StyledThemeProvider>
  );
};