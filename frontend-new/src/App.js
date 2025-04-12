/*
 * Main App component
 * Handles user authentication and routing between login/register forms
 * TODO: Add proper routing with react-router
 * TODO: Add protected routes
 */
import React, { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import UserList from './components/UserList'

// Local storage key for user data
const USER_STORAGE_KEY = 'user'

function App() {
  // State hooks
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(true)

  // Load user data from local storage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY)
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          console.log('Loaded user:', userData)
          setUser(userData)
        }
      } catch (err) {
        console.error('Failed to load user data:', err)
        // Clear corrupted data
        localStorage.removeItem(USER_STORAGE_KEY)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Handle successful login
  const handleLoginSuccess = userData => {
    console.log('Login success:', userData)
    setUser(userData)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
  }

  // Handle successful registration
  const handleRegisterSuccess = userData => {
    console.log('Registration success:', userData)
    setUser(userData)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
    setShowLogin(true) // Switch back to login view
  }

  // Handle user logout
  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem(USER_STORAGE_KEY)
  }

  // Show loading spinner while checking auth
  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>CSIT 314 Group Project</h1>
        
        {!user ? (
          // Auth forms container
          <div className="auth-container">
            {/* Login/Register toggle */}
            <div className="auth-toggle">
              <button 
                className={showLogin ? 'active' : ''} 
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
              <button 
                className={!showLogin ? 'active' : ''} 
                onClick={() => setShowLogin(false)}
              >
                Register
              </button>
            </div>

            {/* Show either login or register form */}
            {showLogin ? (
              <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Register onRegisterSuccess={handleRegisterSuccess} />
            )}
          </div>
        ) : (
          // User dashboard
          <div className="user-info">
            <p>Welcome, {user.name} ({user.role})</p>
            {/* Only show user list to admins */}
            {user.role === 'ADMIN' && <UserList />}
            <button 
              onClick={handleLogout} 
              className="logout-button"
            >
              Logout
            </button>
          </div>
        )}
      </header>
    </div>
  )
}

export default App
