import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import auth from '../services/auth';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await auth.register(username, password, email);
      navigate('/login');
    } catch (err) {
      if (err.response?.data) {
        // Handle field-specific errors from the backend
        setErrors(err.response.data);
      } else {
        // Handle generic error
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    }
  };

  return (
    <div className="col-md-6 mx-auto">
      <h2>Register</h2>
      {Object.keys(errors).length > 0 && (
        <Alert variant="danger">
          {Object.entries(errors).map(([field, errorList]) => (
            <div key={field}>
              {Array.isArray(errorList) 
                ? errorList.map((error, index) => (
                    <div key={index}>{field === 'general' ? error : `${field}: ${error}`}</div>
                  ))
                : <div>{field === 'general' ? errorList : `${field}: ${errorList}`}</div>
              }
            </div>
          ))}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            isInvalid={!!errors.username}
          />
          {errors.username && (
            <Form.Control.Feedback type="invalid">
              {Array.isArray(errors.username) ? errors.username[0] : errors.username}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            isInvalid={!!errors.email}
          />
          {errors.email && (
            <Form.Control.Feedback type="invalid">
              {Array.isArray(errors.email) ? errors.email[0] : errors.email}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            isInvalid={!!errors.password}
          />
          {errors.password && (
            <Form.Control.Feedback type="invalid">
              {Array.isArray(errors.password) ? errors.password[0] : errors.password}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </div>
  );
}