// src/pages/DeviceRegistrationPage.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { FaCopy, FaCheck, FaShieldAlt } from 'react-icons/fa';
import { deviceService } from '../services/deviceService';

const DeviceRegistrationPage = () => {
  const navigate = useNavigate();
  const [deviceCode, setDeviceCode] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activationCode, setActivationCode] = useState('');

  const handlePasteCode = () => {
    // Sample device code for testing
    const sampleCode = {
      android_id: '8f7da4s812',
      device_model: 'Techno17',
      serial_number: 'SN1234567890',
      installation_id: '550e8400-e29b-41d4-a716-446655440000',
      public_key: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...',
      brand: 'Techno',
      manufacturer: 'Spark',
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

    setIsLoading(true);
    setResult(null);

    try {
      const response = await deviceService.registerDevice({
        deviceCode: deviceCode,
        deviceName: deviceName || 'My Device'
      });

      if (response.success) {
        setActivationCode(response.activationCode);
        setResult({
          success: true,
          message: 'Device registered successfully!'
        });
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

  return (
    <Layout>
      <Container>
        <h2 className="mb-4">Device Registration</h2>
        <p className="text-muted mb-4">
          Paste the device code from the Soft Token app to register a new device
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
                      <p>
                        <strong>Activation Code:</strong> {activationCode}
                        <br />
                        <small>Use this code in the Soft Token app to activate your device.</small>
                      </p>
                    )}
                  </Alert>
                )}

                <Form>
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
                    <Form.Control
                      as="textarea"
                      rows={8}
                      placeholder="Paste the device code here..."
                      value={deviceCode}
                      onChange={(e) => setDeviceCode(e.target.value)}
                      className="font-monospace"
                      style={{ fontSize: '12px' }}
                    />
                  </Form.Group>

                  <div className="d-flex gap-2 mb-3">
                    <Button variant="outline-secondary" onClick={handlePasteCode}>
                      📋 Paste Sample Code
                    </Button>
                    {deviceCode && (
                      <Button variant="outline-primary" onClick={handleCopyCode}>
                        {isCopied ? <FaCheck className="me-1" /> : <FaCopy className="me-1" />}
                        {isCopied ? 'Copied!' : 'Copy'}
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleRegisterDevice}
                    disabled={!deviceCode || isLoading}
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