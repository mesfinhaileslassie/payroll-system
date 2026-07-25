// src/pages/FinanceManagerDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaCheckCircle, FaClock, FaTimesCircle, FaUsers, FaDollarSign } from 'react-icons/fa';

const API_URL = 'http://127.0.0.1:5062/api';

const FinanceManagerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [pendingBudgets, setPendingBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/budget/all`);
      const budgets = res.data.data || [];
      const pending = budgets.filter(b => b.status === 'PENDING');
      const approved = budgets.filter(b => b.status === 'APPROVED');
      const rejected = budgets.filter(b => b.status === 'REJECTED');
      setStats({ pending: pending.length, approved: approved.length, rejected: rejected.length });
      setPendingBudgets(pending.slice(0, 5)); // recent 5 pending
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
          <h1 className="display-5 fw-bold">Finance Manager Dashboard</h1>
          <p className="text-muted">Welcome back, {user?.username}!</p>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/admin/budget-approval" variant="success" size="lg">
            <FaCheckCircle className="me-2" /> Review Pending Budgets
          </Button>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
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
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <Card.Body className="d-flex align-items-center">
              <FaTimesCircle size={40} className="me-3" />
              <div>
                <h6 className="text-uppercase mb-0" style={{ opacity: 0.8 }}>Rejected</h6>
                <h2 className="fw-bold mb-0">{stats.rejected}</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pending Budgets Table */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white fw-bold">
          <FaUsers className="me-2" /> Pending Budgets for Review
        </Card.Header>
        <Card.Body>
          {pendingBudgets.length === 0 ? (
            <p className="text-muted">No pending budgets to review.</p>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Department</th>
                  <th>Amount</th>
                  <th>Submitted By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingBudgets.map(b => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.department}</td>
                    <td>${b.amount}</td>
                    <td>{b.userId}</td> {/* Could fetch username */}
                    <td>
                      <Button as={Link} to={`/admin/budget-approval`} variant="outline-primary" size="sm">
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          <div className="text-end">
            <Button as={Link} to="/admin/budget-approval" variant="outline-primary" size="sm">
              View All Pending
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FinanceManagerDashboard;