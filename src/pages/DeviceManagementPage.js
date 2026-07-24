// src/pages/DeviceManagementPage.js
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Spinner } from 'react-bootstrap';
import Layout from '../components/common/Layout';
import { FaTrash, FaSync } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5062/api';

const DeviceManagementPage = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

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
      // Refresh list
      fetchDevices();
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (err) {
      console.error('Error deleting device:', err);
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <Layout>
      <Container>
        <h2 className="mb-4">Device Management</h2>
        <p className="text-muted mb-4">Manage all registered devices</p>

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

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span>Total devices: {devices.length}</span>
          <Button variant="outline-primary" size="sm" onClick={fetchDevices} disabled={loading}>
            <FaSync className={loading ? 'spin' : ''} /> Refresh
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : devices.length === 0 ? (
          <Alert variant="info">No devices registered yet.</Alert>
        ) : (
          <Table striped bordered hover responsive>
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
              {devices.map(device => (
                <tr key={device.id}>
                  <td>{device.id}</td>
                  <td>{device.deviceName || 'N/A'}</td>
                  <td>{device.deviceModel || 'N/A'}</td>
                  <td>
                    <span className={`badge bg-${device.status === 'ACTIVE' ? 'success' : 'warning'}`}>
                      {device.status}
                    </span>
                  </td>
                  <td>{device.userId}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(device.id)}
                      // Removed disabled condition – allow deletion of all devices
                    >
                      <FaTrash /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </Layout>
  );
};

export default DeviceManagementPage;