// src/pages/EmployeeDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Alert, Spinner, Table } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaUser, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';

const API_URL = 'http://127.0.0.1:5062/api';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [otp, setOtp] = useState('');
  const [approving, setApproving] = useState(false);
  const [approveResult, setApproveResult] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch user profile
      const profileRes = await axios.get(`${API_URL}/users/${user.userId}`);
      setProfile(profileRes.data.data);

      // Fetch own budgets
      const budgetsRes = await axios.get(`${API_URL}/budget/user/${user.userId}`);
      setBudgets(budgetsRes.data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (budgetId) => {
    setSelectedBudgetId(budgetId);
    setShowModal(true);
    setApproveResult(null);
    setOtp('');
  };

  const handleApproveSubmit = async () => {
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setApproveResult({ success: false, message: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setApproving(true);
    setApproveResult(null);
    try {
      const response = await axios.post(
        `${API_URL}/budget/${selectedBudgetId}/approve-with-otp`,
        {
          username: user.username,
          otp: otp.trim()
        }
      );
      if (response.data.success) {
        setApproveResult({ success: true, message: '✅ Budget approved!' });
        setTimeout(() => {
          setShowModal(false);
          fetchData();
        }, 1500);
      } else {
        setApproveResult({ success: false, message: response.data.message || 'Approval failed' });
      }
    } catch (err) {
      setApproveResult({ success: false, message: err.response?.data?.message || err.message });
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Employee Dashboard</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Body className="text-center">
              <FaUser size={40} className="text-primary mb-2" />
              <h5>{profile?.firstName} {profile?.lastName}</h5>
              <p className="text-muted">{profile?.username}</p>
              <Button variant="outline-primary" size="sm" onClick={() => window.location.href='/employee/profile'}>
                View Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Body>
              <h5>Quick Stats</h5>
              <Row>
                <Col xs={6}>
                  <strong>Department:</strong> {profile?.department || 'N/A'}
                </Col>
                <Col xs={6}>
                  <strong>Position:</strong> {profile?.position || 'N/A'}
                </Col>
                <Col xs={6}>
                  <strong>Email:</strong> {profile?.email}
                </Col>
                <Col xs={6}>
                  <strong>Phone:</strong> {profile?.phone || 'N/A'}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h4 className="mb-3">My Pending Budgets</h4>
      {budgets.filter(b => b.status === 'PENDING').length === 0 ? (
        <Alert variant="info">No pending budgets.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr><th>ID</th><th>Department</th><th>Amount</th><th>Description</th><th>Action</th></tr>
          </thead>
          <tbody>
            {budgets.filter(b => b.status === 'PENDING').map(budget => (
              <tr key={budget.id}>
                <td>{budget.id}</td>
                <td>{budget.department}</td>
                <td>{budget.amount}</td>
                <td>{budget.description}</td>
                <td>
                  <Button variant="success" size="sm" onClick={() => handleApproveClick(budget.id)}>
                    Approve
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <h4 className="mb-3 mt-4">Approval History</h4>
      {budgets.filter(b => b.status !== 'PENDING').length === 0 ? (
        <Alert variant="info">No past approvals.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr><th>ID</th><th>Department</th><th>Amount</th><th>Status</th><th>Approved At</th></tr>
          </thead>
          <tbody>
            {budgets.filter(b => b.status !== 'PENDING').map(budget => (
              <tr key={budget.id}>
                <td>{budget.id}</td>
                <td>{budget.department}</td>
                <td>{budget.amount}</td>
                <td>
                  <span className={`badge bg-${budget.status === 'APPROVED' ? 'success' : 'danger'}`}>
                    {budget.status}
                  </span>
                </td>
                <td>{budget.approvedAt ? new Date(budget.approvedAt).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Button variant="outline-danger" onClick={logout} className="mt-3">Logout</Button>

      {/* Approval Modal */}
      {showModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', maxWidth: '400px', width: '90%' }}>
            <h4>Approve Budget #{selectedBudgetId}</h4>
            {approveResult && <Alert variant={approveResult.success ? 'success' : 'danger'}>{approveResult.message}</Alert>}
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>OTP (6 digits)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{ fontSize: '24px', textAlign: 'center', letterSpacing: '8px' }}
                />
              </Form.Group>
              <div className="d-flex gap-2">
                <Button variant="success" onClick={handleApproveSubmit} disabled={approving} className="flex-grow-1">
                  {approving ? <Spinner as="span" animation="border" size="sm" /> : 'Approve'}
                </Button>
                <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </Container>
  );
};

export default EmployeeDashboard;