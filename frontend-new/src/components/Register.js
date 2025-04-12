/*
 * Registration form component
 * Handles user registration with email, password, name, and role selection
 * TODO: Add password confirmation field
 * TODO: Add form validation
 */
import React, { useState } from 'react'
import axios from 'axios'
import './Register.css'

// Supported user roles
const USER_ROLES = {
  USER: 'Regular User',
  HOME_OWNER: 'Home Owner', 
  CLEANER: 'Cleaner'
}

// Initial form state
const INITIAL_FORM_STATE = {
  email: '',
  password: '',
  name: '',
  role: 'USER' // Default role for new users
}

const Register = ({ onRegisterSuccess }) => {
  // State hooks
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form fields
  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Submit registration form
  const handleSubmit = async e => {
    e.preventDefault()
    
    // Don't submit if already processing
    if (isSubmitting) return
    
    setIsSubmitting(true)
    setError('')

    try {
      const res = await axios.post(
        'http://localhost:3001/api/users/register', 
        formData
      )
      
      console.log('Registration successful:', res.data)
      onRegisterSuccess?.(res.data)
      
    } catch (err) {
      console.error('Failed to register:', err)
      setError(
        err.response?.data?.message || 
        'Registration failed. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="register-container">
      <h2>Create New Account</h2>
      
      {/* Show error message if registration failed */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="register-form">
        {/* Email field */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Password field */}
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Choose a password"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Name field */}
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Role selection */}
        <div className="form-group">
          <label htmlFor="role">Account Type:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          >
            {Object.entries(USER_ROLES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          className="register-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  )
}

export default Register 