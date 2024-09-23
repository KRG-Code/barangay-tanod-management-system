import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout'; // New Layout component for persistent Navbar and Sidebar
import { CombinedProvider } from './contexts/useContext';

const SignupPage = lazy(() => import('./pages/Signup'));
const LoginPage = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patrolmap = lazy(() => import('./pages/Patrolmap'));
const Equipments = lazy(() => import('./pages/Equipments'));
const Performance = lazy(() => import('./pages/Performance'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Incidents = lazy(() => import('./pages/Incidents'));
const MyAccount = lazy(() => import('./pages/MyAccount'));

function App() {
  return (
    <div className="flex-1 p-6 bg-background text-text">
      <BrowserRouter>
      <CombinedProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Layout Route for Private Pages with Sidebar and Navbar */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patrolmap" element={<Patrolmap />} />
              <Route path="/equipments" element={<Equipments />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/myaccount" element={<MyAccount />} />
            </Route>
          </Routes>
        </Suspense>
        </CombinedProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
