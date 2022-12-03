import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FormKitProvider } from './form-kit/FormKit';
import { MaterialFormKit } from './ui-kit/material-form-kit/MaterialFormKit';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormKitProvider kit={MaterialFormKit}>
        <App />
      </FormKitProvider>
    </LocalizationProvider>
  </React.StrictMode>
);
