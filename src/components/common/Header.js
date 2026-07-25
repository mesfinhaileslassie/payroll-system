// src/components/common/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaShieldAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="navbar-custom" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <FaShieldAlt className="me-2" />
          Payroll System
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user?.role === 'Admin' && (
              <>
                <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/admin/device-registration">Register Device</Nav.Link>
                <Nav.Link as={Link} to="/admin/device-management">Device Management</Nav.Link>
                <Nav.Link as={Link} to="/admin/budget-approval">Budget Approval</Nav.Link>
                <Nav.Link as={Link} to="/admin/employee-registration">Register Employee</Nav.Link>
              </>
            )}
            {user?.role === 'PayrollOfficer' && (
              <>
                <Nav.Link as={Link} to="/payroll-officer/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/admin/budget-approval">Submit Budget</Nav.Link>
              </>
            )}
            {user?.role === 'FinanceManager' && (
              <>
                <Nav.Link as={Link} to="/finance-manager/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/admin/budget-approval">Review Budgets</Nav.Link>
              </>
            )}
            {user?.role === 'Employee' && (
              <>
                <Nav.Link as={Link} to="/employee/dashboard">Dashboard</Nav.Link>
              </>
            )}
            {!user && (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
          {user && (
            <div className="d-flex align-items-center ms-3">
              <span className="text-light me-2">{user.username}</span>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                <FaSignOutAlt className="me-1" /> Logout
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;