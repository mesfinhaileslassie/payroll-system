// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; // ✅ Use the configured api instance
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

// Remove the hardcoded API_URL – it's now in api.js
// const API_URL = 'http://127.0.0.1:5062/api';

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
      // ✅ Use api instance instead of axios directly
      const response = await api.post('/auth/login', { username, password });
      if (response.data.success) {
        const { userId, username, role, token } = response.data;
        localStorage.setItem('authToken', token);
        login({ userId, username, role, token });
        
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
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .login-card {
          width: 100%;
          max-width: 380px;
          border: 1px solid #e9edf4;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
          background: #ffffff;
          overflow: hidden;
        }
        .login-card .card-body {
          padding: 2rem 1.5rem;
        }
        .login-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .login-header .brand-icon {
          width: 56px;
          height: 56px;
          background: #0b2b4a;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          color: white;
          font-size: 28px;
        }
        .login-header h3 {
          font-weight: 700;
          color: #0b2b4a;
          margin-bottom: 0.25rem;
          font-size: 1.5rem;
        }
        .login-header p {
          color: #6c757d;
          font-size: 0.85rem;
          margin: 0;
        }
        .form-group-custom {
          position: relative;
          margin-bottom: 1rem;
        }
        .form-group-custom .form-control {
          padding-left: 2.75rem;
          height: 44px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          transition: all 0.2s;
          font-size: 0.9rem;
        }
        .form-group-custom .form-control:focus {
          border-color: #0b2b4a;
          box-shadow: 0 0 0 3px rgba(11, 43, 74, 0.1);
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
          height: 46px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          background: #0b2b4a;
          border: none;
          transition: all 0.2s;
        }
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(11, 43, 74, 0.3);
        }
        .login-btn:disabled {
          opacity: 0.7;
          transform: none;
        }
        .login-footer {
          text-align: center;
          margin-top: 1.25rem;
          font-size: 0.8rem;
          color: #94a3b8;
        }
        .login-footer a {
          color: #0b2b4a;
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
          font-size: 0.85rem;
          padding: 0.6rem 0.8rem;
        }
      `}</style>

      <Card className="login-card">
        <Card.Body>
          <div className="login-header">
            <div className="brand-icon">
              <FaSignInAlt />
            </div>
            <h3>Welcome Back</h3>
            <p>Sign in to your account</p>
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