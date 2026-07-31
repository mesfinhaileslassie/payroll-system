// src/pages/HomePage.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { FaUsers, FaLaptop, FaCheckCircle, FaUserPlus, FaCog, FaSync, FaChartLine } from 'react-icons/fa';
import api from '../services/api';

const HomePage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEmployees: 0,
    totalDevices: 0,
    activeDevices: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch users
      const usersRes = await api.get('/users/all');
      const users = usersRes.data.data || [];
      const employees = users.filter(u => u.role === 'Employee');

      // Fetch devices
      const devicesRes = await api.get('/device/all');
      const devices = devicesRes.data.data || [];
      const activeDevices = devices.filter(d => d.status === 'ACTIVE');

      setStats({
        totalUsers: users.length,
        totalEmployees: employees.length,
        totalDevices: devices.length,
        activeDevices: activeDevices.length,
      });

      // Set recent users (latest 5)
      setRecentUsers(users.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <Container fluid className="py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="display-5 fw-bold" style={{ color: '#0b2b4a' }}>
              Admin Dashboard
            </h1>
            <p className="text-muted">
              Overview of your payroll system.
            </p>
          </div>
          <Button variant="outline-primary" onClick={fetchData} disabled={loading}>
            <FaSync className={loading ? 'spin' : ''} /> Refresh
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Stats Cards */}
        <Row className="mb-4 g-3">
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 me-3" style={{ background: 'rgba(13, 110, 253, 0.1)' }}>
                  <FaUsers size={24} color="#0d6efd" />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Total Users</h6>
                  <h3 className="fw-bold mb-0">{stats.totalUsers}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 me-3" style={{ background: 'rgba(40, 167, 69, 0.1)' }}>
                  <FaUserPlus size={24} color="#28a745" />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Employees</h6>
                  <h3 className="fw-bold mb-0">{stats.totalEmployees}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 me-3" style={{ background: 'rgba(255, 193, 7, 0.1)' }}>
                  <FaLaptop size={24} color="#ffc107" />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Total Devices</h6>
                  <h3 className="fw-bold mb-0">{stats.totalDevices}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 me-3" style={{ background: 'rgba(23, 162, 184, 0.1)' }}>
                  <FaCheckCircle size={24} color="#17a2b8" />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Active Devices</h6>
                  <h3 className="fw-bold mb-0">{stats.activeDevices}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row className="mb-4 g-3">
          <Col md={6}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold mb-1">Manage Employees</h5>
                  <p className="text-muted mb-0">View, edit, or delete employee accounts.</p>
                </div>
                <Button as={Link} to="/admin/employee-management" variant="primary" className="rounded-pill px-4">
                  <FaUserPlus className="me-2" /> Go
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold mb-1">Manage Devices</h5>
                  <p className="text-muted mb-0">View, edit, or remove registered devices.</p>
                </div>
                <Button as={Link} to="/admin/device-management" variant="primary" className="rounded-pill px-4">
                  <FaCog className="me-2" /> Go
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Users Table */}
        <Card className="border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <Card.Header className="bg-white border-0 py-3">
            <div className="d-flex align-items-center">
              <FaUsers className="me-2 text-primary" />
              <span className="fw-bold">Recent Users</span>
              <span className="badge bg-secondary ms-2 rounded-pill">{recentUsers.length}</span>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {loading && recentUsers.length === 0 ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="text-center py-4 text-muted">No users found.</div>
            ) : (
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td><strong>{user.username}</strong></td>
                        <td>{user.firstName} {user.lastName}</td>
                        <td><span className="badge bg-secondary">{user.role}</span></td>
                        <td>
                          <span className={`badge bg-${user.isActive ? 'success' : 'danger'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
};

export default HomePage;