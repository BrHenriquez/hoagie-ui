// theme.js
import { configureFonts, DefaultTheme, ThemeBase } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';

export const hoagieColors = {
  primary: '#F5D547',    // Warm Baguette (Primary buttons, app bar)
  accent: '#E94F37',     // Tomato Red (CTAs, errors)
  success: '#5CAB7D',    // Fresh Lettuce (Success states)
  text: '#8B5A2B',       // Meaty Brown (Text)
  background: '#F8F7F2', // Cool Mayo (App background)
  surface: '#FFFFFF',    // White (Cards, inputs)
  disabled: '#D3D3D3',   // Light Gray (Disabled elements)
  header: '#e3cb85',     // Dark Mustard (Headers)
  button: '#D4A418',     // Dark Mustard (Headers)
};

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'Roboto_400Regular', // Replace with your fonts
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Roboto_500Medium',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Roboto_700Bold',
      fontWeight: 'bold',
    },
  },
};

export const theme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: hoagieColors.primary,
    accent: hoagieColors.accent,
    background: '#fefefe',
    surface: hoagieColors.surface,
    text: hoagieColors.text,
    disabled: hoagieColors.disabled,
    placeholder: hoagieColors.text, // Input placeholder text
  },
  backgroundColor: 'red',
  fonts: configureFonts({ config: fontConfig }) as any,
  hoagieColors, 
};

export type AppTheme = typeof theme; 