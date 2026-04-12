/**
 * @file index.jsx (Routes)
 * @description Defines the routing tree for the entire application.
 * 
 * WHY THIS FILE EXISTS:
 * Keeping all routes in one place makes the application easier to maintain and visualize.
 * 
 * WHAT PROBLEM IT SOLVES:
 * - Implements nested routing (Layouts wrapping Pages).
 * - Maps URL paths to specific page components.
 * 
 * LOGIC DECISIONS:
 * // We use an absolute '*' catch-all route to handle 404s gracefully.
 * // The layout is applied as a parent route, so the Sidebar/Navbar persists across page changes.
 * 
 * WHAT WILL BREAK IF REMOVED:
 * Users will not be able to navigate to any pages, resulting in a blank screen or errors.
 */

import { Routes, Route, Outlet } from 'react-router-dom';

// Importing actual page components instead of placeholders.
import Home from '../pages/Home';
import LiveTracking from '../pages/LiveTracking';
import PNRStatus from '../pages/PNRStatus';
import ProximityAlerts from '../pages/ProximityAlerts';
import SOS from '../pages/SOS';
import SeatExchange from '../pages/SeatExchange';
import ConnectingJourneys from '../pages/ConnectingJourneys';
import AuthSuccess from '../pages/Home/AuthSuccess';

// Import the newly created MainLayout
import MainLayout from '../components/layout/MainLayout';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 
        This is a nested route structure. 
        The MainLayout wraps all child routes, so the Sidebar/Layout persists.
      */}
      <Route path="/" element={<MainLayout />}>
        {/* Child routes injected into Layout's <Outlet /> */}
        <Route index element={<Home />} />
        <Route path="live-tracking" element={<LiveTracking />} />
        <Route path="pnr-status" element={<PNRStatus />} />
        <Route path="proximity-alerts" element={<ProximityAlerts />} />
        <Route path="sos" element={<SOS />} />
        <Route path="seat-exchange" element={<SeatExchange />} />
        <Route path="connecting-journeys" element={<ConnectingJourneys />} />
        <Route path="auth/success" element={<AuthSuccess />} />
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<div className="p-10 flex items-center justify-center min-h-screen text-center text-red-400 text-2xl font-bold bg-slate-950">404 - Page Not Found</div>} />
    </Routes>
  );
}
