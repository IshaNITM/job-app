import React from 'react';
import ReactDOM from 'react-dom/client';  // Updated import for React 18
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';
import store from './redux/store';
import { Provider } from 'react-redux';
import './styles.css';

const theme = createTheme();

// Create a root element and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);