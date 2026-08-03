// src/pages/EmployeeRegistrationPage.js

import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import Layout from '../components/common/Layout';
import api from '../services/api';

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
  background: rgba(158, 0, 0, 0.1);
  color: #9E0000;
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
  background: #9E0000;
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
.activation-card-container {
  margin-top: 1.5rem;
}
.activation-card {
  border: 2px solid #9E0000;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  overflow: hidden;
}
.activation-card-header {
  background: #9E0000;
  color: white;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.activation-card-header .close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
}
.activation-card-body {
  padding: 2rem;
}
.activation-employee-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}
.activation-employee-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #9E0000;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  flex-shrink: 0;
}
.activation-employee-details {
  flex: 1;
}
.activation-employee-details .name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
}
.activation-employee-details .position {
  color: #9E0000;
  font-weight: 600;
}
.activation-employee-details .id {
  color: #6c757d;
  font-size: 0.9rem;
}
.activation-employee-details .contact {
  color: #6c757d;
  font-size: 0.9rem;
}
.activation-code-box {
  background: #f8f9fa;
  border: 1px solid #e9edf4;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  text-align: center;
}
.activation-code-box .code {
  font-family: monospace;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 6px;
  color: #9E0000;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: inline-block;
  border: 1px solid #f0d6d6;
}
.activation-timer {
  font-size: 1.2rem;
  font-weight: 600;
  color: #9E0000;
}
.activation-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}
.activation-actions .btn-regenerate {
  background: #9E0000;
  border: none;
  padding: 0.5rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  color: white;
}
.activation-actions .btn-regenerate:hover {
  background: #7a0000;
}
.activation-actions .btn-close-card {
  background: transparent;
  border: 1px solid #9E0000;
  color: #9E0000;
  padding: 0.5rem 2rem;
  border-radius: 8px;
  font-weight: 600;
}
.activation-actions .btn-close-card:hover {
  background: #9E0000;
  color: white;
}
.activation-authorized {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.85rem;
  color: #9E0000;
  font-weight: 600;
  letter-spacing: 2px;
  border-top: 1px solid #e9edf4;
  padding-top: 1rem;
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
  .activation-employee-info {
    flex-direction: column;
    text-align: center;
  }
  .activation-actions {
    flex-direction: column;
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
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmployee, setRegisteredEmployee] = useState(null);

  // Timer state for activation card (3 minutes)
  const [timeLeft, setTimeLeft] = useState(180);
  const [timerExpired, setTimerExpired] = useState(false);

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState('');

  useEffect(() => {
    let interval = null;
    if (registrationSuccess && activationCode) {
      setTimeLeft(180);
      setTimerExpired(false);
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimerExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [registrationSuccess, activationCode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return 'weak';
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    if (score <= 1) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
  };

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
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
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

    // Password strength check
    if (passwordStrength === 'weak') {
      setResult({ success: false, message: 'Password is too weak. Please use a stronger password (at least 8 characters, include uppercase, number, special character).' });
      return;
    }

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

    try {
      const response = await api.post('/auth/register-employee', formData);

      if (response.data.success) {
        setResult({ success: true, message: response.data.message });
        if (response.data.activationCode) {
          setActivationCode(response.data.activationCode);
          setDeviceId(response.data.deviceId);
          // Build employee object
          const emp = {
            firstName: formData.firstName || 'Employee',
            lastName: formData.lastName || '',
            position: formData.position || 'Staff',
            username: formData.username,
            email: formData.email,
            phone: formData.phone || 'N/A',
            id: response.data.userId || 'N/A'
          };
          setRegisteredEmployee(emp);
          setRegistrationSuccess(true);
        } else {
          // No device – just show success and reset form
          setFormData({
            username: '', email: '', password: '', firstName: '', lastName: '',
            phone: '', gender: '', position: '', deviceCode: '', deviceName: ''
          });
          setDeviceValid(null);
          setPasswordStrength('');
        }
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
        setTimerExpired(false);
        setTimeLeft(180);
        setResult({ success: true, message: 'Activation code regenerated successfully!' });
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
    setRegistrationSuccess(false);
    setActivationCode('');
    setDeviceId(null);
    setRegisteredEmployee(null);
    setTimerExpired(false);
    setTimeLeft(180);
    setResult(null);
    // Optionally reset form fields
    setFormData({
      username: '', email: '', password: '', firstName: '', lastName: '',
      phone: '', gender: '', position: '', deviceCode: '', deviceName: ''
    });
    setDeviceValid(null);
    setPasswordStrength('');
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

        {/* Activation Card – shown when registration with device is successful */}
        {registrationSuccess && registeredEmployee && (
          <div className="activation-card-container">
            <Card className="activation-card">
              <Card.Header className="activation-card-header">
                <span>🎉 Device Registered Successfully</span>
                <button className="close-btn" onClick={closeActivationCard} aria-label="Close">✕</button>
              </Card.Header>
              <Card.Body className="activation-card-body">
                <div className="activation-employee-info">
                  <div className="activation-employee-avatar">
                    {registeredEmployee.firstName.charAt(0)}
                  </div>
                  <div className="activation-employee-details">
                    <div className="name">{registeredEmployee.firstName} {registeredEmployee.lastName}</div>
                    <div className="position">{registeredEmployee.position}</div>
                    <div className="id">ID No: {registeredEmployee.id}</div>
                    <div className="contact">Phone: {registeredEmployee.phone}</div>
                    <div className="contact">Email: {registeredEmployee.email}</div>
                  </div>
                </div>

                <div className="activation-code-box">
                  <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '8px' }}>Activation Code</div>
                  <div className="code">{activationCode}</div>
                  <div style={{ marginTop: '12px' }}>
                    {timerExpired ? (
                      <span style={{ color: '#dc3545', fontWeight: 'bold' }}>Code expired. Please regenerate.</span>
                    ) : (
                      <span className="activation-timer">⏱ {formatTime(timeLeft)} remaining</span>
                    )}
                  </div>
                </div>

                <div className="activation-actions">
                  <Button
                    className="btn-regenerate"
                    onClick={handleRegenerateCode}
                    disabled={regenerating}
                  >
                    {regenerating ? <Spinner as="span" animation="border" size="sm" /> : 'Regenerate Code'}
                  </Button>
                  <Button className="btn-close-card" onClick={closeActivationCard}>
                    Close Card
                  </Button>
                </div>

                
              </Card.Body>
            </Card>
          </div>
        )}

        {/* Registration Form – hidden when activation card is shown */}
        {!registrationSuccess && (
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
                        <Form.Control
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <Form.Text className="text-muted">
                          {passwordStrength && (
                            <span style={{ fontWeight: 'bold', color: passwordStrength === 'weak' ? '#dc3545' : passwordStrength === 'medium' ? '#ffc107' : '#28a745' }}>
                              Strength: {passwordStrength.toUpperCase()}
                            </span>
                          )}
                        </Form.Text>
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
                      (formData.position !== 'Normal Employee' && formData.deviceCode && deviceValid === false) ||
                      passwordStrength === 'weak'
                    }
                  >
                    {loading ? 'Registering...' : 'Register Employee'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}
      </Container>
    </Layout>
  );
};

export default EmployeeRegistrationPage;