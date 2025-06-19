import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './Auth.css'

const Auth = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { signUp, signIn } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Invalid email or password. Please check your credentials and try again.')
          } else if (error.message.includes('Email not confirmed')) {
            setError('Please check your email and click the confirmation link before signing in.')
          } else {
            setError(error.message)
          }
        } else {
          setMessage('Successfully signed in!')
          setTimeout(() => {
            onClose()
          }, 1000)
        }
      } else {
        const { data, error } = await signUp(email, password, { full_name: fullName })
        if (error) {
          if (error.message.includes('User already registered')) {
            setError('An account with this email already exists. Try signing in instead.')
          } else if (error.message.includes('Password should be at least')) {
            setError('Password must be at least 6 characters long.')
          } else if (error.message.includes('Unable to validate email address')) {
            setError('Please enter a valid email address.')
          } else {
            setError(error.message)
          }
        } else if (data.user) {
          if (data.user.email_confirmed_at) {
            setMessage('Account created successfully! You are now signed in.')
            setTimeout(() => {
              onClose()
            }, 1500)
          } else {
            setMessage('Account created! Please check your email and click the confirmation link to complete your registration.')
          }
        }
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setFullName('')
    setError('')
    setMessage('')
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>×</button>
        
        <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                placeholder="Enter your full name"
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-success">{message}</div>}
          
          <button 
            type="submit" 
            className="auth-submit"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        
        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={switchMode} className="auth-link">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>

        {!isLogin && (
          <div className="auth-benefits">
            <h3>Benefits of Creating an Account:</h3>
            <ul>
              <li>🎯 <strong>5% Automatic Discount</strong> on all orders</li>
              <li>📦 Order history and status</li>
              <li>⚡ Faster checkout process</li>
              <li>📧 Exclusive offers and updates</li>
              <li>🔒 Secure account management</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Auth 