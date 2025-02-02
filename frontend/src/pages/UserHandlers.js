import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Alert } from 'react-bootstrap';
import api from '../services/api';

export default function UserHandlers() {
  const [handlers, setHandlers] = useState([]);
  const [newHandler, setNewHandler] = useState({
    handlername: '',
    handlerid: '',
    platform: 'LC',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchHandlers();
  }, []);

  const fetchHandlers = async () => {
    try {
      const response = await api.get('userhandlers/');
      setHandlers(response.data);
    } catch (err) {
      setError('Failed to load handlers');
    }
  };

  const handleDelete = async (handlerId, platform) => {
    try {
      await api.delete('userhandler/', { data: { handlerid: handlerId, platform } });
      fetchHandlers();
      setSuccess('Handler deleted successfully');
    } catch (err) {
      setError('Failed to delete handler');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('userhandlers/', newHandler);
      fetchHandlers();
      setNewHandler({ handlername: '', handlerid: '', platform: 'LC' });
      setSuccess('Handler added successfully');
    } catch (err) {
      setError('Failed to add handler');
    }
  };

  return (
    <div>
      <h2>My Coding Handlers</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Handler Name</Form.Label>
          <Form.Control
            type="text"
            value={newHandler.handlername}
            onChange={(e) => setNewHandler({ ...newHandler, handlername: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Handler ID</Form.Label>
          <Form.Control
            type="text"
            value={newHandler.handlerid}
            onChange={(e) => setNewHandler({ ...newHandler, handlerid: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Platform</Form.Label>
          <Form.Select
            value={newHandler.platform}
            onChange={(e) => setNewHandler({ ...newHandler, platform: e.target.value })}
          >
            <option value="LC">LeetCode</option>
            <option value="GH">GitHub</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit">Add Handler</Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Platform</th>
            <th>Handler ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {handlers.map((handler) => (
            <tr key={`${handler.id}-${handler.platform}`}>
              <td>{handler.handlername}</td>
              <td>{handler.platform === 'LC' ? 'LeetCode' : 'GitHub'}</td>
              <td>{handler.handlerid}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(handler.handlerid, handler.platform)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}