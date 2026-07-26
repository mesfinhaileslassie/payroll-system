// src/pages/FinanceManagerDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner, Modal, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaUsers, FaMoneyBillWave, FaCheckCircle, FaClock, FaTimesCircle, FaPlus } from 'react-icons/fa';

const API_URL = 'http://127.0.0.1:5062/api';

const FinanceManagerDashboard = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [salaryPayments, setSalaryPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pay Salary modal
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [amount, setAmount] = useState('');
  const [otp, setOtp] = useState('');
  const [paying, setPaying] = useState(false);
  const [payResult, setPayResult] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch employees
      const empRes = await axios.get(`${API_URL}/users/employees`);
      setEmployees(empRes.data.data || []);

      // Fetch salary payments (for recent activity)
      const payRes = await axios.get(`${API_URL}/salary/all`);
      setSalaryPayments(payRes.data.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handlePayClick = (employee) => {
    setSelectedEmployee(employee);
    setAmount('');
    setOtp('');
    setPayResult(null);
    setShowModal(true);
  };

  const handlePaySubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setPayResult({ success: false, message: 'Please enter a valid amount' });
      return;
    }
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setPayResult({ success: false, message: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setPaying(true);
    setPayResult(null);
    try {
      const response = await axios.post(`${API_URL}/salary/pay`, {
        employeeId: selectedEmployee.id,
        amount: parseFloat(amount),
        username: user.username,
        otp: otp.trim()
      });
      if (response.data.success) {
        setPayResult({ success: true, message: `✅ Salary paid to ${selectedEmployee.firstName} ${selectedEmployee.lastName}!` });
        setTimeout(() => {
          setShowModal(false);
          fetchData(); // refresh data
        }, 1500);
      } else {
        setPayResult({ success: false, message: response.data.message || 'Payment failed' });
      }
    } catch (err) {
      setPayResult({ success: false, message: err.response?.data?.message || err.message });
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold">Finance Manager Dashboard</h1>
          <p className="text-muted">Welcome back, {user?.username}! Pay salaries to employees.</p>
        </Col>
      </Row>

      {/* Employees Table */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white fw-bold">
          <FaUsers className="me-2" /> Employees
        </Card.Header>
        <Card.Body>
          {employees.length === 0 ? (
            <p className="text-muted">No employees found.</p>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>{emp.firstName} {emp.lastName}</td>
                    <td>{emp.username}</td>
                    <td>{emp.email}</td>
                    <td>
                      <Button variant="success" size="sm" onClick={() => handlePayClick(emp)}>
                        <FaMoneyBillWave className="me-1" /> Pay Salary
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Recent Salary Payments */}
      <Card className="shadow-sm border-0 mt-4">
        <Card.Header className="bg-white fw-bold">
          <FaClock className="me-2" /> Recent Salary Payments
        </Card.Header>
        <Card.Body>
          {salaryPayments.length === 0 ? (
            <p className="text-muted">No salary payments yet.</p>
          ) : (
            <Table responsive hover size="sm">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {salaryPayments.slice(0, 5).map(pay => (
                  <tr key={pay.id}>
                    <td>{pay.employee?.firstName} {pay.employee?.lastName}</td>
                    <td>${pay.amount}</td>
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
          )}
        </Card.Body>
      </Card>

      {/* Pay Salary Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount (ETB)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Enter amount"
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
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handlePaySubmit} disabled={paying}>
            {paying ? <Spinner as="span" animation="border" size="sm" /> : 'Pay Salary'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FinanceManagerDashboard;