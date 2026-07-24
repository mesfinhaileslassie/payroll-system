// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DeviceRegistrationPage from './pages/DeviceRegistrationPage';
import BudgetApprovalPage from './pages/BudgetApprovalPage';
import OTPScreen from './pages/OTPScreen';
import DeviceManagementPage from './pages/DeviceManagementPage'; // NEW import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/device-registration" element={<DeviceRegistrationPage />} />
        <Route path="/device-management" element={<DeviceManagementPage />} /> {/* NEW */}
        <Route path="/budget-approval" element={<BudgetApprovalPage />} />
        <Route path="/otp-verification" element={<OTPScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;