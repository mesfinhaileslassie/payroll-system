// src/pages/UnauthorizedPage.js
import React from 'react';
import { Container, Alert } from 'react-bootstrap';

const UnauthorizedPage = () => {
  return (
    <Container className="text-center py-5">
      <Alert variant="danger">
        <h3>Access Denied</h3>
        <p>You do not have permission to view this page.</p>
      </Alert>
    </Container>
  );
};

export default UnauthorizedPage;