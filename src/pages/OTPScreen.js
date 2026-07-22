// src/pages/OTPScreen.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import Layout from '../components/common/Layout';
import { FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

const OTPScreen = () => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerifyOTP = () => {
    if (!otp || otp.length < 6) {
      setResult({ success: false, message: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setIsVerifying(true);
    setResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      if (otp === '123456') {
        setResult({ success: true, message: 'OTP verified successfully!' });
      } else {
        setResult({ success: false, message: 'Invalid OTP. Please try again.' });
      }
    }, 1500);
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
                    disabled={isVerifying || otp.length < 6}
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