// src/pages/DeviceManagementPage.js
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Spinner, Card, Form, Modal, Badge } from 'react-bootstrap';
import Layout from '../components/common/Layout';
import { FaTrash, FaSync, FaEdit, FaLaptop, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5062/api';

const deviceStyles = `
.dmp-page {
  background: #f8fafc;
  padding: 2rem 1.5rem;
  min-height: 100vh;
}
.dmp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}
.dmp-header h2 {
  font-weight: 700;
  font-size: 2rem;
  color: #0b2b4a;
  letter-spacing: -0.02em;
  margin: 0;
}
.dmp-header p {
  color: #64748b;
  font-size: 1rem;
  margin: 0.25rem 0 0 0;
}
.dmp-stats {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.dmp-stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem 1.2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.dmp-stat-number {
  font-weight: 700;
  font-size: 1.1rem;
  color: #0b2b4a;
}
.dmp-stat-label {
  color: #64748b;
  font-size: 0.85rem;
}
.dmp-table-card {
  border-radius: 16px;
  border: none;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.dmp-table-card .card-header {
  background: white;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e9edf4;
  font-weight: 600;
  color: #0b2b4a;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.dmp-table-card .card-body {
  padding: 0;
}
.dmp-table {
  margin-bottom: 0;
}
.dmp-table thead th {
  background: #f8fafc;
  padding: 0.9rem 1.5rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
  font-weight: 700;
  border-bottom: 1px solid #e9edf4;
}
.dmp-table tbody td {
  padding: 1rem 1.5rem;
  vertical-align: middle;
  border-bottom: 1px solid #f1f4f9;
}
.dmp-table tbody tr:hover {
  background: #f8fafc;
}
.dmp-actions {
  display: flex;
  gap: 0.5rem;
}
.dmp-action-btn {
  padding: 0.35rem 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.8rem;
  border: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.dmp-action-btn-edit {
  background: #e0f2fe;
  color: #0369a1;
}
.dmp-action-btn-edit:hover {
  background: #bae6fd;
}
.dmp-action-btn-delete {
  background: #fee2e2;
  color: #b91c1c;
}
.dmp-action-btn-delete:hover {
  background: #fecaca;
}
.dmp-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  color: #94a3b8;
}
.dmp-empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  opacity: 0.4;
}
@media (max-width: 768px) {
  .dmp-page {
    padding: 1rem;
  }
  .dmp-header h2 {
    font-size: 1.5rem;
  }
}
`;

const DeviceManagementPage = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [editForm, setEditForm] = useState({ deviceName: '', status: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);

  const fetchDevices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/device/all`);
      setDevices(response.data.data || []);
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError(err.message || 'Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleDelete = async (deviceId) => {
    if (!window.confirm('Are you sure you want to delete this device?')) return;
    try {
      await axios.delete(`${API_URL}/device/${deviceId}`);
      fetchDevices();
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (err) {
      console.error('Error deleting device:', err);
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleEditClick = (device) => {
    setEditingDevice(device);
    setEditForm({
      deviceName: device.deviceName || '',
      status: device.status || 'PENDING'
    });
    setEditError(null);
    setEditSuccess(false);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.deviceName.trim()) {
      setEditError('Device name is required');
      return;
    }

    setEditLoading(true);
    setEditError(null);
    setEditSuccess(false);
    try {
      await axios.put(`${API_URL}/device/${editingDevice.id}`, {
        deviceName: editForm.deviceName.trim(),
        status: editForm.status
      });
      fetchDevices();
      setEditSuccess(true);
      setTimeout(() => {
        setShowEditModal(false);
        setEditSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Error updating device:', err);
      setEditError(err.response?.data?.message || 'Failed to update device');
    } finally {
      setEditLoading(false);
    }
  };

  // Count devices by status
  const activeCount = devices.filter(d => d.status === 'ACTIVE').length;
  const inactiveCount = devices.filter(d => d.status === 'INACTIVE').length;
  const pendingCount = devices.filter(d => d.status === 'PENDING').length;

  return (
    <Layout>
      <div className="dmp-page">
        <style>{deviceStyles}</style>
        <Container fluid>
          {/* Header */}
          <div className="dmp-header">
            <div>
              <h2>Device Management</h2>
              <p>Manage all registered devices</p>
            </div>
            <div className="dmp-stats">
              <div className="dmp-stat-item">
                <FaLaptop className="text-primary" />
                <span className="dmp-stat-number">{devices.length}</span>
                <span className="dmp-stat-label">Total</span>
              </div>
              <div className="dmp-stat-item">
                <FaCheckCircle className="text-success" />
                <span className="dmp-stat-number">{activeCount}</span>
                <span className="dmp-stat-label">Active</span>
              </div>
              <div className="dmp-stat-item">
                <FaTimesCircle className="text-danger" />
                <span className="dmp-stat-number">{inactiveCount}</span>
                <span className="dmp-stat-label">Inactive</span>
              </div>
              <div className="dmp-stat-item">
                <FaClock className="text-warning" />
                <span className="dmp-stat-number">{pendingCount}</span>
                <span className="dmp-stat-label">Pending</span>
              </div>
            </div>
          </div>

          {deleteSuccess && (
            <Alert variant="success" dismissible onClose={() => setDeleteSuccess(false)}>
              Device deleted successfully!
            </Alert>
          )}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Device Table */}
          <Card className="dmp-table-card">
            <Card.Header>
              <span><FaLaptop className="me-2" /> Registered Devices</span>
              <Button variant="outline-primary" size="sm" onClick={fetchDevices} disabled={loading}>
                <FaSync className={loading ? 'spin' : ''} /> Refresh
              </Button>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2 text-muted">Loading devices...</p>
                </div>
              ) : devices.length === 0 ? (
                <div className="dmp-empty-state">
                  <FaLaptop className="dmp-empty-icon" />
                  <p className="mb-0">No devices registered yet.</p>
                </div>
              ) : (
                <Table responsive className="dmp-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Device Name</th>
                      <th>Model</th>
                      <th>Status</th>
                      <th>User ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map(device => {
                      let badgeColor = 'secondary';
                      if (device.status === 'ACTIVE') badgeColor = 'success';
                      else if (device.status === 'INACTIVE') badgeColor = 'danger';
                      else if (device.status === 'PENDING') badgeColor = 'warning';
                      return (
                        <tr key={device.id}>
                          <td><span className="fw-bold">#{device.id}</span></td>
                          <td>{device.deviceName || 'N/A'}</td>
                          <td>{device.deviceModel || 'N/A'}</td>
                          <td>
                            <Badge bg={badgeColor}>{device.status}</Badge>
                          </td>
                          <td>{device.userId}</td>
                          <td>
                            <div className="dmp-actions">
                              <Button
                                variant="link"
                                className="dmp-action-btn dmp-action-btn-edit"
                                onClick={() => handleEditClick(device)}
                              >
                                <FaEdit /> Edit
                              </Button>
                              <Button
                                variant="link"
                                className="dmp-action-btn dmp-action-btn-delete"
                                onClick={() => handleDelete(device.id)}
                              >
                                <FaTrash /> Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>

          {/* Edit Modal */}
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="fw-bold">Edit Device</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {editSuccess && <Alert variant="success">Device updated successfully!</Alert>}
              {editError && <Alert variant="danger">{editError}</Alert>}
              <Form onSubmit={handleEditSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Device Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="deviceName"
                    value={editForm.deviceName}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="PENDING">Pending</option>
                  </Form.Select>
                </Form.Group>
                <div className="d-flex justify-content-end gap-2">
                  <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={editLoading}>
                    {editLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Save Changes'}
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </Layout>
  );
};

export default DeviceManagementPage;