// src/pages/OTPScreen.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import Layout from '../components/common/Layout';
import { FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

// Use localhost for development
const API_URL = 'http://localhost:5062/api';

const OTPScreen = () => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [secretKey, setSecretKey] = useState('');
  const [isLoadingSecret, setIsLoadingSecret] = useState(true);
  const [deviceStatus, setDeviceStatus] = useState('');

  // Load secret key from the device
  useEffect(() => {
    const loadSecretKey = async () => {
      setIsLoadingSecret(true);
      try {
        const response = await axios.get(`${API_URL}/device/active`);
        
        if (response.data.success && response.data.data) {
          const deviceData = response.data.data;
          if (deviceData.secretKey) {
            setSecretKey(deviceData.secretKey);
            setDeviceStatus(deviceData.status);
            console.log('✅ Secret Key loaded from active device:', deviceData.secretKey);
          } else {
            console.log('⚠️ Active device found but no secret key');
            setDeviceStatus('NO_SECRET_KEY');
          }
        } else {
          console.log('⚠️ No active device found');
          setDeviceStatus('NO_ACTIVE_DEVICE');
        }
      } catch (error) {
        console.error('❌ Error loading secret key:', error);
        setDeviceStatus('ERROR');
      } finally {
        setIsLoadingSecret(false);
      }
    };
    loadSecretKey();
  }, []);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      setResult({ success: false, message: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setIsVerifying(true);
    setResult(null);

    try {
      console.log('🔑 Verifying OTP...');
      console.log('📱 OTP entered:', otp);

      // ✅ Call the real backend API
      const response = await axios.post(`${API_URL}/device/verify-otp`, {
        token: otp
      });

      console.log('📡 OTP Verification Response:', response.data);

      if (response.data.valid) {
        setResult({ 
          success: true, 
          message: '✅ OTP Verified Successfully!' 
        });
        setOtp('');
      } else {
        setResult({ 
          success: false, 
          message: '❌ Invalid OTP. Please generate a new token in the Soft Token app.' 
        });
        setOtp('');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setResult({ 
        success: false, 
        message: error.response?.data?.message || 'Error verifying OTP' 
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setOtp('');
    setResult(null);
  };

  // Show loading state for secret key
  const renderSecretKeyStatus = () => {
    if (isLoadingSecret) {
      return (
        <Alert variant="info" className="mb-3">
          <FaShieldAlt className="me-2" />
          Loading device information...
        </Alert>
      );
    }
    
    if (!secretKey) {
      return (
        <Alert variant="warning" className="mb-3">
          <FaShieldAlt className="me-2" />
          No active device found. Please register and activate a device first.
          <div className="mt-2">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => window.location.href = '/device-registration'}
            >
              Go to Device Registration
            </Button>
          </div>
        </Alert>
      );
    }
    
    if (deviceStatus !== 'ACTIVE') {
      return (
        <Alert variant="warning" className="mb-3">
          <FaShieldAlt className="me-2" />
          Device is not active. Status: {deviceStatus}
        </Alert>
      );
    }
    
    return null;
  };

  return (
    <Layout>
      <Container>
        <h2 className="mb-4">OTP Verification</h2>
        <p className="text-muted mb-4">
          Enter the OTP from your Soft Token app to verify your identity
        </p>

        <Row>
          <Col lg={6} className="mx-auto">
            <Card>
              <Card.Header>
                <FaShieldAlt className="me-2" />
                OTP Verification
              </Card.Header>
              <Card.Body>
                {renderSecretKeyStatus()}
                
                {result && (
                  <Alert variant={result.success ? 'success' : 'danger'} className="mb-3">
                    {result.success && <FaCheckCircle className="me-2" />}
                    {result.message}
                  </Alert>
                )}

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Enter 6-digit OTP</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setOtp(value);
                        setResult(null);
                      }}
                      style={{
                        fontSize: '24px',
                        textAlign: 'center',
                        letterSpacing: '8px',
                        padding: '12px'
                      }}
                    />
                    <Form.Text className="text-muted">
                      Open your Soft Token app to get the OTP
                    </Form.Text>
                  </Form.Group>

                  <Button
                    variant="primary"
                    onClick={handleVerifyOTP}
                    disabled={isVerifying || otp.length < 6 || !secretKey}
                    className="w-100"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    The OTP expires in 30 seconds. Generate a new one from the app.
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default OTPScreen;