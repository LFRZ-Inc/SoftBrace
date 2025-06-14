import React, { useState, useEffect } from 'react'
import { 
  adminLogin, 
  isAdminLoggedIn, 
  adminLogout, 
  uploadImage, 
  getUploadedImages, 
  deleteImage,
  getEditablePages,
  getPageContent,
  updatePageContent
} from '../lib/adminContent'

const AdminPage = () => {
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

  useEffect(() => {
    setIsLoggedIn(isAdminLoggedIn())
    if (isAdminLoggedIn()) {
      loadImages()
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    const result = await adminLogin(password)
    
    if (result.success) {
      setIsLoggedIn(true)
      setLoginError('')
      loadImages()
    } else {
      setLoginError(result.error)
    }
  }

  const handleLogout = () => {
    adminLogout()
    setIsLoggedIn(false)
    setPassword('')
  }

  const loadImages = async () => {
    const uploadedImages = await getUploadedImages()
    setImages(uploadedImages)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    setUploadMessage('Uploading image...')

    const result = await uploadImage(file)
    
    if (result.success) {
      setUploadMessage('Image uploaded successfully!')
      loadImages() // Refresh the image list
      e.target.value = '' // Clear the input
    } else {
      setUploadMessage(`Error: ${result.error}`)
    }

    setUploadingImage(false)
    setTimeout(() => setUploadMessage(''), 3000)
  }

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return

    const result = await deleteImage(imageId)
    if (result.success) {
      loadImages() // Refresh the image list
    } else {
      alert(`Error deleting image: ${result.error}`)
    }
  }

  const copyImageUrl = (url) => {
    navigator.clipboard.writeText(url)
    alert('Image URL copied to clipboard!')
  }

  const loadPageContent = async (page, section) => {
    const content = await getPageContent(page, section)
    if (content) {
      setEditingContent(content.content)
      setOriginalContent(content.content)
    } else {
      setEditingContent('')
      setOriginalContent('')
    }
  }

  const handleSaveContent = async () => {
    setSavingContent(true)
    setContentMessage('Saving...')

    try {
      await updatePageContent(selectedPage, selectedSection, editingContent)
      setContentMessage('Content saved successfully!')
      setOriginalContent(editingContent)
    } catch (error) {
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            {loginError && (
              <div className="mb-4 text-red-500 text-sm">{loginError}</div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Login
            </button>
          </form>
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
          <h1 className="text-2xl font-bold text-gray-800">SoftBrace Admin</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('images')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'images' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Image Management
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Content Editing
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage 