// src/pages/EmployeeRegistrationPage.js
import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import Layout from '../components/common/Layout';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5062/api';

const EmployeeRegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    department: '',
    position: '',
    employeeId: '',
    deviceCode: '',
    deviceName: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activationCode, setActivationCode] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post(`${API_URL}/auth/register-employee`, formData);
      if (response.data.success) {
        setResult({ success: true, message: response.data.message });
        if (response.data.activationCode) {
          setActivationCode(response.data.activationCode);
        }
        setFormData({
          username: '', email: '', password: '', firstName: '', lastName: '',
          phone: '', gender: '', department: '', position: '', employeeId: '',
          deviceCode: '', deviceName: ''
        });
      } else {
        setResult({ success: false, message: response.data.message || 'Registration failed' });
      }
    } catch (err) {
      console.error('Registration error:', err);
      setResult({ success: false, message: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container>
        <h2 className="mb-4">Register New Employee</h2>
        {result && <Alert variant={result.success ? 'success' : 'danger'}>{result.message}</Alert>}
        {activationCode && (
          <Alert variant="success">
            <strong>Activation Code:</strong> {activationCode} – Give this code to the employee to activate their device.
          </Alert>
        )}
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username *</Form.Label>
                    <Form.Control name="username" value={formData.username} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control name="email" type="email" value={formData.email} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Password *</Form.Label>
                    <Form.Control name="password" type="password" value={formData.password} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control name="firstName" value={formData.firstName} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control name="lastName" value={formData.lastName} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control name="phone" value={formData.phone} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Department</Form.Label>
                    <Form.Control name="department" value={formData.department} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Position</Form.Label>
                    <Form.Control name="position" value={formData.position} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Employee ID</Form.Label>
                    <Form.Control name="employeeId" value={formData.employeeId} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
              <hr />
              <h5>Device Registration</h5>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Device Code (from employee's Soft Token app)</Form.Label>
                    <Form.Control as="textarea" rows={3} name="deviceCode" value={formData.deviceCode} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Device Name</Form.Label>
                    <Form.Control name="deviceName" value={formData.deviceName} onChange={handleChange} placeholder="Optional" />
                  </Form.Group>
                </Col>
              </Row>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Registering...' : 'Register Employee'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
};

export default EmployeeRegistrationPage;