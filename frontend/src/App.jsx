/**
 * @file App.jsx
 * @description The root component of the application.
 */

import AppRoutes from './routes';
import { TrainProvider } from './context/TrainContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TrainProvider>
          <div className="app-wrapper w-full min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
            <AppRoutes />
          </div>
        </TrainProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
