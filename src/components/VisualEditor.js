import React, { useState, useEffect, useRef } from 'react'
import { getUploadedImages, updatePageContent, getPageContent } from '../lib/adminContent'

const VisualEditor = () => {
  const [images, setImages] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [showImagePanel, setShowImagePanel] = useState(true)
  const [draggedImage, setDraggedImage] = useState(null)
  const [dropZones, setDropZones] = useState([])
  const [previewMode, setPreviewMode] = useState('desktop') // desktop, tablet, mobile
  const [isDragging, setIsDragging] = useState(false)
  const [pageContent, setPageContent] = useState({})
  const [hasChanges, setHasChanges] = useState(false)

  const editorRef = useRef(null)

  useEffect(() => {
    loadImages()
    loadPageContent()
  }, [])

  const loadImages = async () => {
    const uploadedImages = await getUploadedImages()
    setImages(uploadedImages)
  }

  const loadPageContent = async () => {
    // Load content for different sections
    const sections = ['hero', 'features', 'how-it-works', 'cta']
    const content = {}
    
    for (const section of sections) {
      const sectionContent = await getPageContent('home', section)
      content[section] = sectionContent?.content || ''
    }
    
    setPageContent(content)
  }

  const handleImageDragStart = (image, e) => {
    setDraggedImage(image)
    setIsDragging(true)
    
    // For touch devices
    if (e.type === 'touchstart') {
      e.preventDefault()
    }
  }

  const handleImageDragEnd = () => {
    setDraggedImage(null)
    setIsDragging(false)
    setDropZones([])
  }

  const handleDropZoneEnter = (zoneId) => {
    if (draggedImage && !dropZones.includes(zoneId)) {
      setDropZones([...dropZones, zoneId])
    }
  }

  const handleDropZoneLeave = (zoneId) => {
    setDropZones(dropZones.filter(id => id !== zoneId))
  }

  const handleImageDrop = async (zoneId, position) => {
    if (!draggedImage) return

    const imageHtml = `<img src="${draggedImage.public_url}" alt="${draggedImage.original_name}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;" class="dropped-image" />`
    
    // Add image to the specified section
    const currentContent = pageContent[zoneId] || ''
    const newContent = position === 'before' 
      ? imageHtml + currentContent 
      : currentContent + imageHtml

    try {
      await updatePageContent('home', zoneId, newContent)
      setPageContent({ ...pageContent, [zoneId]: newContent })
      setHasChanges(true)
      console.log('Image added to section:', zoneId)
    } catch (error) {
      console.error('Error adding image:', error)
      alert('Failed to add image. Please try again.')
    }

    handleImageDragEnd()
  }

  const handleTextEdit = (sectionId, currentText) => {
    setSelectedElement(sectionId)
    setEditingText(currentText)
  }

  const handleTextSave = async (sectionId) => {
    try {
      await updatePageContent('home', sectionId, editingText)
      setPageContent({ ...pageContent, [sectionId]: editingText })
      setSelectedElement(null)
      setEditingText('')
      setHasChanges(true)
      console.log('Text updated for section:', sectionId)
    } catch (error) {
      console.error('Error updating text:', error)
      alert('Failed to save text. Please try again.')
    }
  }

  const handleTextCancel = () => {
    setSelectedElement(null)
    setEditingText('')
  }

  const getPreviewClass = () => {
    switch (previewMode) {
      case 'mobile': return 'preview-mobile'
      case 'tablet': return 'preview-tablet'
      default: return 'preview-desktop'
    }
  }

  return (
    <div className="visual-editor">
      {/* Mobile-friendly header */}
      <div className="visual-editor-header">
        <div className="editor-controls">
          <button
            onClick={() => setShowImagePanel(!showImagePanel)}
            className="toggle-panel-btn"
          >
            📷 Images {showImagePanel ? '▼' : '▶'}
          </button>
          
          <div className="preview-controls">
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`preview-btn ${previewMode === 'mobile' ? 'active' : ''}`}
            >
              📱
            </button>
            <button
              onClick={() => setPreviewMode('tablet')}
              className={`preview-btn ${previewMode === 'tablet' ? 'active' : ''}`}
            >
              📟
            </button>
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`preview-btn ${previewMode === 'desktop' ? 'active' : ''}`}
            >
              🖥️
            </button>
          </div>

          {hasChanges && (
            <div className="changes-indicator">
              ✨ Changes saved automatically
            </div>
          )}
        </div>
      </div>

      <div className="visual-editor-content">
        {/* Image Panel */}
        {showImagePanel && (
          <div className="image-panel">
            <h3>📷 Drag Images to Add</h3>
            <div className="image-grid">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="draggable-image"
                  draggable
                  onDragStart={(e) => handleImageDragStart(image, e)}
                  onDragEnd={handleImageDragEnd}
                  onTouchStart={(e) => handleImageDragStart(image, e)}
                  onTouchEnd={handleImageDragEnd}
                >
                  <img src={image.public_url} alt={image.original_name} />
                  <div className="image-name">{image.original_name}</div>
                </div>
              ))}
              {images.length === 0 && (
                <div className="no-images">
                  No images uploaded yet. Go to Image Management to upload images.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Website Preview */}
        <div className={`website-preview ${getPreviewClass()}`} ref={editorRef}>
          <div className="preview-container">
            
            {/* Hero Section */}
            <section 
              className={`hero-section drop-zone ${dropZones.includes('hero') ? 'drop-active' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={() => handleDropZoneEnter('hero')}
              onDragLeave={() => handleDropZoneLeave('hero')}
              onDrop={() => handleImageDrop('hero', 'after')}
            >
              <div className="section-header">
                <h2>🏠 Hero Section</h2>
                <button 
                  className="edit-btn"
                  onClick={() => handleTextEdit('hero', pageContent.hero || '')}
                >
                  ✏️ Edit
                </button>
              </div>
              
              {selectedElement === 'hero' ? (
                <div className="text-editor">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    placeholder="Enter HTML content for hero section..."
                    rows={6}
                  />
                  <div className="editor-buttons">
                    <button onClick={() => handleTextSave('hero')} className="save-btn">
                      💾 Save
                    </button>
                    <button onClick={handleTextCancel} className="cancel-btn">
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="section-content"
                  dangerouslySetInnerHTML={{ __html: pageContent.hero || '<p>Click Edit to add hero content</p>' }}
                />
              )}
              
              {isDragging && (
                <div className="drop-indicator">
                  Drop image here to add to Hero section
                </div>
              )}
            </section>

            {/* Features Section */}
            <section 
              className={`features-section drop-zone ${dropZones.includes('features') ? 'drop-active' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={() => handleDropZoneEnter('features')}
              onDragLeave={() => handleDropZoneLeave('features')}
              onDrop={() => handleImageDrop('features', 'after')}
            >
              <div className="section-header">
                <h2>⭐ Features Section</h2>
                <button 
                  className="edit-btn"
                  onClick={() => handleTextEdit('features', pageContent.features || '')}
                >
                  ✏️ Edit
                </button>
              </div>
              
              {selectedElement === 'features' ? (
                <div className="text-editor">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    placeholder="Enter HTML content for features section..."
                    rows={6}
                  />
                  <div className="editor-buttons">
                    <button onClick={() => handleTextSave('features')} className="save-btn">
                      💾 Save
                    </button>
                    <button onClick={handleTextCancel} className="cancel-btn">
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="section-content"
                  dangerouslySetInnerHTML={{ __html: pageContent.features || '<p>Click Edit to add features content</p>' }}
                />
              )}
              
              {isDragging && (
                <div className="drop-indicator">
                  Drop image here to add to Features section
                </div>
              )}
            </section>

            {/* How It Works Section */}
            <section 
              className={`how-it-works-section drop-zone ${dropZones.includes('how-it-works') ? 'drop-active' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={() => handleDropZoneEnter('how-it-works')}
              onDragLeave={() => handleDropZoneLeave('how-it-works')}
              onDrop={() => handleImageDrop('how-it-works', 'after')}
            >
              <div className="section-header">
                <h2>🔧 How It Works Section</h2>
                <button 
                  className="edit-btn"
                  onClick={() => handleTextEdit('how-it-works', pageContent['how-it-works'] || '')}
                >
                  ✏️ Edit
                </button>
              </div>
              
              {selectedElement === 'how-it-works' ? (
                <div className="text-editor">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    placeholder="Enter HTML content for how it works section..."
                    rows={6}
                  />
                  <div className="editor-buttons">
                    <button onClick={() => handleTextSave('how-it-works')} className="save-btn">
                      💾 Save
                    </button>
                    <button onClick={handleTextCancel} className="cancel-btn">
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="section-content"
                  dangerouslySetInnerHTML={{ __html: pageContent['how-it-works'] || '<p>Click Edit to add how it works content</p>' }}
                />
              )}
              
              {isDragging && (
                <div className="drop-indicator">
                  Drop image here to add to How It Works section
                </div>
              )}
            </section>

            {/* CTA Section */}
            <section 
              className={`cta-section drop-zone ${dropZones.includes('cta') ? 'drop-active' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={() => handleDropZoneEnter('cta')}
              onDragLeave={() => handleDropZoneLeave('cta')}
              onDrop={() => handleImageDrop('cta', 'after')}
            >
              <div className="section-header">
                <h2>🎯 Call to Action Section</h2>
                <button 
                  className="edit-btn"
                  onClick={() => handleTextEdit('cta', pageContent.cta || '')}
                >
                  ✏️ Edit
                </button>
              </div>
              
              {selectedElement === 'cta' ? (
                <div className="text-editor">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    placeholder="Enter HTML content for CTA section..."
                    rows={6}
                  />
                  <div className="editor-buttons">
                    <button onClick={() => handleTextSave('cta')} className="save-btn">
                      💾 Save
                    </button>
                    <button onClick={handleTextCancel} className="cancel-btn">
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="section-content"
                  dangerouslySetInnerHTML={{ __html: pageContent.cta || '<p>Click Edit to add CTA content</p>' }}
                />
              )}
              
              {isDragging && (
                <div className="drop-indicator">
                  Drop image here to add to CTA section
                </div>
              )}
            </section>

          </div>
        </div>
      </div>

      {/* Mobile Instructions */}
      <div className="mobile-instructions">
        <p>📱 <strong>Mobile Tips:</strong> Tap and hold images to drag • Tap "Edit" to modify text • Use device buttons to switch preview modes</p>
      </div>
    </div>
  )
}

export default VisualEditor 