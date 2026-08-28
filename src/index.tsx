import * as React from 'react';
import ReactDOM from 'react-dom';
import { StyledEngineProvider, CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import App from './App';
import filesTheme from './theme';

ReactDOM.render(
  <React.StrictMode>
    <CssVarsProvider defaultMode='light' modeStorageKey='padgad-green-theme' disableTransitionOnChange theme={filesTheme}>
      <CssBaseline />
      <StyledEngineProvider injectFirst>
        <App />
      </StyledEngineProvider>
    </CssVarsProvider>
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement,
);
