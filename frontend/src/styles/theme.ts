import { extendTheme } from '@chakra-ui/react';

// Custom colors
const colors = {
  brand: {
    50: '#e6f7ff',
    100: '#b3e0ff',
    200: '#80caff',
    300: '#4db3ff',
    400: '#1a9dff',
    500: '#0080ff', // Primary brand color
    600: '#0066cc',
    700: '#004d99',
    800: '#003366',
    900: '#001a33',
  },
};

// Create and export the theme
const theme = extendTheme({
  colors,
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default theme;
