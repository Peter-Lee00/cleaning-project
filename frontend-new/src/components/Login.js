import React, { useState } from 'react';
import { api } from '../api/config.js';

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'USER'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/api/users/login', formData);
      console.log('Login response:', response.data);
      
      // Create a user object with the response data
      const userData = {
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        role: formData.role // Use the selected role from the form
      };
      
      setSuccess('Login successful!');
      // Store the user info in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      // Update parent component state
      onLoginSuccess(userData);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="USER">User</option>
            <option value="HOME_OWNER">Home Owner</option>
            <option value="CLEANER">Cleaner</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
}

export default Login; 