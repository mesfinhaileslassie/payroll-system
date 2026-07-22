// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DeviceRegistrationPage from './pages/DeviceRegistrationPage';
import BudgetApprovalPage from './pages/BudgetApprovalPage';
import OTPScreen from './pages/OTPScreen';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/device-registration" element={<DeviceRegistrationPage />} />
          <Route path="/budget-approval" element={<BudgetApprovalPage />} />
          <Route path="/otp-verification" element={<OTPScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;