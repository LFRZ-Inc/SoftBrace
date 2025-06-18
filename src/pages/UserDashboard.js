import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  getUserOrders, 
  getUserPoints, 
  getPointsTransactions,
  updateUserProfile,
  getUserAddresses,
  createAddress
} from '../lib/supabase'
import './UserDashboard.css'

const UserDashboard = () => {
  const { user, profile, loadUserProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('orders')
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [points, setPoints] = useState(0)
  const [pointsTransactions, setPointsTransactions] = useState([])
  const [addresses, setAddresses] = useState([])
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || '',
        phone: profile.phone || ''
      })
    }
  }, [profile])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load all dashboard data in parallel
      const [ordersData, pointsData, transactionsData, addressesData] = await Promise.all([
        getUserOrders(user.id),
        getUserPoints(user.id),
        getPointsTransactions(user.id),
        getUserAddresses(user.id)
      ])

      setOrders(ordersData || [])
      setPoints(pointsData || 0)
      setPointsTransactions(transactionsData || [])
      setAddresses(addressesData || [])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setMessage('Error loading dashboard data. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try {
      await updateUserProfile(user.id, profileForm)
      await loadUserProfile(user.id)
      setEditingProfile(false)
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('Error updating profile. Please try again.')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPointsToNextReward = () => {
    const pointsNeeded = 50 - (points % 50)
    return pointsNeeded === 50 ? 0 : pointsNeeded
  }

  const getRewardsEarned = () => {
    return Math.floor(points / 50)
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="mb-6">You need to be signed in to view your dashboard.</p>
        <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark">
          Go to Home
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="user-dashboard">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-gray-600">Welcome back, {profile?.full_name || user.email?.split('@')[0]}!</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {/* Points Summary Card */}
        <div className="points-summary-card">
          <div className="points-info">
            <div className="points-balance">
              <span className="points-number">{points}</span>
              <span className="points-label">Points</span>
            </div>
            <div className="rewards-info">
              <p className="rewards-earned">🎁 {getRewardsEarned()} Free 5-Packs Earned</p>
              {points >= 50 ? (
                <p className="points-ready">🎉 You have {Math.floor(points / 50)} free 5-pack(s) available!</p>
              ) : (
                <p className="points-to-next">
                  {getPointsToNextReward()} points away from your next free 5-pack!
                </p>
              )}
            </div>
          </div>
          <div className="points-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((points % 50) / 50) * 100}%` }}
              ></div>
            </div>
            <p className="progress-text">{points % 50}/50 points to next reward</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            onClick={() => setActiveTab('orders')}
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          >
            🛍️ Order History
          </button>
          <button
            onClick={() => setActiveTab('points')}
            className={`tab-button ${activeTab === 'points' ? 'active' : ''}`}
          >
            🎁 Points & Rewards
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          >
            ⚙️ Account Settings
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`tab-button ${activeTab === 'support' ? 'active' : ''}`}
          >
            🆘 Support
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          
          {/* Order History Tab */}
          {activeTab === 'orders' && (
            <div className="orders-section">
              <h2 className="section-title">Order History</h2>
              {orders.length === 0 ? (
                <div className="empty-state">
                  <p>No orders yet. Start shopping to see your order history!</p>
                  <Link to="/shop" className="cta-button">
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <h3 className="order-number">Order #{order.order_number}</h3>
                          <p className="order-date">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="order-status">
                          <span className={`status-badge ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="order-details">
                        <div className="order-items">
                          {order.order_items?.map((item) => (
                            <div key={item.id} className="order-item">
                              <span className="item-name">{item.product_name}</span>
                              <span className="item-quantity">Qty: {item.quantity}</span>
                              <span className="item-price">{formatCurrency(item.total_price)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="order-summary">
                          <div className="order-total">
                            <strong>Total: {formatCurrency(order.total_amount)}</strong>
                          </div>
                          {order.points_earned > 0 && (
                            <div className="points-earned">
                              <span className="points-badge">+{order.points_earned} points</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Points & Rewards Tab */}
          {activeTab === 'points' && (
            <div className="points-section">
              <h2 className="section-title">Points & Rewards</h2>
              
              <div className="rewards-explanation">
                <h3>How It Works</h3>
                <ul>
                  <li>🛍️ Earn 1 point for every $1 spent</li>
                  <li>🎁 Redeem 50 points for a free 5-Pair Pack</li>
                  <li>⏰ Points expire after 2 years</li>
                  <li>📅 Points reduce by 50% after 1 year of inactivity</li>
                </ul>
              </div>

              <div className="points-transactions">
                <h3>Points History</h3>
                {pointsTransactions.length === 0 ? (
                  <p>No points transactions yet. Make a purchase to start earning points!</p>
                ) : (
                  <div className="transactions-list">
                    {pointsTransactions.map((transaction) => (
                      <div key={transaction.id} className="transaction-item">
                        <div className="transaction-info">
                          <p className="transaction-description">{transaction.description}</p>
                          <p className="transaction-date">{formatDate(transaction.created_at)}</p>
                          {transaction.expires_at && (
                            <p className="transaction-expiry">
                              Expires: {formatDate(transaction.expires_at)}
                            </p>
                          )}
                        </div>
                        <div className={`transaction-points ${transaction.points > 0 ? 'positive' : 'negative'}`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Account Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-section">
              <h2 className="section-title">Account Settings</h2>
              
              <div className="settings-card">
                <h3>Profile Information</h3>
                {editingProfile ? (
                  <form onSubmit={handleProfileUpdate} className="profile-form">
                    <div className="form-group">
                      <label htmlFor="full_name">Full Name</label>
                      <input
                        type="text"
                        id="full_name"
                        value={profileForm.full_name}
                        onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        value={user.email}
                        disabled
                        className="disabled-input"
                      />
                      <small>Email cannot be changed. Contact support if needed.</small>
                    </div>
                    <div className="form-buttons">
                      <button type="submit" className="save-button">Save Changes</button>
                      <button 
                        type="button" 
                        onClick={() => setEditingProfile(false)}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-display">
                    <div className="profile-field">
                      <label>Full Name:</label>
                      <span>{profile?.full_name || 'Not set'}</span>
                    </div>
                    <div className="profile-field">
                      <label>Phone:</label>
                      <span>{profile?.phone || 'Not set'}</span>
                    </div>
                    <div className="profile-field">
                      <label>Email:</label>
                      <span>{user.email}</span>
                    </div>
                    <button 
                      onClick={() => setEditingProfile(true)}
                      className="edit-button"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>

              <div className="settings-card">
                <h3>Shipping Addresses</h3>
                {addresses.length === 0 ? (
                  <p>No saved addresses. Add an address during checkout to save it here.</p>
                ) : (
                  <div className="addresses-list">
                    {addresses.map((address) => (
                      <div key={address.id} className="address-card">
                        <div className="address-info">
                          <p className="address-name">{address.first_name} {address.last_name}</p>
                          <p>{address.address_line_1}</p>
                          {address.address_line_2 && <p>{address.address_line_2}</p>}
                          <p>{address.city}, {address.state} {address.postal_code}</p>
                        </div>
                        {address.is_default && (
                          <span className="default-badge">Default</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Support Tab */}
          {activeTab === 'support' && (
            <div className="support-section">
              <h2 className="section-title">Customer Support</h2>
              
              <div className="support-options">
                <div className="support-card">
                  <h3>📧 Email Support</h3>
                  <p>Get help with your orders, account, or products.</p>
                  <a href="mailto:support@softbracestrips.com" className="support-button">
                    Email Us
                  </a>
                </div>

                <div className="support-card">
                  <h3>📞 Phone Support</h3>
                  <p>Call us for immediate assistance.</p>
                  <a href="tel:+19569992944" className="support-button">
                    (956) 999-2944
                  </a>
                  <small>Monday-Friday: 9 AM - 6 PM CST</small>
                </div>

                <div className="support-card">
                  <h3>💬 Contact Form</h3>
                  <p>Send us a detailed message about your inquiry.</p>
                  <Link to="/contact" className="support-button">
                    Contact Form
                  </Link>
                </div>
              </div>

              <div className="faq-section">
                <h3>Frequently Asked Questions</h3>
                <div className="faq-item">
                  <h4>How do I redeem my points?</h4>
                  <p>Points are automatically applied at checkout when you have 50 or more points. You'll see the option to redeem a free 5-Pair Pack.</p>
                </div>
                <div className="faq-item">
                  <h4>When do my points expire?</h4>
                  <p>Points expire 2 years after they're earned. Points also reduce by 50% if your account is inactive for 1+ years.</p>
                </div>
                <div className="faq-item">
                  <h4>How do I track my order?</h4>
                  <p>Check your order status in the "Order History" tab. You'll receive email updates when your order ships.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard 