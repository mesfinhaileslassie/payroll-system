// src/pages/BudgetApprovalPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import Layout from '../components/common/Layout';
import { FaMoneyBillWave, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

// API Base URL
const API_URL = 'https://radial-settle-docile.ngrok-free.dev/api';

const BudgetApprovalPage = () => {
  const [amount, setAmount] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [budgetId, setBudgetId] = useState(null);
  const [secretKey, setSecretKey] = useState('');
  const [deviceId, setDeviceId] = useState(null);

  // Load secret key from storage or API
  useEffect(() => {
    const loadSecretKey = async () => {
      try {
        // In production, get this from the device registration
        // For now, we'll fetch it from the API
        const response = await axios.get(`${API_URL}/device/1`);
        if (response.data.success) {
          setSecretKey(response.data.data.secretKey);
          setDeviceId(response.data.data.id);
        }
      } catch (error) {
        console.error('Error loading secret key:', error);
      }
    };
    loadSecretKey();
  }, []);

  const handleSubmitBudget = async () => {
    if (!amount || !department || !description) {
      setResult({ success: false, message: 'Please fill in all fields' });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/budget/submit`, {
        amount: parseFloat(amount),
        department,
        description,
        userId: 1
      });

      if (response.data.success) {
        setBudgetId(response.data.approvalId);
        setShowOTP(true);
        setResult({
          success: true,
          message: 'Budget submitted. Enter OTP to approve.'
        });
      } else {
        setResult({
          success: false,
          message: response.data.message || 'Submission failed'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error.response?.data?.message || 'Error submitting budget'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      setResult({ success: false, message: 'Please enter a valid 6-digit OTP' });
      return;
    }

    if (!secretKey) {
      setResult({ success: false, message: 'Secret key not loaded. Please refresh.' });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      // Step 1: Verify OTP with backend
      const response = await axios.post(`${API_URL}/device/verify-otp`, {
        secretKey: secretKey,
        token: otp
      });

      if (response.data.valid) {
        // Step 2: OTP is valid - approve budget
        if (budgetId) {
          const approveResponse = await axios.post(`${API_URL}/budget/${budgetId}/approve`, {
            otp: otp
          });

          if (approveResponse.data.success) {
            setResult({ 
              success: true, 
              message: '✅ OTP Verified! Budget approved successfully.' 
            });
            setShowOTP(false);
            setOtp('');
            setAmount('');
            setDepartment('');
            setDescription('');
          } else {
            setResult({ 
              success: false, 
              message: approveResponse.data.message || 'Budget approval failed' 
            });
          }
        } else {
          setResult({ 
            success: false, 
            message: 'Budget ID not found. Please resubmit.' 
          });
        }
      } else {
        setResult({ 
          success: false, 
          message: '❌ Invalid OTP. Please try again.' 
        });
        setOtp('');
      }
    } catch (error) {
      setResult({ 
        success: false, 
        message: error.response?.data?.message || 'Error verifying OTP' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setIsSubmitting(true);
    setResult(null);
    setOtp('');

    try {
      const response = await axios.post(`${API_URL}/device/generate-otp`, {
        userId: 1,
        deviceId: deviceId
      });

      if (response.data.success) {
        setResult({ 
          success: true, 
          message: '✅ New OTP generated. Enter the code from your app.' 
        });
      } else {
        setResult({ 
          success: false, 
          message: response.data.message || 'Failed to generate OTP' 
        });
      }
    } catch (error) {
      setResult({ 
        success: false, 
        message: error.response?.data?.message || 'Error generating OTP' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Container>
        <h2 className="mb-4">Budget Approval</h2>
        <p className="text-muted mb-4">
          Submit a budget for approval with OTP verification from your Soft Token app
        </p>

        <Row>
          <Col lg={8} className="mx-auto">
            <Card>
              <Card.Header>
                <FaMoneyBillWave className="me-2" />
                Budget Request
              </Card.Header>
              <Card.Body>
                {result && (
                  <Alert variant={result.success ? 'success' : 'danger'} className="mb-3">
                    {result.success && <FaCheckCircle className="me-2" />}
                    {result.message}
                  </Alert>
                )}

                {!showOTP ? (
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Amount (ETB)</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter budget amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Department</Form.Label>
                      <Form.Select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                      >
                        <option value="">Select department</option>
                        <option value="IT">IT</option>
                        <option value="Finance">Finance</option>
                        <option value="HR">HR</option>
                        <option value="Operations">Operations</option>
                        <option value="Marketing">Marketing</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Describe the budget request"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      onClick={handleSubmitBudget}
                      disabled={isSubmitting}
                      className="w-100"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
                    </Button>
                  </Form>
                ) : (
                  <div>
                    <Alert variant="info">
                      <FaShieldAlt className="me-2" />
                      Enter the OTP from your Soft Token app to approve this budget.
                      <br />
                      <small className="text-muted">
                        Open your Soft Token app, go to Token screen, and generate a token.
                      </small>
                    </Alert>

                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Enter OTP from Soft Token App</Form.Label>
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
                          The OTP expires in 30 seconds
                        </Form.Text>
                      </Form.Group>

                      <div className="d-flex gap-2">
                        <Button
                          variant="success"
                          onClick={handleVerifyOTP}
                          disabled={isSubmitting || otp.length < 6}
                          className="flex-grow-1"
                        >
                          {isSubmitting ? 'Verifying...' : 'Approve Budget'}
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={handleResendOTP}
                          disabled={isSubmitting}
                        >
                          Resend OTP
                        </Button>
                      </div>
                    </Form>

                    <div className="text-center mt-3">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                          setShowOTP(false);
                          setOtp('');
                          setResult(null);
                        }}
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default BudgetApprovalPage;