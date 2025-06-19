import React, { useState, useEffect } from 'react'
import { 
  uploadImage, 
  getUploadedImages, 
  deleteImage,
  getEditablePages,
  getPageContent,
  updatePageContent
} from '../lib/adminContent'
import {
  getAllReviews,
  approveReview,
  deleteReview,
  getAllSupportMessages,
  updateSupportMessageStatus
} from '../lib/supabase'
import { 
  logAdminLogin, 
  logAdminLogout, 
  logImageUpload, 
  logImageDelete, 
  logContentEdit,
  getAdminActivitySummary,
  getAdminActivityStats
} from '../lib/adminActivityLogger'
import VisualEditor from '../components/VisualEditor'
import '../components/VisualEditor.css'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// Independent admin authentication - completely separate from customer auth
const ADMIN_PASSWORD = 'SoftBrace2024Admin'
const ADMIN_SESSION_KEY = 'softbrace_admin_session'
const SESSION_DURATION = 8 * 60 * 60 * 1000 // 8 hours in milliseconds

// Admin authentication functions - independent of customer auth
const adminAuth = {
  login: (password) => {
    if (password === ADMIN_PASSWORD) {
      const sessionData = {
        loggedIn: true,
        timestamp: Date.now(),
        sessionId: 'admin-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
      }
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData))
      return { success: true }
    }
    return { success: false, error: 'Invalid admin password' }
  },

  isLoggedIn: () => {
    try {
      const sessionData = localStorage.getItem(ADMIN_SESSION_KEY)
      if (!sessionData) return false

      const session = JSON.parse(sessionData)
      const now = Date.now()
      
      // Check if session has expired
      if (now - session.timestamp > SESSION_DURATION) {
        localStorage.removeItem(ADMIN_SESSION_KEY)
        return false
      }

      return session.loggedIn === true
    } catch (error) {
      console.error('Error checking admin session:', error)
      localStorage.removeItem(ADMIN_SESSION_KEY)
      return false
    }
  },

  logout: () => {
    localStorage.removeItem(ADMIN_SESSION_KEY)
  },

  refreshSession: () => {
    if (adminAuth.isLoggedIn()) {
      const existingSession = JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY) || '{}')
      const sessionData = {
        loggedIn: true,
        timestamp: Date.now(),
        sessionId: existingSession.sessionId || 'admin-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
      }
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData))
    }
  }
}

