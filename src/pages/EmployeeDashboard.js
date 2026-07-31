// src/pages/EmployeeDashboard.js

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FaUser, FaMoneyBillWave } from 'react-icons/fa';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileRes = await api.get(`/users/${user.userId}`);
      setProfile(profileRes.data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Employee Dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Body className="text-center">
              <FaUser size={40} className="text-primary mb-2" />
              <h5>{profile?.firstName} {profile?.lastName}</h5>
              <p className="text-muted">{profile?.username}</p>
              <Button variant="outline-primary" size="sm" onClick={() => window.location.href='/employee/profile'}>
                View Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Body>
              <h5>Quick Stats</h5>
              <Row>
                <Col xs={6}><strong>Department:</strong> {profile?.department || 'N/A'}</Col>
                <Col xs={6}><strong>Position:</strong> {profile?.position || 'N/A'}</Col>
                <Col xs={6}><strong>Email:</strong> {profile?.email}</Col>
                <Col xs={6}><strong>Phone:</strong> {profile?.phone || 'N/A'}</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header>
          <FaMoneyBillWave className="me-2" />
          Salary Information
        </Card.Header>
        <Card.Body>
          <p className="text-muted">
            Your salary details will be available here once processed by Finance.
          </p>
        </Card.Body>
      </Card>

      <Button variant="outline-danger" onClick={logout} className="mt-3">
        Logout
      </Button>
    </Container>
  );
};

export default EmployeeDashboard;