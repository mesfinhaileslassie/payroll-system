// src/pages/FinanceManagerDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner, Modal, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSync,
  FaUserPlus,
  FaWallet,
  FaChartLine,
  FaSignOutAlt
} from 'react-icons/fa';

const FinanceManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [salaryPayments, setSalaryPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salaryError, setSalaryError] = useState(null);

  // Pay Salary modal
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMonth, setPaymentMonth] = useState('');
  const [otp, setOtp] = useState('');
  const [paying, setPaying] = useState(false);
  const [payResult, setPayResult] = useState(null);

  // Statistics
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalPaid: 0,
    pendingPayments: 0,
    recentPayments: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setSalaryError(null);

    try {
      const empRes = await api.get('/users/employees');
      const employeesData = empRes.data.data || [];
      setEmployees(employeesData);
      setStats(prev => ({ ...prev, totalEmployees: employeesData.length }));
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees. Please refresh.');
    }

    try {
      const payRes = await api.get('/salary/all');
      const payments = payRes.data.data || [];
      setSalaryPayments(payments);
      const totalPaid = payments.reduce((sum, p) => sum + (p.status === 'APPROVED' ? p.amount : 0), 0);
      const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
      setStats(prev => ({
        ...prev,
        totalPaid,
        pendingPayments,
        recentPayments: payments.length
      }));
    } catch (err) {
      console.error('Error fetching salary payments:', err);
      if (err.response?.status === 401) {
        setSalaryError('Authentication required. Please log in again.');
      } else {
        setSalaryError('Could not load salary history. Please refresh.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const handlePayClick = (employee) => {
    setSelectedEmployee(employee);
    setAmount('');
    setPaymentMonth(getCurrentMonth());
    setOtp('');
    setPayResult(null);
    setShowModal(true);
  };

  const handlePaySubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setPayResult({ success: false, message: 'Please enter a valid amount' });
      return;
    }
    if (!paymentMonth || !/^\d{4}-\d{2}$/.test(paymentMonth)) {
      setPayResult({ success: false, message: 'Please select a valid month (YYYY-MM)' });
      return;
    }
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setPayResult({ success: false, message: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setPaying(true);
    setPayResult(null);
    try {
      const response = await api.post('/salary/pay', {
        employeeId: selectedEmployee.id,
        amount: parseFloat(amount),
        paymentMonth: paymentMonth,
        username: user.username,
        otp: otp.trim()
      });
      if (response.data.success) {
        setPayResult({ success: true, message: `✅ Salary paid to ${selectedEmployee.firstName} ${selectedEmployee.lastName}!` });
        setTimeout(() => {
          setShowModal(false);
          fetchData();
        }, 1500);
      } else {
        setPayResult({ success: false, message: response.data.message || 'Payment failed' });
      }
    } catch (err) {
      console.error('Pay salary error:', err);
      setPayResult({ success: false, message: err.response?.data?.message || err.message });
    } finally {
      setPaying(false);
    }
  };

  if (loading && employees.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <Container fluid>
        {/* Header with Logout */}
        <Row className="mb-4 align-items-center">
          <Col>
            <h1 className="display-5 fw-bold" style={{ color: '#0b2b4a' }}>
              Finance Manager Dashboard
            </h1>
            <p className="text-muted">Welcome back, <strong>{user?.username}</strong>! Manage employee salaries.</p>
          </Col>
          <Col xs="auto" className="d-flex gap-2">
            <Button
              variant="outline-primary"
              onClick={fetchData}
              disabled={loading}
              className="rounded-pill px-4"
            >
              <FaSync className={loading ? 'spin' : ''} /> Refresh
            </Button>
            <Button
              variant="outline-danger"
              onClick={handleLogout}
              className="rounded-pill px-4"
            >
              <FaSignOutAlt className="me-1" /> Logout
            </Button>
          </Col>
        </Row>

        {/* Error Alerts */}
        {error && <Alert variant="danger">{error}</Alert>}
        {salaryError && <Alert variant="warning">{salaryError}</Alert>}

        {/* Statistics Cards */}
        <Row className="mb-4 g-3">
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 me-3" style={{ background: 'rgba(13, 110, 253, 0.1)' }}>
                  <FaUsers size={24} color="#0d6efd" />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Employees</h6>
                  <h3 className="fw-bold mb-0">{stats.totalEmployees}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 me-3" style={{ background: 'rgba(40, 167, 69, 0.1)' }}>
                  <FaWallet size={24} color="#28a745" />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Total Paid</h6>
                  <h3 className="fw-bold mb-0">{stats.totalPaid.toLocaleString()} birr</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 me-3" style={{ background: 'rgba(255, 193, 7, 0.1)' }}>
                  <FaClock size={24} color="#ffc107" />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Pending</h6>
                  <h3 className="fw-bold mb-0">{stats.pendingPayments}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 me-3" style={{ background: 'rgba(23, 162, 184, 0.1)' }}>
                  <FaChartLine size={24} color="#17a2b8" />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Total Payments</h6>
                  <h3 className="fw-bold mb-0">{stats.recentPayments}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Employees Table */}
        <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <Card.Header className="bg-white border-0 py-3">
            <div className="d-flex align-items-center">
              <FaUsers className="me-2 text-primary" />
              <span className="fw-bold">Employees</span>
              <span className="badge bg-primary ms-2 rounded-pill">{employees.length}</span>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">No employees found.</td>
                    </tr>
                  ) : (
                    employees.map(emp => (
                      <tr key={emp.id}>
                        <td>{emp.id}</td>
                        <td><strong>{emp.firstName} {emp.lastName}</strong></td>
                        <td>{emp.username}</td>
                        <td>{emp.email}</td>
                        <td className="text-end">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handlePayClick(emp)}
                            className="rounded-pill px-3"
                          >
                            <FaMoneyBillWave className="me-1" /> Pay Salary
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Recent Salary Payments */}
        {!salaryError && salaryPayments.length > 0 && (
          <Card className="border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <Card.Header className="bg-white border-0 py-3">
              <div className="d-flex align-items-center">
                <FaClock className="me-2 text-secondary" />
                <span className="fw-bold">Recent Salary Payments</span>
                <span className="badge bg-secondary ms-2 rounded-pill">{salaryPayments.length}</span>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0" size="sm">
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th>Employee</th>
                      <th>Month</th>
                      <th className="text-end">Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryPayments.slice(0, 10).map(pay => (
                      <tr key={pay.id}>
                        <td>{pay.employee?.firstName} {pay.employee?.lastName}</td>
                        <td>{pay.paymentMonth}</td>
                        <td className="text-end fw-bold">{pay.amount.toLocaleString()} birr</td>
                        <td>
                          <Badge bg={pay.status === 'APPROVED' ? 'success' : 'warning'}>
                            {pay.status}
                          </Badge>
                        </td>
                        <td>{new Date(pay.approvedAt || pay.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Pay Salary Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton className="border-0">
            <Modal.Title>Pay Salary</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {payResult && (
              <Alert variant={payResult.success ? 'success' : 'danger'}>
                {payResult.message}
              </Alert>
            )}
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Employee</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  value={selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : ''}
                  style={{ background: '#f8fafc' }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Salary Month</Form.Label>
                <Form.Control
                  type="month"
                  value={paymentMonth}
                  onChange={(e) => setPaymentMonth(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Amount (birr)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  placeholder="Enter amount in birr"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>OTP (6 digits from your Soft Token app)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setOtp(val);
                  }}
                  style={{ fontSize: '24px', textAlign: 'center', letterSpacing: '8px' }}
                />
                <Form.Text className="text-muted">
                  Open your Soft Token app to get the OTP.
                </Form.Text>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handlePaySubmit} disabled={paying}>
              {paying ? <Spinner as="span" animation="border" size="sm" /> : 'Pay Salary'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default FinanceManagerDashboard;