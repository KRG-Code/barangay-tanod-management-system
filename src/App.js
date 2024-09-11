import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
const SignupPage = lazy(() => import('./pages/Signup'));
const LoginPage = lazy(() => import('./pages/Login'));
const Homepage = lazy(() => import('./pages/Homepage'));

function App() {
  return (
    <div className="flex-1 p-6 bg-background text-text">
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/Homepage" element={<Homepage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