const AdminPage = () => {
  const { user } = useAuth()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState('images')
  
  // Image management state
  const [images, setImages] = useState([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  
  // Content editing state
  const [selectedPage, setSelectedPage] = useState('home')
  const [selectedSection, setSelectedSection] = useState('hero')
  const [editingContent, setEditingContent] = useState('')
  const [originalContent, setOriginalContent] = useState('')
  const [savingContent, setSavingContent] = useState(false)
  const [contentMessage, setContentMessage] = useState('')

  // Activity tracking state
  const [activityLog, setActivityLog] = useState([])
  const [activityStats, setActivityStats] = useState(null)
  const [loadingActivity, setLoadingActivity] = useState(false)

  // Reviews management state
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(false)

  // Support messages state
  const [supportMessages, setSupportMessages] = useState([])
  const [loadingSupportMessages, setLoadingSupportMessages] = useState(false)

  // Orders management state
  const [adminContent, setAdminContent] = useState([])
  const [pendingOrders, setPendingOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check admin session on component mount
  useEffect(() => {
    console.log('AdminPage: Checking admin session...')
    const loggedIn = adminAuth.isLoggedIn()
    console.log('AdminPage: Admin logged in?', loggedIn)
    setIsLoggedIn(loggedIn)
    
    if (loggedIn) {
      console.log('AdminPage: Loading admin data...')
      loadImages()
      // Refresh session timestamp
      adminAuth.refreshSession()
    }
  }, [])

  // Session refresh timer
  useEffect(() => {
    if (isLoggedIn) {
      const refreshInterval = setInterval(() => {
        if (adminAuth.isLoggedIn()) {
          adminAuth.refreshSession()
        } else {
          // Session expired
          setIsLoggedIn(false)
          setLoginError('Admin session expired. Please login again.')
        }
      }, 5 * 60 * 1000) // Check every 5 minutes

      return () => clearInterval(refreshInterval)
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (user) {
      fetchAdminContent()
      fetchPendingOrders()
    }
  }, [user])

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log('AdminPage: Attempting admin login...')
    
    const result = adminAuth.login(password)
    
    if (result.success) {
      console.log('AdminPage: Admin login successful')
      setIsLoggedIn(true)
      setLoginError('')
      setPassword('')
      loadImages()
      loadActivityData()
      // Log the admin login
      logAdminLogin()
    } else {
      console.log('AdminPage: Admin login failed:', result.error)
      setLoginError(result.error)
    }
  }

  const handleLogout = () => {
    console.log('AdminPage: Admin logout')
    // Log the admin logout before clearing session
    logAdminLogout()
    adminAuth.logout()
    setIsLoggedIn(false)
    setPassword('')
    setImages([])
    setEditingContent('')
    setOriginalContent('')
    setActivityLog([])
    setActivityStats(null)
  }

  const loadImages = async () => {
    console.log('AdminPage: Loading images...')
    const uploadedImages = await getUploadedImages()
    console.log('AdminPage: Loaded images:', uploadedImages.length)
    setImages(uploadedImages)
  }

  const loadActivityData = async () => {
    setLoadingActivity(true)
    try {
      const [recentActivity, stats] = await Promise.all([
        getAdminActivitySummary(20),
        getAdminActivityStats()
      ])
      setActivityLog(recentActivity)
      setActivityStats(stats)
    } catch (error) {
      console.error('Failed to load activity data:', error)
    }
    setLoadingActivity(false)
  }

  const loadReviews = async () => {
    setLoadingReviews(true)
    try {
      const reviewsData = await getAllReviews()
      setReviews(reviewsData)
    } catch (error) {
      console.error('Failed to load reviews:', error)
    }
    setLoadingReviews(false)
  }

  const loadSupportMessages = async () => {
    setLoadingSupportMessages(true)
    try {
      const messagesData = await getAllSupportMessages()
      setSupportMessages(messagesData)
    } catch (error) {
      console.error('Failed to load support messages:', error)
    }
    setLoadingSupportMessages(false)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    console.log('AdminPage: Uploading image:', file.name)
    setUploadingImage(true)
    setUploadMessage('Uploading image...')

    const result = await uploadImage(file)
    
    if (result.success) {
      console.log('AdminPage: Image upload successful')
      setUploadMessage('Image uploaded successfully!')
      loadImages() // Refresh the image list
      e.target.value = '' // Clear the input
      // Log the image upload
      logImageUpload(result.record)
      loadActivityData() // Refresh activity log
    } else {
      console.error('AdminPage: Image upload failed:', result.error)
      setUploadMessage(`Error: ${result.error}`)
    }

    setUploadingImage(false)
    setTimeout(() => setUploadMessage(''), 3000)
  }

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return

    // Find the image data before deletion for logging
    const imageToDelete = images.find(img => img.id === imageId)
    
    console.log('AdminPage: Deleting image:', imageId)
    const result = await deleteImage(imageId)
    if (result.success) {
      console.log('AdminPage: Image deleted successfully')
      loadImages() // Refresh the image list
      // Log the image deletion
      if (imageToDelete) {
        logImageDelete(imageToDelete)
        loadActivityData() // Refresh activity log
      }
    } else {
      console.error('AdminPage: Image deletion failed:', result.error)
      alert(`Error deleting image: ${result.error}`)
    }
  }

  const copyImageUrl = (url) => {
    navigator.clipboard.writeText(url)
    alert('Image URL copied to clipboard!')
  }

  const loadPageContent = async (page, section) => {
    console.log('AdminPage: Loading page content:', page, section)
    const content = await getPageContent(page, section)
    if (content) {
      setEditingContent(content.content)
      setOriginalContent(content.content)
    } else {
      setEditingContent('')
      setOriginalContent('')
    }
  }

  const handleApproveReview = async (reviewId) => {
    try {
      await approveReview(reviewId)
      await loadReviews() // Reload reviews
      alert('Review approved successfully!')
    } catch (error) {
      console.error('Failed to approve review:', error)
      alert('Failed to approve review')
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId)
        await loadReviews() // Reload reviews
        alert('Review deleted successfully!')
      } catch (error) {
        console.error('Failed to delete review:', error)
        alert('Failed to delete review')
      }
    }
  }

  const handleUpdateSupportStatus = async (messageId, newStatus) => {
    try {
      await updateSupportMessageStatus(messageId, newStatus)
      await loadSupportMessages() // Reload messages
      alert('Support message status updated!')
    } catch (error) {
      console.error('Failed to update support message status:', error)
      alert('Failed to update status')
    }
  }

  const handleSaveContent = async () => {
    console.log('AdminPage: Saving content...')
    setSavingContent(true)
    setContentMessage('Saving...')

    try {
      await updatePageContent(selectedPage, selectedSection, editingContent)
      console.log('AdminPage: Content saved successfully')
      setContentMessage('Content saved successfully!')
      // Log the content edit
      logContentEdit(selectedPage, selectedSection, originalContent, editingContent)
      setOriginalContent(editingContent)
      loadActivityData() // Refresh activity log
    } catch (error) {
      console.error('AdminPage: Content save failed:', error)
      setContentMessage(`Error: ${error.message}`)
    }

    setSavingContent(false)
    setTimeout(() => setContentMessage(''), 3000)
  }

  useEffect(() => {
    if (isLoggedIn) {
      loadPageContent(selectedPage, selectedSection)
    }
  }, [selectedPage, selectedSection, isLoggedIn])

  const fetchAdminContent = async () => {
    // ... existing admin content code ...
  }

  const fetchPendingOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total_amount,
          verification_status,
          fulfillment_status,
          requires_manual_review,
          review_reason,
          created_at,
          user_id,
          profiles (first_name, last_name, email)
        `)
        .eq('requires_manual_review', true)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setPendingOrders(data || [])
    } catch (err) {
      console.error('Error fetching pending orders:', err)
    }
  }

  const updateOrderStatus = async (orderId, verificationStatus, fulfillmentStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          verification_status: verificationStatus,
          fulfillment_status: fulfillmentStatus,
          requires_manual_review: verificationStatus === 'verified' ? false : true,
          verified_by: user.id,
          verified_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) throw error
      
      // Refresh pending orders
      fetchPendingOrders()
      alert('Order status updated successfully!')
    } catch (err) {
      console.error('Error updating order status:', err)
      alert('Failed to update order status')
    }
  }

  // Login screen - completely independent from customer auth
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
            SoftBrace Admin Portal
          </h1>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> This is a separate admin login, independent from customer accounts.
            </p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter admin password"
                required
              />
            </div>
            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-700 text-sm">{loginError}</div>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Login to Admin Portal
            </button>
          </form>
          <div className="mt-4 text-center">
            <a 
              href="/" 
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              ← Back to Main Site
            </a>
          </div>
        </div>
      </div>
    )
  }

  const editablePages = getEditablePages()
  const currentPage = editablePages.find(p => p.id === selectedPage)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">SoftBrace Admin Portal</h1>
            <p className="text-sm text-gray-600">Content & Image Management System</p>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              View Main Site
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('images')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'images' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📷 Image Management
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'content' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ✏️ Content Editing
              </button>
              <button
                onClick={() => setActiveTab('visual')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'visual' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🎨 Visual Editor
              </button>
              <button
                onClick={() => { setActiveTab('reviews'); loadReviews(); }}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'reviews' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ⭐ Reviews
              </button>
              <button
                onClick={() => { setActiveTab('support'); loadSupportMessages(); }}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'support' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                💬 Support
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'activity' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Activity Log
              </button>
            </nav>
          </div>
        </div>

        {/* Image Management Tab */}
        {activeTab === 'images' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Image Management</h2>
            
            {/* Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4">Upload New Image</h3>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploadingImage && (
                  <div className="text-blue-500">Uploading...</div>
                )}
              </div>
              {uploadMessage && (
                <div className={`mt-2 text-sm ${uploadMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                  {uploadMessage}
                </div>
              )}
            </div>

            {/* Images Grid */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Uploaded Images</h3>
              {images.length === 0 ? (
                <p className="text-gray-500">No images uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="border rounded-lg p-4">
                      <img
                        src={image.public_url}
                        alt={image.original_name}
                        className="w-full h-48 object-cover rounded-lg mb-2"
                      />
                      <p className="text-sm font-medium truncate">{image.original_name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(image.created_at).toLocaleDateString()}
                      </p>
                      <div className="mt-2 flex space-x-2">
                        <button
                          onClick={() => copyImageUrl(image.public_url)}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          Copy URL
                        </button>
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Editing Tab */}
        {activeTab === 'content' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Content Editing</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {/* Page and Section Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Page</label>
                  <select
                    value={selectedPage}
                    onChange={(e) => setSelectedPage(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {editablePages.map(page => (
                      <option key={page.id} value={page.id}>{page.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Select Section</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {currentPage?.sections.map(section => (
                      <option key={section} value={section}>
                        {section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Content Editor */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Edit Content for {currentPage?.name} - {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1).replace('-', ' ')}
                </label>
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm"
                  placeholder="Enter your content here. You can use HTML tags for formatting."
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;img&gt;, etc.
                </p>
              </div>

              {/* Save Button */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSaveContent}
                  disabled={savingContent || editingContent === originalContent}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {savingContent ? 'Saving...' : 'Save Changes'}
                </button>
                
                {editingContent !== originalContent && (
                  <span className="text-orange-500 text-sm">You have unsaved changes</span>
                )}
              </div>

              {contentMessage && (
                <div className={`mt-2 text-sm ${contentMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                  {contentMessage}
                </div>
              )}

              {/* Preview Note */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Changes will be visible immediately on the website after saving. 
                  Open the main site in a new tab to see your changes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Visual Editor Tab */}
        {activeTab === 'visual' && (
          <div className="visual-editor-container">
            <VisualEditor />
          </div>
        )}

        {/* Reviews Management Tab */}
        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Product Reviews Management</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">All Reviews</h3>
                <button
                  onClick={loadReviews}
                  disabled={loadingReviews}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:bg-gray-300"
                >
                  {loadingReviews ? 'Loading...' : 'Refresh'}
                </button>
              </div>
              
              {loadingReviews ? (
                <div className="text-center py-8 text-gray-500">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No reviews submitted yet.</div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {reviews.map((review) => (
                    <div key={review.id} className={`border rounded-lg p-4 ${review.is_approved ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className={`text-lg ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="font-medium">{review.user_name}</span>
                            <span className={`px-2 py-1 rounded text-xs ${review.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {review.is_approved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Product ID: {review.product_id}</p>
                          <p className="text-sm text-gray-600 mb-2">Email: {review.user_email}</p>
                          {review.review_text && (
                            <p className="text-gray-800 mb-2">{review.review_text}</p>
                          )}
                          <p className="text-xs text-gray-500">
                            Submitted: {new Date(review.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          {!review.is_approved && (
                            <button
                              onClick={() => handleApproveReview(review.id)}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                            >
                              ✅ Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Support Messages Tab */}
        {activeTab === 'support' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Support Messages Management</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">All Support Messages</h3>
                <button
                  onClick={loadSupportMessages}
                  disabled={loadingSupportMessages}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:bg-gray-300"
                >
                  {loadingSupportMessages ? 'Loading...' : 'Refresh'}
                </button>
              </div>
              
              {loadingSupportMessages ? (
                <div className="text-center py-8 text-gray-500">Loading support messages...</div>
              ) : supportMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No support messages yet.</div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {supportMessages.map((message) => (
                    <div key={message.id} className={`border rounded-lg p-4 ${
                      message.status === 'resolved' ? 'border-green-200 bg-green-50' : 
                      message.status === 'in_progress' ? 'border-blue-200 bg-blue-50' : 
                      'border-yellow-200 bg-yellow-50'
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{message.name}</span>
                            <span className="text-sm text-gray-600">({message.email})</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              message.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              message.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {message.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Type: {message.inquiry_type} • Subject: {message.subject || 'No subject'}
                          </p>
                          <p className="text-gray-800 mb-2">{message.message}</p>
                          <p className="text-xs text-gray-500">
                            Submitted: {new Date(message.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <select
                            value={message.status}
                            onChange={(e) => handleUpdateSupportStatus(message.id, e.target.value)}
                            className="text-xs border rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                          <a
                            href={`mailto:${message.email}?subject=Re: ${message.subject || 'Support Request'}&body=Hi ${message.name},%0D%0A%0D%0AThanks for reaching out to SoftBrace!%0D%0A%0D%0A`}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 text-center"
                          >
                            📧 Reply
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activity Log Tab */}
        {activeTab === 'activity' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Admin Activity Log</h2>
            
            {/* Activity Statistics */}
            {activityStats && (
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h3 className="text-lg font-semibold mb-4">Activity Statistics (Last 30 Days)</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{activityStats.total_actions}</div>
                    <div className="text-sm text-gray-500">Total Actions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {activityStats.actions_by_type.IMAGE_UPLOAD || 0}
                    </div>
                    <div className="text-sm text-gray-500">Images Uploaded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {activityStats.actions_by_type.CONTENT_EDIT || 0}
                    </div>
                    <div className="text-sm text-gray-500">Content Edits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {activityStats.most_active_day?.actions || 0}
                    </div>
                    <div className="text-sm text-gray-500">Most Active Day</div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <button
                  onClick={loadActivityData}
                  disabled={loadingActivity}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:bg-gray-300"
                >
                  {loadingActivity ? 'Loading...' : 'Refresh'}
                </button>
              </div>
              
              {loadingActivity ? (
                <div className="text-center py-8 text-gray-500">Loading activity log...</div>
              ) : activityLog.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No activity recorded yet.</div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {activityLog.map((activity) => (
                    <div key={activity.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">
                            {getActivityIcon(activity.action_type)} {getActivityDescription(activity)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {new Date(activity.created_at).toLocaleString()}
                          </div>
                          {activity.details && Object.keys(activity.details).length > 0 && (
                            <div className="text-xs text-gray-400 mt-1">
                              {JSON.stringify(activity.details, null, 2).substring(0, 100)}...
                            </div>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${getActivityBadgeColor(activity.action_type)}`}>
                          {activity.action_type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Requiring Review Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">📋 Orders Requiring Review</h2>
          
          {pendingOrders.length === 0 ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-800 dark:text-green-200">✅ No orders currently require review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <div key={order.id} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{order.order_number}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Customer: {order.profiles?.first_name} {order.profiles?.last_name} ({order.profiles?.email})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.total_amount}</p>
                      <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Review Reason:</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">{order.review_reason}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateOrderStatus(order.id, 'verified', 'processing')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                    >
                      ✅ Approve & Process
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'rejected', 'cancelled')}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                    >
                      ❌ Reject Order
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'needs_review', 'pending')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                    >
                      🔄 Keep in Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // Helper functions for activity display
  const getActivityIcon = (actionType) => {
    switch (actionType) {
      case 'IMAGE_UPLOAD': return '📷'
      case 'IMAGE_DELETE': return '🗑️'
      case 'CONTENT_EDIT': return '✏️'
      case 'VISUAL_EDITOR': return '🎨'
      case 'ADMIN_LOGIN': return '🔐'
      case 'ADMIN_LOGOUT': return '👋'
      default: return '📝'
    }
  }

  const getActivityDescription = (activity) => {
    switch (activity.action_type) {
      case 'IMAGE_UPLOAD':
        return `Uploaded image: ${activity.details?.filename || 'Unknown'}`
      case 'IMAGE_DELETE':
        return `Deleted image: ${activity.details?.filename || 'Unknown'}`
      case 'CONTENT_EDIT':
        return `Edited ${activity.details?.page}/${activity.details?.section} content`
      case 'VISUAL_EDITOR':
        return `Visual editor action: ${activity.details?.editor_action || 'Unknown'}`
      case 'ADMIN_LOGIN':
        return `Admin logged in via ${activity.details?.browser || 'Unknown browser'}`
      case 'ADMIN_LOGOUT':
        return `Admin logged out (session: ${activity.details?.session_duration || 0}s)`
      default:
        return `${activity.action_type} action performed`
    }
  }

  const getActivityBadgeColor = (actionType) => {
    switch (actionType) {
      case 'IMAGE_UPLOAD': return 'bg-green-100 text-green-800'
      case 'IMAGE_DELETE': return 'bg-red-100 text-red-800'
      case 'CONTENT_EDIT': return 'bg-blue-100 text-blue-800'
      case 'VISUAL_EDITOR': return 'bg-purple-100 text-purple-800'
      case 'ADMIN_LOGIN': return 'bg-gray-100 text-gray-800'
      case 'ADMIN_LOGOUT': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
}

export default AdminPage