// src/pages/EmployeeManagementPage.js
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Spinner, Modal, Form, Badge } from 'react-bootstrap';
import Layout from '../components/common/Layout';
import { FaEdit, FaTrash, FaSync, FaUserPlus, FaCheck, FaTimes } from 'react-icons/fa';
import api from '../services/api';

const EmployeeManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Selection state
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    position: '',
    isActive: true
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/users/all');
      setUsers(response.data.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==================== SELECTION HANDLERS ====================

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      // Select all non-admin users
      const allIds = users.filter(u => u.role !== 'Admin').map(u => u.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (userId) => {
    setSelectedIds(prev => {
      const newIds = prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId];
      // Update selectAll state based on whether all non-admin users are selected
      const nonAdminIds = users.filter(u => u.role !== 'Admin').map(u => u.id);
      setSelectAll(nonAdminIds.every(id => newIds.includes(id)));
      return newIds;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      setError('Please select at least one user to delete.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const confirmMsg = `Are you sure you want to delete ${selectedIds.length} user(s)? This action cannot be undone.`;
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    let deletedCount = 0;
    let failedCount = 0;
    let lastError = null;

    for (const id of selectedIds) {
      try {
        await api.delete(`/users/${id}`);
        deletedCount++;
      } catch (err) {
        failedCount++;
        lastError = err.response?.data?.message || err.message;
        console.error(`Failed to delete user ${id}:`, err);
      }
    }

    setLoading(false);
    if (deletedCount > 0) {
      setSuccess(`Successfully deleted ${deletedCount} user(s).${failedCount > 0 ? ` Failed to delete ${failedCount}.` : ''}`);
    } else {
      setError(`Failed to delete selected users: ${lastError || 'Unknown error'}`);
    }
    setTimeout(() => { setSuccess(null); setError(null); }, 4000);
    setSelectedIds([]);
    setSelectAll(false);
    fetchUsers();
  };

  // ==================== EDIT HANDLERS ====================

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      gender: user.gender || '',
      position: user.position || '',
      isActive: user.isActive !== undefined ? user.isActive : true
    });
    setEditError(null);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      await api.put(`/users/${editingUser.id}`, editForm);
      setSuccess('User updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) return;

    try {
      await api.delete(`/users/${userId}`);
      setSuccess(`User "${username}" deleted successfully.`);
      setTimeout(() => setSuccess(null), 3000);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      setTimeout(() => setError(null), 3000);
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      Admin: 'danger',
      Employee: 'secondary',
      PayrollOfficer: 'warning',
      FinanceManager: 'success'
    };
    return <Badge bg={colors[role] || 'secondary'}>{role || 'Employee'}</Badge>;
  };

  if (loading && users.length === 0) {
    return (
      <Layout>
        <Container className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </Container>
      </Layout>
    );
  }

  const nonAdminUsers = users.filter(u => u.role !== 'Admin');

  return (
    <Layout>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Employee Management</h2>
          <Button variant="outline-primary" onClick={fetchUsers} disabled={loading}>
            <FaSync className={loading ? 'spin' : ''} /> Refresh
          </Button>
        </div>

        {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}
        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

        {/* Bulk Actions Bar */}
        <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
          <span>
            <strong>{selectedIds.length}</strong> user(s) selected
          </span>
          <Button
            variant="danger"
            size="sm"
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0 || loading}
          >
            <FaTrash className="me-1" /> Delete Selected
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              setSelectedIds([]);
              setSelectAll(false);
            }}
            disabled={selectedIds.length === 0}
          >
            Clear Selection
          </Button>
          <span className="text-muted ms-2">
            <small>Admin users cannot be selected or deleted</small>
          </span>
        </div>

        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <Form.Check
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    disabled={nonAdminUsers.length === 0}
                    title={nonAdminUsers.length === 0 ? 'No non-admin users to select' : 'Select all non-admin users'}
                  />
                </th>
                <th>ID</th>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const isAdmin = user.role === 'Admin';
                const isSelected = selectedIds.includes(user.id);
                return (
                  <tr key={user.id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(user.id)}
                        disabled={isAdmin}
                      />
                    </td>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.position || 'N/A'}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>
                      <Badge bg={user.isActive ? 'success' : 'danger'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-1"
                        onClick={() => handleEditClick(user)}
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(user.id, user.username)}
                        disabled={isAdmin}
                      >
                        <FaTrash /> Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit User: {editingUser?.username}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editError && <Alert variant="danger">{editError}</Alert>}
            <Form onSubmit={handleEditSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  name="firstName"
                  value={editForm.firstName}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  name="lastName"
                  value={editForm.lastName}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={editForm.gender}
                  onChange={handleEditChange}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Position</Form.Label>
                <Form.Control
                  name="position"
                  value={editForm.position}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="isActive"
                  label="Active"
                  checked={editForm.isActive}
                  onChange={handleEditChange}
                />
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
    </Layout>
  );
};

export default EmployeeManagementPage;