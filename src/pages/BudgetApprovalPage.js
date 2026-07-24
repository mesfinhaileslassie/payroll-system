// src/pages/BudgetApprovalPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Table } from 'react-bootstrap';
import Layout from '../components/common/Layout';
import { FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5062/api';

const BudgetApprovalPage = () => {
  // Budget list state
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Budget submission state
  const [amount, setAmount] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // Approval modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [approveEmployeeId, setApproveEmployeeId] = useState('');
  const [approveUsername, setApproveUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [approving, setApproving] = useState(false);
  const [approveResult, setApproveResult] = useState(null);

  // Fetch pending budgets with timeout
  const fetchBudgets = async () => {
    setLoading(true);
    setError(null);
    
    // Create a timeout promise (10 seconds)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out after 10 seconds')), 10000);
    });

    try {
      const response = await Promise.race([
        axios.get(`${API_URL}/budget/all`),
        timeoutPromise
      ]);

      console.log('API Response:', response.data);

      if (response.data.success) {
        const allBudgets = response.data.data || [];
        const pendingBudgets = allBudgets.filter(b => 
          (b.status || b.Status) === 'PENDING'
        );
        console.log('Pending budgets:', pendingBudgets);
        setBudgets(pendingBudgets);
      } else {
        setError('Failed to fetch budgets: ' + (response.data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error fetching budgets:', err);
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  // Submit new budget
  const handleSubmitBudget = async (e) => {
    e.preventDefault();
    if (!amount || !department || !description || !employeeId) {
      setSubmitResult({ success: false, message: 'Please fill in all fields' });
      return;
    }
    const userId = parseInt(employeeId);
    if (isNaN(userId) || userId <= 0) {
      setSubmitResult({ success: false, message: 'Enter a valid Employee ID (positive number)' });
      return;
    }

    setSubmitting(true);
    setSubmitResult(null);
    try {
      const response = await axios.post(`${API_URL}/budget/submit`, {
        amount: parseFloat(amount),
        department,
        description,
        userId
      });
      if (response.data.success) {
        setSubmitResult({ success: true, message: `✅ Budget submitted! Approval ID: ${response.data.approvalId}` });
        setAmount('');
        setDepartment('');
        setDescription('');
        setEmployeeId('');
        fetchBudgets();
      } else {
        setSubmitResult({ success: false, message: response.data.message || 'Submission failed' });
      }
    } catch (err) {
      console.error('Error submitting budget:', err);
      setSubmitResult({ success: false, message: err.response?.data?.message || err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Open approval modal
  const handleApproveClick = (budgetId) => {
    setSelectedBudgetId(budgetId);
    setShowModal(true);
    setApproveResult(null);
    setApproveEmployeeId('');
    setApproveUsername('');
    setOtp('');
  };

  // Submit OTP approval
  const handleApproveSubmit = async () => {
    if (!approveEmployeeId || !approveUsername || !otp) {
      setApproveResult({ success: false, message: 'Please fill in all fields' });
      return;
    }
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setApproveResult({ success: false, message: 'OTP must be 6 digits' });
      return;
    }

    setApproving(true);
    setApproveResult(null);
    try {
      const response = await axios.post(
        `${API_URL}/budget/${selectedBudgetId}/approve-with-otp`,
        {
          employeeId: parseInt(approveEmployeeId),
          username: approveUsername.trim(),
          otp: otp.trim()
        }
      );
      if (response.data.success) {
        setApproveResult({ success: true, message: '✅ Budget approved successfully!' });
        setTimeout(() => {
          setShowModal(false);
          fetchBudgets();
        }, 1500);
      } else {
        setApproveResult({ success: false, message: response.data.message || 'Approval failed' });
      }
    } catch (err) {
      console.error('Error approving budget:', err);
      setApproveResult({ success: false, message: err.response?.data?.message || err.message });
    } finally {
      setApproving(false);
    }
  };

  return (
    <Layout>
      <Container>
        <h2 className="mb-4">Budget Approval</h2>
        <p className="text-muted mb-4">
          Submit new budgets and approve pending ones using OTP from your registered device.
        </p>

        {error && (
          <Alert variant="danger" className="mb-3">
            <strong>Error:</strong> {error}
          </Alert>
        )}

        {/* Submit Budget Form */}
        <Card className="mb-4">
          <Card.Header>
            <FaMoneyBillWave className="me-2" />
            Submit New Budget
          </Card.Header>
          <Card.Body>
            {submitResult && (
              <Alert variant={submitResult.success ? 'success' : 'danger'} className="mb-3">
                {submitResult.message}
              </Alert>
            )}
            <Form onSubmit={handleSubmitBudget}>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Employee ID</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter employee ID"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Amount (ETB)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Department</Form.Label>
                    <Form.Select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    >
                      <option value="">Select</option>
                      <option value="IT">IT</option>
                      <option value="Finance">Finance</option>
                      <option value="HR">HR</option>
                      <option value="Operations">Operations</option>
                      <option value="Marketing">Marketing</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={1}
                      placeholder="Brief description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? <><Spinner as="span" animation="border" size="sm" className="me-2" /> Submitting...</> : 'Submit Budget'}
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {/* Pending Budgets Table */}
        <Card>
          <Card.Header>
            Pending Budgets
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading pending budgets...</p>
              </div>
            ) : (
              <>
                {budgets.length === 0 ? (
                  <Alert variant="info">No pending budgets.</Alert>
                ) : (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Department</th>
                        <th>Amount</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgets.map(budget => (
                        <tr key={budget.id}>
                          <td>{budget.id}</td>
                          <td>{budget.department}</td>
                          <td>{budget.amount}</td>
                          <td>{budget.description}</td>
                          <td>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleApproveClick(budget.id)}
                            >
                              Approve
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </>
            )}
          </Card.Body>
        </Card>

        {/* Approval Modal */}
        {showModal && (
          <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
            }}>
              <h4 className="mb-3">Approve Budget #{selectedBudgetId}</h4>
              {approveResult && (
                <Alert variant={approveResult.success ? 'success' : 'danger'}>
                  {approveResult.message}
                </Alert>
              )}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Employee ID</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter employee ID"
                    value={approveEmployeeId}
                    onChange={(e) => setApproveEmployeeId(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={approveUsername}
                    onChange={(e) => setApproveUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>OTP (6 digits)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setOtp(val);
                    }}
                    style={{
                      fontSize: '24px',
                      textAlign: 'center',
                      letterSpacing: '8px'
                    }}
                  />
                  <Form.Text className="text-muted">
                    Open your Soft Token app and copy the current token.
                  </Form.Text>
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button
                    variant="success"
                    onClick={handleApproveSubmit}
                    disabled={approving}
                    className="flex-grow-1"
                  >
                    {approving ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Approving...
                      </>
                    ) : 'Approve'}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default BudgetApprovalPage;