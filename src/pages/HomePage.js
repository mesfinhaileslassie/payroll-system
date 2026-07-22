// src/pages/HomePage.js
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaQrcode, FaMoneyBillWave, FaMobileAlt, FaShieldAlt } from 'react-icons/fa';
import Layout from '../components/common/Layout';

const HomePage = () => {
  return (
    <Layout>
      <Container>
        <h2 className="mb-4">Welcome to Payroll System</h2>
        <p className="text-muted mb-4">
          Manage device registration, budget approvals, and OTP verification
        </p>

        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100">
              <Card.Body className="text-center">
                <FaQrcode size={48} className="text-primary mb-3" />
                <Card.Title>Register Device</Card.Title>
                <Card.Text className="text-muted">
                  Register a new device with the Soft Token system
                </Card.Text>
                <Button as={Link} to="/device-registration" variant="primary">
                  Go to Registration
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="h-100">
              <Card.Body className="text-center">
                <FaMoneyBillWave size={48} className="text-warning mb-3" />
                <Card.Title>Budget Approval</Card.Title>
                <Card.Text className="text-muted">
                  Approve budgets with OTP verification
                </Card.Text>
                <Button as={Link} to="/budget-approval" variant="warning">
                  Approve Budget
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="h-100">
              <Card.Body className="text-center">
                <FaShieldAlt size={48} className="text-success mb-3" />
                <Card.Title>OTP Verification</Card.Title>
                <Card.Text className="text-muted">
                  Verify OTP codes from Soft Token
                </Card.Text>
                <Button as={Link} to="/otp-verification" variant="success">
                  Verify OTP
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>
                <FaMobileAlt className="me-2" />
                Recent Device Registrations
              </Card.Header>
              <Card.Body>
                <p className="text-muted text-center">
                  No recent device registrations
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default HomePage;