// src/pages/PayrollOfficerDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaPlusCircle, FaMoneyBillWave, FaCheckCircle, FaClock, FaUser } from 'react-icons/fa';

const API_URL = 'http://127.0.0.1:5062/api';

const PayrollOfficerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  const [recentBudgets, setRecentBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch budgets submitted by this user (all budgets for now, but we filter by userId)
      const res = await axios.get(`${API_URL}/budget/user/${user.userId}`);
      const budgets = res.data.data || [];
      setRecentBudgets(budgets.slice(0, 5)); // recent 5
      const pending = budgets.filter(b => b.status === 'PENDING').length;
      const approved = budgets.filter(b => b.status === 'APPROVED').length;
      setStats({ total: budgets.length, pending, approved });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
          <h1 className="display-5 fw-bold">Payroll Officer Dashboard</h1>
          <p className="text-muted">Welcome back, {user?.username}!</p>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/admin/budget-approval" variant="primary" size="lg">
            <FaPlusCircle className="me-2" /> Submit New Budget
          </Button>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Card.Body className="d-flex align-items-center">
              <FaMoneyBillWave size={40} className="me-3" />
              <div>
                <h6 className="text-uppercase mb-0" style={{ opacity: 0.8 }}>Total Budgets</h6>
                <h2 className="fw-bold mb-0">{stats.total}</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <Card.Body className="d-flex align-items-center">
              <FaClock size={40} className="me-3" />
              <div>
                <h6 className="text-uppercase mb-0" style={{ opacity: 0.8 }}>Pending</h6>
                <h2 className="fw-bold mb-0">{stats.pending}</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <Card.Body className="d-flex align-items-center">
              <FaCheckCircle size={40} className="me-3" />
              <div>
                <h6 className="text-uppercase mb-0" style={{ opacity: 0.8 }}>Approved</h6>
                <h2 className="fw-bold mb-0">{stats.approved}</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Budgets Table */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white fw-bold">
          <FaUser className="me-2" /> Recent Budgets
        </Card.Header>
        <Card.Body>
          {recentBudgets.length === 0 ? (
            <p className="text-muted">No budgets found.</p>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Department</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {recentBudgets.map(b => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.department}</td>
                    <td>${b.amount}</td>
                    <td>
                      <Badge bg={b.status === 'APPROVED' ? 'success' : b.status === 'PENDING' ? 'warning' : 'secondary'}>
                        {b.status}
                      </Badge>
                    </td>
                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          <div className="text-end">
            <Button as={Link} to="/admin/budget-approval" variant="outline-primary" size="sm">
              View All Budgets
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PayrollOfficerDashboard;