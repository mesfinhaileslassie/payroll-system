// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';  // <-- Navigate imported
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';                    // Admin Dashboard
import EmployeeDashboard from './pages/EmployeeDashboard';
import DeviceRegistrationPage from './pages/DeviceRegistrationPage';
import DeviceManagementPage from './pages/DeviceManagementPage';
import BudgetApprovalPage from './pages/BudgetApprovalPage';
import EmployeeRegistrationPage from './pages/EmployeeRegistrationPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import OTPScreen from './pages/OTPScreen';                 // keep if needed

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/admin/device-registration" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <DeviceRegistrationPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/device-management" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <DeviceManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/budget-approval" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <BudgetApprovalPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/employee-registration" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <EmployeeRegistrationPage />
            </ProtectedRoute>
          } />

          {/* Employee Routes */}
          <Route path="/employee/dashboard" element={
            <ProtectedRoute allowedRoles={['Employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;