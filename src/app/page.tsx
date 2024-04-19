"use client"

import React from 'react';
import '/public/scss/App.scss';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from './components/snackbar';
import { FormProvider } from './components/store/provider';

const theme = createTheme({
  palette: {
    background: {
      default: '#fbfaf8',
    },
    text: {
      primary: '#173A5E',
      secondary: '#46505A',
    },
    primary: {
      main: "#003330",
      contrastText: '#ffffff',

    },
    secondary: {
      main: "#404040",
      contrastText: '#ffffff',
    },
    action: {
      active: '#001E3C',
    }, 
  },
  typography: {
    fontFamily: "IBM Plex Sans, Alv",
  },
});

export default function Home(): JSX.Element {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <FormProvider>
            <App/>
          </FormProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}
