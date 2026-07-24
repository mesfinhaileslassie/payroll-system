// src/components/common/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaShieldAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
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
            <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/device-registration">Register Device</Nav.Link>
            {/* NEW: Device Management */}
            <Nav.Link as={Link} to="/device-management">Device Management</Nav.Link>
            <Nav.Link as={Link} to="/budget-approval">Budget Approval</Nav.Link>
            {/* Keep OTP Verify if needed; optionally remove */}
            <Nav.Link as={Link} to="/otp-verification">OTP Verify</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center ms-3">
            <Button variant="outline-light" size="sm" className="me-2">
              <FaUser className="me-1" /> Admin
            </Button>
            <Button variant="light" size="sm">
              <FaSignOutAlt />
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;