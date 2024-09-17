import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Patrolmap" element={<Patrolmap />} />
            <Route path="/Equipments" element={<Equipments />} />
            <Route path="/Performance" element={<Performance />} />
            <Route path="/Schedule" element={<Schedule />} />
            <Route path="/Incidents" element={<Incidents />} />
            <Route path="/MyAccount" element={<MyAccount />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
