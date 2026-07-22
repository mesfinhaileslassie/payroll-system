// src/pages/BudgetApprovalPage.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import Layout from '../components/common/Layout';
import { FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';

const BudgetApprovalPage = () => {
  const [amount, setAmount] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmitBudget = async () => {
  if (!amount || !department || !description) {
    setResult({ success: false, message: 'Please fill in all fields' });
    return;
  }

  setIsSubmitting(true);
  setResult(null);

  try {
    const response = await axios.post('http://localhost:5062/api/budget/submit', {
      amount: parseFloat(amount),
      department,
      description,
      userId: 1 // Replace with actual user ID from login
    });

    if (response.data.success) {
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


  const handleVerifyOTP = () => {
    if (!otp || otp.length < 6) {
      setResult({ success: false, message: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (otp === '123456') {
        setResult({ success: true, message: 'Budget approved successfully!' });
      } else {
        setResult({ success: false, message: 'Invalid OTP. Please try again.' });
        setOtp('');
      }
    }, 1500);
  };

  return (
    <Layout>
      <Container>
        <h2 className="mb-4">Budget Approval</h2>
        <p className="text-muted mb-4">
          Submit a budget for approval with OTP verification
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
                    </Alert>

                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Enter OTP</Form.Label>
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
                      </Form.Group>

                      <div className="d-flex gap-2">
                        <Button
                          variant="success"
                          onClick={handleVerifyOTP}
                          disabled={isSubmitting || otp.length < 6}
                          className="flex-grow-1"
                        >
                          {isSubmitting ? 'Verifying...' : 'Approve with OTP'}
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            setShowOTP(false);
                            setOtp('');
                            setResult(null);
                          }}
                        >
                          Back
                        </Button>
                      </div>
                    </Form>
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