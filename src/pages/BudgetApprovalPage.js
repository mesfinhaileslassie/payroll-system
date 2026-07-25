// src/pages/BudgetApprovalPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Table } from 'react-bootstrap';
import Layout from '../components/common/Layout';
import { FaMoneyBillWave, FaCheckCircle, FaPlus, FaTimes, FaSearch } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5062/api';

// Custom styles for the page (injected via <style> inside component)
const budgetStyles = `
.bap-page {
  background: #f8fafc;
  padding: 2rem 1.5rem;
  min-height: 100vh;
}

.bap-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.bap-header h2 {
  font-weight: 700;
  font-size: 2rem;
  color: #0b2b4a;
  letter-spacing: -0.02em;
  margin: 0;
}

.bap-header p {
  color: #64748b;
  font-size: 1rem;
  margin: 0.25rem 0 0 0;
}

.bap-submit-card {
  border-radius: 16px;
  border: none;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  margin-bottom: 2rem;
}

.bap-submit-card .card-header {
  background: white;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e9edf4;
  font-weight: 600;
  color: #0b2b4a;
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.bap-submit-card .card-body {
  padding: 1.5rem;
}

.bap-submit-btn {
  padding: 0.6rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border: none;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.25);
  transition: all 0.2s ease;
}

.bap-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.35);
}

.bap-table-card {
  border-radius: 16px;
  border: none;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.bap-table-card .card-header {
  background: white;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e9edf4;
  font-weight: 600;
  color: #0b2b4a;
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.bap-table-card .card-body {
  padding: 0;
}

.bap-table {
  margin-bottom: 0;
}

.bap-table thead th {
  background: #f8fafc;
  padding: 0.9rem 1.5rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
  font-weight: 700;
  border-bottom: 1px solid #e9edf4;
}

.bap-table tbody td {
  padding: 1rem 1.5rem;
  vertical-align: middle;
  border-bottom: 1px solid #f1f4f9;
}

.bap-table tbody tr:hover {
  background: #f8fafc;
}

.bap-amount {
  font-weight: 700;
  color: #0b2b4a;
}

.bap-approve-btn {
  padding: 0.35rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  background: white;
  color: #16a34a;
  border: 1px solid #bbf7d0;
  transition: all 0.2s ease;
}

.bap-approve-btn:hover {
  background: #f0fdf4;
  border-color: #86efac;
  color: #15803d;
}

.bap-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  color: #94a3b8;
}

.bap-empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  opacity: 0.4;
}

.bap-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.bap-modal-content {
  background: white;
  padding: 2rem 1.5rem;
  border-radius: 20px;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.bap-modal-title {
  font-weight: 700;
  font-size: 1.25rem;
  color: #0b2b4a;
  margin-bottom: 1.5rem;
}

.bap-modal-otp-input {
  font-size: 24px;
  text-align: center;
  letter-spacing: 8px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
}

.bap-modal-otp-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.bap-modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.bap-modal-approve-btn {
  flex: 1;
  padding: 0.6rem;
  border-radius: 10px;
  font-weight: 600;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border: none;
  color: white;
  transition: all 0.2s ease;
}

.bap-modal-approve-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
}

.bap-modal-approve-btn:disabled {
  opacity: 0.6;
  transform: none;
  box-shadow: none;
}

.bap-modal-cancel-btn {
  padding: 0.6rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.bap-modal-cancel-btn:hover {
  background: #f1f5f9;
}

@media (max-width: 768px) {
  .bap-page {
    padding: 1rem;
  }
  .bap-header h2 {
    font-size: 1.5rem;
  }
  .bap-modal-content {
    padding: 1.5rem;
  }
}
`;

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
  const [approveUsername, setApproveUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [approving, setApproving] = useState(false);
  const [approveResult, setApproveResult] = useState(null);

  // Fetch pending budgets
  const fetchBudgets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/budget/all`);
      if (response.data.success) {
        const allBudgets = response.data.data || [];
        const pendingBudgets = allBudgets.filter(b =>
          (b.status || b.Status) === 'PENDING'
        );
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
    setApproveUsername('');
    setOtp('');
  };

  // Submit OTP approval
  const handleApproveSubmit = async () => {
    if (!approveUsername || !otp) {
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
      <div className="bap-page">
        <style>{budgetStyles}</style>
        <Container fluid>
          {/* Header */}
          <div className="bap-header">
            <div>
              <h2>Budget Approval</h2>
              <p>Submit new budgets and approve pending requests using OTP from your device.</p>
            </div>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          {/* Submit Budget Form */}
          <Card className="bap-submit-card">
            <Card.Header>
              <FaMoneyBillWave className="me-2" /> Submit New Budget
            </Card.Header>
            <Card.Body>
              {submitResult && (
                <Alert variant={submitResult.success ? 'success' : 'danger'}>
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
                <Button variant="primary" type="submit" disabled={submitting} className="bap-submit-btn">
                  {submitting ? (
                    <><Spinner as="span" animation="border" size="sm" className="me-2" /> Submitting...</>
                  ) : (
                    <><FaPlus className="me-2" /> Submit Budget</>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Pending Budgets Table */}
          <Card className="bap-table-card">
            <Card.Header>
              <FaCheckCircle className="me-2" /> Pending Budgets
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2 text-muted">Loading pending budgets...</p>
                </div>
              ) : budgets.length === 0 ? (
                <div className="bap-empty-state">
                  <FaMoneyBillWave className="bap-empty-icon" />
                  <p className="mb-0">No pending budgets.</p>
                </div>
              ) : (
                <>
                  <Table responsive className="bap-table">
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
                          <td><span className="fw-bold">#{budget.id}</span></td>
                          <td>{budget.department}</td>
                          <td className="bap-amount">${Number(budget.amount).toLocaleString()}</td>
                          <td>{budget.description}</td>
                          <td>
                            <Button
                              variant="link"
                              className="bap-approve-btn"
                              onClick={() => handleApproveClick(budget.id)}
                            >
                              Approve
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}
            </Card.Body>
          </Card>

          {/* Approval Modal */}
          {showModal && (
            <div className="bap-modal-overlay">
              <div className="bap-modal-content">
                <h4 className="bap-modal-title">Approve Budget #{selectedBudgetId}</h4>
                {approveResult && (
                  <Alert variant={approveResult.success ? 'success' : 'danger'}>
                    {approveResult.message}
                  </Alert>
                )}
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
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
                      className="bap-modal-otp-input"
                    />
                    <Form.Text className="text-muted">
                      Open your Soft Token app and copy the current token.
                    </Form.Text>
                  </Form.Group>
                  <div className="bap-modal-actions">
                    <Button
                      variant="success"
                      onClick={handleApproveSubmit}
                      disabled={approving}
                      className="bap-modal-approve-btn"
                    >
                      {approving ? (
                        <><Spinner as="span" animation="border" size="sm" className="me-2" /> Approving...</>
                      ) : 'Approve'}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowModal(false)}
                      className="bap-modal-cancel-btn"
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          )}
        </Container>
      </div>
    </Layout>
  );
};

export default BudgetApprovalPage;