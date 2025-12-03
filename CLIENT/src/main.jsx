import React from "react";
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme.js';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <div dir="rtl">
          <App />
        </div>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)
