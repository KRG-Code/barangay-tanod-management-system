import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';  // Import the AuthProvider
import ProtectedRoute from './components/ProtectedRoute';  // Import the ProtectedRoute component

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
    <AuthProvider>  {/* Wrap the app with AuthProvider to share authentication state */}
      <div className="flex-1 p-6 bg-background text-text">         
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              {/* Protect these routes using ProtectedRoute */}
              <Route 
                path="/Dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/Patrolmap" 
                element={
                  <ProtectedRoute>
                    <Patrolmap />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/Equipments" 
                element={
                  <ProtectedRoute>
                    <Equipments />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/Performance" 
                element={
                  <ProtectedRoute>
                    <Performance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/Schedule" 
                element={
                  <ProtectedRoute>
                    <Schedule />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/Incidents" 
                element={
                  <ProtectedRoute>
                    <Incidents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/MyAccount" 
                element={
                  <ProtectedRoute>
                    <MyAccount />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;
