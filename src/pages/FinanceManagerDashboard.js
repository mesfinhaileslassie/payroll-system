// src/pages/FinanceManagerDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaCheckCircle, FaClock, FaTimesCircle, FaUsers, FaDollarSign, FaArrowRight, FaListAlt } from 'react-icons/fa';

const API_URL = 'http://127.0.0.1:5062/api';

// Custom CSS for dashboard
const dashboardStyles = `
.fmd-dashboard {
  background: #f8fafc;
  min-height: 100vh;
  padding: 2rem 1.5rem;
}

.fmd-header {
  margin-bottom: 2rem;
}

.fmd-header h1 {
  font-weight: 700;
  font-size: 2rem;
  color: #0b2b4a;
  letter-spacing: -0.02em;
}

.fmd-header p {
  color: #64748b;
  font-size: 1rem;
  margin-top: 0.25rem;
}

.fmd-review-btn {
  padding: 0.65rem 1.8rem;
  border-radius: 12px;
  font-weight: 600;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border: none;
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
  transition: all 0.2s ease;
}

.fmd-review-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(34, 197, 94, 0.4);
}

.fmd-stat-card {
  border-radius: 16px;
  border: none;
  transition: all 0.2s ease;
  overflow: hidden;
}

.fmd-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
}

.fmd-stat-body {
  display: flex;
  align-items: center;
  padding: 1.5rem 1.5rem;
}

.fmd-stat-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.fmd-stat-label {
  text-transform: uppercase;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  opacity: 0.8;
}

.fmd-stat-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.fmd-table-card {
  border-radius: 16px;
  border: none;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.fmd-table-card .card-header {
  background: white;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e9edf4;
  font-size: 1rem;
  font-weight: 600;
  color: #0b2b4a;
}

.fmd-table-card .card-body {
  padding: 0;
}

.fmd-table {
  margin-bottom: 0;
}

.fmd-table thead th {
  background: #f8fafc;
  padding: 0.9rem 1.5rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
  font-weight: 700;
  border-bottom: 1px solid #e9edf4;
}

.fmd-table tbody td {
  padding: 1rem 1.5rem;
  vertical-align: middle;
  border-bottom: 1px solid #f1f4f9;
}

.fmd-table tbody tr:hover {
  background: #f8fafc;
}

.fmd-amount {
  font-weight: 700;
  color: #0b2b4a;
}

.fmd-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  color: #94a3b8;
}

.fmd-empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  opacity: 0.4;
}

.fmd-view-all-btn {
  border-radius: 10px;
  font-weight: 600;
  padding: 0.6rem 1.5rem;
  color: #1e293b;
  border-color: #e2e8f0;
  transition: all 0.2s ease;
}

.fmd-view-all-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.fmd-action-btn {
  border-radius: 8px;
  font-weight: 600;
  padding: 0.35rem 1.2rem;
  background: white;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.fmd-action-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #0b2b4a;
}

.badge-status-pending {
  background: #fef9e7;
  color: #b45309;
  font-weight: 600;
  padding: 0.35rem 0.8rem;
  border-radius: 50px;
  font-size: 0.7rem;
}

.badge-status-approved {
  background: #ecfdf5;
  color: #065f46;
  font-weight: 600;
  padding: 0.35rem 0.8rem;
  border-radius: 50px;
  font-size: 0.7rem;
}

.badge-status-rejected {
  background: #fef2f2;
  color: #991b1b;
  font-weight: 600;
  padding: 0.35rem 0.8rem;
  border-radius: 50px;
  font-size: 0.7rem;
}

@media (max-width: 768px) {
  .fmd-dashboard {
    padding: 1rem;
  }
  .fmd-header h1 {
    font-size: 1.5rem;
  }
  .fmd-stat-value {
    font-size: 1.5rem;
  }
  .fmd-table thead th,
  .fmd-table tbody td {
    padding: 0.7rem 0.8rem;
  }
}
`;

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
      setPendingBudgets(pending.slice(0, 5));
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
    <div className="fmd-dashboard">
      <style>{dashboardStyles}</style>
      <Container fluid>
        {/* Header */}
        <Row className="fmd-header align-items-center">
          <Col xs={12} md={8}>
            <h1>Finance Manager Dashboard</h1>
            <p>Welcome back, <strong>{user?.username}</strong>! Review and manage pending budgets.</p>
          </Col>
          <Col xs={12} md={4} className="d-flex justify-content-md-end mt-3 mt-md-0">
            <Button as={Link} to="/admin/budget-approval" className="fmd-review-btn">
              <FaCheckCircle className="me-2" /> Review Pending
            </Button>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-4 g-4">
          <Col md={4}>
            <Card className="fmd-stat-card" style={{ background: 'linear-gradient(135deg, #facc15 0%, #f59e0b 100%)', color: '#1e293b' }}>
              <div className="fmd-stat-body">
                <div className="fmd-stat-icon-wrapper me-3">
                  <FaClock size={24} />
                </div>
                <div>
                  <div className="fmd-stat-label">Pending</div>
                  <div className="fmd-stat-value">{stats.pending}</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="fmd-stat-card" style={{ background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)', color: 'white' }}>
              <div className="fmd-stat-body">
                <div className="fmd-stat-icon-wrapper me-3">
                  <FaCheckCircle size={24} />
                </div>
                <div>
                  <div className="fmd-stat-label">Approved</div>
                  <div className="fmd-stat-value">{stats.approved}</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="fmd-stat-card" style={{ background: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)', color: 'white' }}>
              <div className="fmd-stat-body">
                <div className="fmd-stat-icon-wrapper me-3">
                  <FaTimesCircle size={24} />
                </div>
                <div>
                  <div className="fmd-stat-label">Rejected</div>
                  <div className="fmd-stat-value">{stats.rejected}</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Pending Budgets Table */}
        <Card className="fmd-table-card">
          <Card.Header>
            <FaListAlt className="me-2" /> Pending Budgets for Review
          </Card.Header>
          <Card.Body>
            {pendingBudgets.length === 0 ? (
              <div className="fmd-empty-state">
                <FaDollarSign className="fmd-empty-icon" />
                <p className="mb-0">No pending budgets to review.</p>
              </div>
            ) : (
              <>
                <Table responsive className="fmd-table">
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
                        <td><span className="fw-bold">#{b.id}</span></td>
                        <td>{b.department}</td>
                        <td className="fmd-amount">${Number(b.amount).toLocaleString()}</td>
                        <td>{b.userId}</td>
                        <td>
                          <Button as={Link} to={`/admin/budget-approval`} className="fmd-action-btn">
                            Review <FaArrowRight className="ms-1" size={12} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="text-end p-3">
                  <Button as={Link} to="/admin/budget-approval" variant="outline-secondary" className="fmd-view-all-btn">
                    View All Pending
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default FinanceManagerDashboard;