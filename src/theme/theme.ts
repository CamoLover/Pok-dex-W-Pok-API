import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      footerBackground: string;
      accent: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      footerBackground?: string;
      accent?: string;
    };
  }
}


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
    text: {
      primary: '#191919ff',
      secondary: '#333333',
    },
    custom: {
      footerBackground: '#ff3131',
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
      default: '#252a2eff',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#edededff',
      secondary: '#cccccc',
    },
    custom: {
      footerBackground: '#5b1111ff',
    },
  },
});