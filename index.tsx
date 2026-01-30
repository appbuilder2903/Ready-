import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { getConfigStatus } from './env.config';

// Production-ready initialization with error handling
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Check environment configuration status
const configStatus = getConfigStatus();
if (!configStatus.configured) {
  console.warn(
    '⚠️ Application starting with incomplete configuration.',
    'Missing variables:', configStatus.missing.join(', ')
  );
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);