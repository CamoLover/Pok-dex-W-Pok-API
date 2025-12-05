import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff3131',
    },
    secondary: {
      main: '#c00043ff',
    },
    background: {
      default: '#ffffffff',
      paper: '#ffffff',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff3131',
    },
    secondary: {
      main: '#c00043ff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});