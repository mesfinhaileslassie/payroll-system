// src/pages/EmployeeRegistrationPage.js

import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import Layout from '../components/common/Layout';
import api from '../services/api';

const API_URL = 'http://127.0.0.1:5062/api';

const erpStyles = `
.erp-page {
  padding-top: 2rem;
  padding-bottom: 3rem;
}
.erp-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}
.erp-header-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  font-size: 1.25rem;
  flex-shrink: 0;
}
.erp-header h2 {
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #212529;
}
.erp-header p {
  margin: 0;
  color: #6c757d;
  font-size: 0.925rem;
}
.erp-alert {
  border: none;
  border-left: 4px solid transparent;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.erp-alert.alert-success {
  border-left-color: #198754;
}
.erp-alert.alert-danger {
  border-left-color: #dc3545;
}
.erp-activation-card {
  margin-top: 1.5rem;
  border: 2px solid #198754;
  border-radius: 12px;
  background: #f0fdf4;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.erp-activation-card .card-header {
  background: #198754;
  color: white;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.erp-activation-card .card-header .close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}
.erp-activation-code {
  font-family: monospace;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 4px;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #86efac;
  display: inline-block;
  margin: 0.5rem 0;
}
.erp-regenerate-btn {
  background: #198754;
  color: white;
  border: none;
  padding: 0.4rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
}
.erp-regenerate-btn:hover {
  background: #157347;
}
.erp-regenerate-btn:disabled {
  opacity: 0.6;
}
.erp-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
.erp-card .card-body {
  padding: 2rem;
}
.erp-section {
  margin-bottom: 1.75rem;
}
.erp-section:last-of-type {
  margin-bottom: 0.5rem;
}
.erp-section-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6c757d;
  margin-bottom: 1rem;
}
.erp-section-title .erp-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #0d6efd;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: none;
}
.erp-divider {
  border: none;
  border-top: 1px dashed rgba(0, 0, 0, 0.12);
  margin: 1.75rem 0;
}
.erp-form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 0.35rem;
}
.erp-form-control,
.erp-card .form-control,
.erp-card .form-select {
  border-radius: 8px;
  border: 1px solid #dee2e6;
  padding: 0.55rem 0.75rem;
  font-size: 0.925rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.erp-card .form-control:focus,
.erp-card .form-select:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
}
.erp-device-box {
  background: #f8f9fa;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 1.25rem 1.25rem 0.5rem;
}
.erp-device-status {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  margin-left: 0.5rem;
  vertical-align: middle;
}
.erp-device-status.text-success {
  background: rgba(25, 135, 84, 0.12);
  color: #146c43 !important;
}
.erp-device-status.text-danger {
  background: rgba(220, 53, 69, 0.12);
  color: #b02a37 !important;
}
.erp-check-btn {
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.825rem;
}
.erp-footer-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}
.erp-submit-btn {
  border-radius: 8px;
  font-weight: 600;
  padding: 0.55rem 1.75rem;
  box-shadow: 0 2px 8px rgba(13, 110, 253, 0.25);
}
.erp-submit-btn:disabled {
  box-shadow: none;
}
@media (max-width: 767.98px) {
  .erp-card .card-body {
    padding: 1.25rem;
  }
  .erp-footer-actions {
    justify-content: stretch;
  }
  .erp-submit-btn {
    width: 100%;
  }
}
`;

const EmployeeRegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    position: '',
    deviceCode: '',
    deviceName: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activationCode, setActivationCode] = useState('');
  const [deviceId, setDeviceId] = useState(null);
  const [deviceValid, setDeviceValid] = useState(null);
  const [checkingDevice, setCheckingDevice] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [showActivationCard, setShowActivationCard] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'position' && value === 'Normal Employee') {
      setFormData(prev => ({ ...prev, deviceCode: '', deviceName: '' }));
      setDeviceValid(null);
    }
    if (name === 'deviceCode') {
      setDeviceValid(null);
    }
  };

  const extractInstallationId = (code) => {
    try {
      const parsed = JSON.parse(code);
      return parsed.installation_id || null;
    } catch {
      return null;
    }
  };

  const checkDevice = async () => {
    const installationId = extractInstallationId(formData.deviceCode);
    if (!installationId) {
      setResult({ success: false, message: 'Invalid device code. Please paste a valid device code.' });
      return;
    }

    setCheckingDevice(true);
    setResult(null);
    try {
      const response = await api.get(`/device/check-registration?installationId=${installationId}`);
      if (response.data.registered) {
        setDeviceValid(false);
        setResult({ success: false, message: 'This device is already registered. Please use a different device.' });
      } else {
        setDeviceValid(true);
        setResult({ success: true, message: 'Device is available for registration.' });
      }
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || 'Failed to check device' });
    } finally {
      setCheckingDevice(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.position !== 'Normal Employee' && formData.deviceCode) {
      const installationId = extractInstallationId(formData.deviceCode);
      if (installationId) {
        try {
          const checkRes = await api.get(`/device/check-registration?installationId=${installationId}`);
          if (checkRes.data.registered) {
            setResult({ success: false, message: 'This device is already registered. Please use a different device.' });
            return;
          }
        } catch (err) {
          setResult({ success: false, message: 'Failed to validate device. Please try again.' });
          return;
        }
      } else {
        setResult({ success: false, message: 'Invalid device code format.' });
        return;
      }
    }

    setLoading(true);
    setResult(null);
    setActivationCode('');
    setDeviceId(null);
    setShowActivationCard(false);

    try {
      const response = await api.post('/auth/register-employee', formData);

      if (response.data.success) {
        // Show success message (but we will also show the card)
        setResult({ success: true, message: response.data.message });

        // If device was registered, store activation code and deviceId
        if (response.data.activationCode) {
          setActivationCode(response.data.activationCode);
          setDeviceId(response.data.deviceId);
          setShowActivationCard(true); // Show the card
        }

        // Clear form fields (except maybe keep them if needed)
        setFormData({
          username: '', email: '', password: '', firstName: '', lastName: '',
          phone: '', gender: '', position: '', deviceCode: '', deviceName: ''
        });
        setDeviceValid(null);
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

  const handleRegenerateCode = async () => {
    if (!deviceId) {
      setResult({ success: false, message: 'No device ID found to regenerate activation code.' });
      return;
    }

    setRegenerating(true);
    setResult(null);
    try {
      const response = await api.post(`/device/${deviceId}/regenerate-activation`);
      if (response.data.success) {
        setActivationCode(response.data.activationCode);
        setResult({ success: true, message: 'Activation code regenerated successfully!' });
        // Optionally, keep the card open
      } else {
        setResult({ success: false, message: response.data.message || 'Failed to regenerate activation code.' });
      }
    } catch (err) {
      console.error('Regenerate error:', err);
      setResult({ success: false, message: err.response?.data?.message || 'Error regenerating activation code.' });
    } finally {
      setRegenerating(false);
    }
  };

  const closeActivationCard = () => {
    setShowActivationCard(false);
    // Optionally, clear the activation code from state
  };

  const showDeviceSection = formData.position !== 'Normal Employee' && formData.position !== '';

  return (
    <Layout>
      <style>{erpStyles}</style>
      <Container className="erp-page">
        <div className="erp-header">
          <span className="erp-header-icon" aria-hidden="true">👤</span>
          <div>
            <h2>Register New Employee</h2>
            <p>Create an account, assign a role, and pair a Soft Token device.</p>
          </div>
        </div>

        {result && (
          <Alert className="erp-alert" variant={result.success ? 'success' : 'danger'}>
            {result.message}
          </Alert>
        )}

        {/* Activation Code Card */}
        {showActivationCard && (
          <Card className="erp-activation-card">
            <Card.Header>
              <span>🎉 Device Registered Successfully</span>
              <button className="close-btn" onClick={closeActivationCard} aria-label="Close">
                ✕
              </button>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <p><strong>Activation Code:</strong></p>
                  <div className="erp-activation-code">{activationCode}</div>
                  <p className="text-muted mt-2">
                    Give this 6‑digit code to the employee to activate their device.
                    The code expires in <strong>3 minutes</strong>.
                  </p>
                </Col>
                <Col md={4} className="d-flex flex-column justify-content-center align-items-end">
                  <Button
                    variant="success"
                    className="erp-regenerate-btn"
                    onClick={handleRegenerateCode}
                    disabled={regenerating}
                  >
                    {regenerating ? <Spinner as="span" animation="border" size="sm" /> : 'Regenerate Code'}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="mt-2"
                    onClick={closeActivationCard}
                  >
                    Close Card
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        <Card className="erp-card">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <div className="erp-section">
                <div className="erp-section-title">
                  <span className="erp-badge">1</span> Account Credentials
                </div>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="erp-form-label">Username *</Form.Label>
                      <Form.Control name="username" value={formData.username} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="erp-form-label">Email *</Form.Label>
                      <Form.Control name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="erp-form-label">Password *</Form.Label>
                      <Form.Control name="password" type="password" value={formData.password} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="erp-section">
                <div className="erp-section-title">
                  <span className="erp-badge">2</span> Personal Details
                </div>
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="erp-form-label">First Name</Form.Label>
                      <Form.Control name="firstName" value={formData.firstName} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="erp-form-label">Last Name</Form.Label>
                      <Form.Control name="lastName" value={formData.lastName} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="erp-form-label">Phone</Form.Label>
                      <Form.Control name="phone" value={formData.phone} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="erp-form-label">Gender</Form.Label>
                      <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="erp-section">
                <div className="erp-section-title">
                  <span className="erp-badge">3</span> Role / Position
                </div>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="erp-form-label">Position *</Form.Label>
                      <Form.Select name="position" value={formData.position} onChange={handleChange} required>
                        <option value="">Select position</option>
                        <option value="Normal Employee">Normal Employee</option>
                        <option value="Finance Manager">Finance Manager</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {showDeviceSection && (
                <>
                  <hr className="erp-divider" />
                  <div className="erp-section">
                    <div className="erp-section-title">
                      <span className="erp-badge">4</span> Device Registration
                    </div>
                    <div className="erp-device-box">
                      <Row>
                        <Col md={8}>
                          <Form.Group className="mb-3">
                            <Form.Label className="erp-form-label">Device Code (from employee's Soft Token app)</Form.Label>
                            <Form.Control as="textarea" rows={3} name="deviceCode" value={formData.deviceCode} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label className="erp-form-label">Device Name</Form.Label>
                            <Form.Control name="deviceName" value={formData.deviceName} onChange={handleChange} placeholder="Optional" />
                          </Form.Group>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={checkDevice}
                            disabled={!formData.deviceCode || checkingDevice}
                            className="mt-2 erp-check-btn"
                          >
                            {checkingDevice ? <Spinner as="span" animation="border" size="sm" /> : 'Check Device'}
                          </Button>
                          {deviceValid === true && <span className="text-success erp-device-status">✅ Available</span>}
                          {deviceValid === false && <span className="text-danger erp-device-status">❌ Already Registered</span>}
                        </Col>
                      </Row>
                    </div>
                  </div>
                </>
              )}

              <div className="erp-footer-actions">
                <Button
                  type="submit"
                  variant="primary"
                  className="erp-submit-btn"
                  disabled={
                    loading ||
                    (formData.position !== 'Normal Employee' && formData.deviceCode && deviceValid === false)
                  }
                >
                  {loading ? 'Registering...' : 'Register Employee'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
};

export default EmployeeRegistrationPage;