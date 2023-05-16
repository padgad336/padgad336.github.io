import * as React from 'react';
import ReactDOM from 'react-dom';
import { StyledEngineProvider,CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import App from './App';
import filesTheme from './theme';

ReactDOM.render(
  <React.StrictMode>
     <CssVarsProvider disableTransitionOnChange theme={filesTheme}>
      <CssBaseline />
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
    </CssVarsProvider>
  </React.StrictMode>,
 document.getElementById('root') as HTMLElement
 );
 