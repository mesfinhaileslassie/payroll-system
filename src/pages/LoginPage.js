// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

const API_URL = 'http://127.0.0.1:5062/api';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      if (response.data.success) {
        const { userId, username, role, token } = response.data;
        // ✅ Store token for API interceptor
        localStorage.setItem('authToken', token);
        login({ userId, username, role, token });
        
        // Role-based redirection
        if (role === 'Admin') {
          navigate('/admin/dashboard');
        } else if (role === 'PayrollOfficer') {
          navigate('/payroll-officer/dashboard');
        } else if (role === 'FinanceManager') {
          navigate('/finance-manager/dashboard');
        } else {
          navigate('/employee/dashboard');
        }
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <style>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0b2b4a 0%, #1a4a7a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .login-card {
          width: 100%;
          max-width: 440px;
          border: none;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          background: #ffffff;
          overflow: hidden;
        }
        .login-card .card-body {
          padding: 2.5rem 2rem;
        }
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-header .brand-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #0b2b4a 0%, #1a4a7a 100%);
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          color: white;
          font-size: 32px;
        }
        .login-header h3 {
          font-weight: 700;
          color: #0b2b4a;
          margin-bottom: 0.25rem;
        }
        .login-header p {
          color: #6c757d;
          font-size: 0.9rem;
          margin: 0;
        }
        .form-group-custom {
          position: relative;
          margin-bottom: 1.25rem;
        }
        .form-group-custom .form-control {
          padding-left: 2.75rem;
          height: 48px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          transition: all 0.2s;
          font-size: 0.95rem;
        }
        .form-group-custom .form-control:focus {
          border-color: #1a4a7a;
          box-shadow: 0 0 0 3px rgba(26, 74, 122, 0.1);
        }
        .form-group-custom .form-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 16px;
        }
        .login-btn {
          height: 50px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          background: linear-gradient(135deg, #0b2b4a 0%, #1a4a7a 100%);
          border: none;
          transition: all 0.2s;
        }
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(26, 74, 122, 0.3);
        }
        .login-btn:disabled {
          opacity: 0.7;
          transform: none;
        }
        .login-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.85rem;
          color: #94a3b8;
        }
        .login-footer a {
          color: #1a4a7a;
          font-weight: 600;
          text-decoration: none;
        }
        .login-footer a:hover {
          text-decoration: underline;
        }
        .error-alert {
          border-radius: 10px;
          border: none;
          background: #fee2e2;
          color: #b91c1c;
          font-size: 0.9rem;
          padding: 0.75rem 1rem;
        }
      `}</style>

      <Card className="login-card">
        <Card.Body>
          <div className="login-header">
            <div className="brand-icon">
              <FaSignInAlt />
            </div>
            <h3>Welcome Back</h3>
            <p>Sign in to your account to continue</p>
          </div>

          {error && <Alert variant="danger" className="error-alert">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="form-group-custom">
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <FaUser className="form-icon" />
            </Form.Group>

            <Form.Group className="form-group-custom">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaLock className="form-icon" />
            </Form.Group>

            <Form.Group className="mb-3 d-flex justify-content-between align-items-center">
              <Form.Check type="checkbox" label="Remember me" />
              <a href="#" className="text-decoration-none" style={{ fontSize: '0.85rem', color: '#1a4a7a' }}>
                Forgot password?
              </a>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="login-btn w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </Form>

          <div className="login-footer">
            Don't have an account? <a href="#">Contact your administrator</a>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginPage;