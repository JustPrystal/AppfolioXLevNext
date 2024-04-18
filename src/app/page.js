"use client";

import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
import '/public/scss/App.scss';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from './components/snackbar';
import { FormProvider } from './components/store/provider';

const theme = createTheme({
  palette: {
    background: {
      primary: '#fbfaf8',
    },
    text: {
      primary: '#173A5E',
      secondary: '#46505A',
    },
    primary: {
      main: "#003330",
      contrastText: '#ffffff',
      hover: "#005953",
    },
    secondary: {
      main: "#404040",
      contrastText: '#ffffff',
      hover: "#005953",
    },
    action: {
      active: '#001E3C',
    }, 
  },
  typography: {
    fontFamily: "IBM Plex Sans, Alv",
  },
});


export default function Home() {

  return (
    <React.StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider preventDuplicate>
        <FormProvider>
          <App/>
        </FormProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>
  );
}
