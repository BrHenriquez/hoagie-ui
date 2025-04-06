import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
    error: '#b00020',
    background: '#f6f6f6',
    surface: '#ffffff',
    text: '#000000',
  },
  roundness: 8,
  animation: {
    scale: 1.0,
  },
};

export type AppTheme = typeof theme; 