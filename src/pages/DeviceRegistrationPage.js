// src/pages/DeviceRegistrationPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import Layout from '../components/common/Layout';
import { FaCopy, FaCheck, FaShieldAlt, FaClock } from 'react-icons/fa';
import { deviceService } from '../services/deviceService';

const DeviceRegistrationPage = () => {
  const [deviceCode, setDeviceCode] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [employeeUsername, setEmployeeUsername] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activationCode, setActivationCode] = useState('');
  const [expiryTime, setExpiryTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // Countdown timer for activation code expiry
  useEffect(() => {
    if (expiryTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const diff = expiryTime - now;
        if (diff <= 0) {
          setTimeLeft('Expired!');
          clearInterval(interval);
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [expiryTime]);

  const handlePasteCode = () => {
    const sampleCode = {
      android_id: 'd44455ad60a87a71',
      device_model: '23090RA98G',
      serial_number: 'unknown',
      installation_id: '61ec143b-2edb-402b-9ba4-648bf84b01b7',
      public_key: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC50c90b833ae741c735e85185265b4dffwIDAQAB',
      brand: 'Redmi',
      manufacturer: 'Xiaomi',
      timestamp: new Date().toISOString()
    };
    setDeviceCode(JSON.stringify(sampleCode, null, 2));
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(deviceCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRegisterDevice = async () => {
    if (!deviceCode) {
      setResult({ success: false, message: 'Please paste the device code' });
      return;
    }
    if (!employeeUsername) {
      setResult({ success: false, message: 'Please enter employee username' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await deviceService.registerDevice({
        deviceCode: deviceCode,
        deviceName: deviceName || 'My Device',
        employeeUsername: employeeUsername.trim()
      });

      if (response.success) {
        setActivationCode(response.activationCode);
        const expiry = Date.now() + 3 * 60 * 1000;
        setExpiryTime(expiry);
        setResult({
          success: true,
          message: 'Device registered successfully!'
        });
        setDeviceName('');
        setEmployeeUsername('');
      } else {
        setResult({
          success: false,
          message: response.message || 'Registration failed'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error.response?.data?.message || 'Error registering device'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    setDeviceCode('');
    setDeviceName('');
    setEmployeeUsername('');
    setActivationCode('');
    setExpiryTime(null);
    setTimeLeft(null);
    setResult(null);
  };

  return (
    <Layout>
      <Container>
        <h2 className="mb-4">Device Registration</h2>
        <p className="text-muted mb-4">
          Paste the device code from the Soft Token app and associate it with an employee.
        </p>
        <Row>
          <Col lg={8} className="mx-auto">
            <Card>
              <Card.Header>
                <FaShieldAlt className="me-2" />
                Register New Device
              </Card.Header>
              <Card.Body>
                {result && (
                  <Alert variant={result.success ? 'success' : 'danger'} className="mb-3">
                    <Alert.Heading>{result.success ? 'Success!' : 'Error!'}</Alert.Heading>
                    <p>{result.message}</p>
                    {result.success && activationCode && (
                      <div>
                        <p>
                          <strong>Activation Code:</strong>
                          <span className="text-primary fw-bold ms-2" style={{ fontSize: '24px', letterSpacing: '4px' }}>
                            {activationCode}
                          </span>
                        </p>
                        {timeLeft && (
                          <div className="d-flex align-items-center mt-2">
                            <FaClock className="text-warning me-2" />
                            <span className={timeLeft === 'Expired!' ? 'text-danger fw-bold' : 'text-warning'}>
                              <strong>Code expires in: {timeLeft}</strong>
                            </span>
                          </div>
                        )}
                        <p className="mb-0">
                          <small className="text-muted">
                            Use this code in the Soft Token app to activate your device.
                            The code expires in 3 minutes.
                          </small>
                        </p>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="mt-2"
                          onClick={handleClearForm}
                        >
                          Register Another Device
                        </Button>
                      </div>
                    )}
                  </Alert>
                )}

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Employee Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter employee username (e.g., johndoe)"
                      value={employeeUsername}
                      onChange={(e) => setEmployeeUsername(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                      This username will associate the device with an employee.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Device Name (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., Office Laptop"
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Device Code (from Soft Token app)</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        as="textarea"
                        rows={8}
                        placeholder="Paste the device code here..."
                        value={deviceCode}
                        onChange={(e) => setDeviceCode(e.target.value)}
                        className="font-monospace"
                        style={{ fontSize: '12px' }}
                      />
                    </div>
                  </Form.Group>

                  <div className="d-flex gap-2 mb-3">
                    <Button variant="outline-secondary" onClick={handlePasteCode}>
                      📋 Paste Sample Code
                    </Button>
                    {deviceCode && (
                      <>
                        <Button variant="outline-primary" onClick={handleCopyCode}>
                          {isCopied ? <FaCheck className="me-1" /> : <FaCopy className="me-1" />}
                          {isCopied ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button variant="outline-danger" onClick={handleClearForm}>
                          Clear
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleRegisterDevice}
                    disabled={!deviceCode || !employeeUsername || isLoading}
                    className="w-100"
                  >
                    {isLoading ? 'Registering...' : 'Register Device'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default DeviceRegistrationPage;