/**
 * @file App.jsx
 * @description The root component of the application.
 * 
 * WHY THIS FILE EXISTS:
 * This component acts as the main container for application routes and global state providers.
 * 
 * WHAT PROBLEM IT SOLVES:
 * - Orchestrates the routing configuration (using AppRoutes).
 * - Provides a place to inject global Context API providers.
 * 
 * LOGIC DECISIONS:
 * // We keep the routing structure separated from the layout to maintain a clean architecture.
 * // Future authentication logic is stubbed out but commented, ready for implementation.
 * 
 * WHAT WILL BREAK IF REMOVED:
 * The application structure and routing tree will be lost, rendering nothing on the screen.
 */

import AppRoutes from './routes';
import { TrainProvider } from './context/TrainContext';
import { ThemeProvider } from './context/ThemeContext';

/*
// ==========================================
// FUTURE FEATURE (LOGIN SYSTEM - COMMENTED)
// ==========================================
// This is disabled because the profile feature is not implemented. 
// Removing these comments will enable authentication flow.

import { AuthProvider } from './context/AuthContext';

function AppWithAuth() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
*/

function App() {
  return (
    <ThemeProvider>
      {/* If the Auth system was active, we would wrap this with <AuthProvider> */}
      <TrainProvider>
        <div className="app-wrapper w-full min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
          <AppRoutes />
        </div>
      </TrainProvider>
    </ThemeProvider>
  );
}

export default App;
