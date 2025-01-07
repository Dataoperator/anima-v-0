import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :root {
    --quantum-primary: #3b82f6;
    --quantum-secondary: #8b5cf6;
    --quantum-accent: #10b981;
    --quantum-glow: #22c55e;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;