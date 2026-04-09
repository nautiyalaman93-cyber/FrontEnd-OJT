/**
 * @file main.jsx
 * @description Entry point for the React application.
 * 
 * WHY THIS FILE EXISTS:
 * This is the bootstrap file where React mounts our application into the HTML DOM.
 * 
 * WHAT PROBLEM IT SOLVES:
 * - Initializes the root React render tree.
 * - Wraps the entire app with necessary top-level providers like BrowserRouter.
 * 
 * WHAT WILL BREAK IF REMOVED:
 * The entire application will crash as React won't know where or how to render itself onto the webpage.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 
      // Using BrowserRouter here at the highest level so all nested
      // application components can navigate and read routes.
    */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
