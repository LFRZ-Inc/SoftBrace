import React, { useState, useEffect, useRef } from 'react'
import { getUploadedImages, updatePageContent, getPageContent } from '../lib/adminContent'
import './VisualEditor.css'

// Import actual website components
import Hero from './Hero'
import Product from './Product'
import Usage from './Usage'
import FAQ from './FAQ'
import Contact from './Contact'

const VisualEditor = () => {
  const [images, setImages] = useState([])
  const [pageElements, setPageElements] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [previewMode, setPreviewMode] = useState('desktop')
  const [isDragging, setIsDragging] = useState(false)
  const [draggedComponent, setDraggedComponent] = useState(null)
  const [showComponentLibrary, setShowComponentLibrary] = useState(true)
  const [showImageLibrary, setShowImageLibrary] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [editingElement, setEditingElement] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState(null)

  const editorRef = useRef(null)
  const dragPreviewRef = useRef(null)

  // Component Library - Pre-built sections
  const componentLibrary = [
    // Live Website Components
    {
      id: 'website-hero',
      name: 'Hero Section (Live)',
      category: 'Website',
      icon: '🏠',
      preview: '/api/placeholder/300/200',
      template: {
        type: 'website-hero',
        style: 'live',
        content: {
          title: 'SoftBrace Hero',
          isLiveSection: true
        }
      }
    },
    {
      id: 'website-product',
      name: 'Product Section (Live)',
      category: 'Website',
      icon: '📦',
      preview: '/api/placeholder/300/200',
      template: {
        type: 'website-product',
        style: 'live',
        content: {
          title: 'Product Section',
          isLiveSection: true
        }
      }
    },
    {
      id: 'website-usage',
      name: 'Usage Section (Live)',
      category: 'Website',
      icon: '📋',
      preview: '/api/placeholder/300/200',
      template: {
        type: 'website-usage',
        style: 'live',
        content: {
          title: 'How to Use',
          isLiveSection: true
        }
      }
    },
    {
      id: 'website-faq',
      name: 'FAQ Section (Live)',
      category: 'Website',
      icon: '❓',
      preview: '/api/placeholder/300/200',
      template: {
        type: 'website-faq',
        style: 'live',
        content: {
          title: 'FAQ Section',
          isLiveSection: true
        }
      }
    },
    {
      id: 'website-contact',
      name: 'Contact Section (Live)',
      category: 'Website',
      icon: '📞',
      preview: '/api/placeholder/300/200',
      template: {
        type: 'website-contact',
        style: 'live',
        content: {
          title: 'Contact Section',
          isLiveSection: true
        }
      }
    },
    {
      id: 'hero-1',
      name: 'Hero Section - Centered',
      category: 'Hero',
      icon: '🎯',
      preview: '/api/placeholder/300/200',
      template: {
        type: 'hero',
        style: 'centered',
        content: {
          title: 'Your Amazing Product',
          subtitle: 'Transform your experience with our innovative solution',
          buttonText: 'Get Started',
          buttonLink: '/shop',
          backgroundImage: '',
          backgroundColor: '#f8fafc'
        }
      }
    },
    {
      id: 'hero-2',
      name: 'Hero Section - Split',
      category: 'Hero',
      icon: '📱',
      preview: '/api/placeholder/300/200',
      template: {
        type: 'hero',
        style: 'split',
        content: {
          title: 'Revolutionary Design',
          subtitle: 'Experience the future of comfort and style',
          buttonText: 'Shop Now',
          buttonLink: '/shop',
          image: '',
          backgroundColor: '#ffffff'
        }
      }
    },
    {
      id: 'features-1',
      name: 'Features Grid - 3 Column',
      category: 'Features',
      icon: '⭐',
      preview: '/api/placeholder/300/200',
      template: {
        type: 'features',
        style: 'grid-3',
        content: {
          title: 'Why Choose Us',
          features: [
            { icon: '🚀', title: 'Fast & Reliable', description: 'Quick delivery and dependable service' },
            { icon: '💎', title: 'Premium Quality', description: 'Only the finest materials and craftsmanship' },
            { icon: '🛡️', title: 'Guaranteed', description: '100% satisfaction guarantee on all products' }
          ]
        }
      }
    },
    {
      id: 'features-2',
      name: 'Features List - Alternating',
      category: 'Features',
      icon: '📋',
      preview: '/api/placeholder/300/200',
      template: {
        type: 'features',
        style: 'alternating',
        content: {
          features: [
            { 
              title: 'Easy to Use', 
              description: 'Simple application process that anyone can master',
              image: '',
              imagePosition: 'left'
            },
            { 
              title: 'Long Lasting', 
              description: 'Durable materials that stand the test of time',
              image: '',
              imagePosition: 'right'
            }
          ]
        }
      }
    },
    {
      id: 'cta-1',
      name: 'Call to Action - Centered',
      category: 'CTA',
      icon: '🎯',
      preview: '/api/placeholder/300/200',
      template: {
        type: 'cta',
        style: 'centered',
        content: {
          title: 'Ready to Get Started?',
          subtitle: 'Join thousands of satisfied customers today',
          buttonText: 'Shop Now',
          buttonLink: '/shop',
          backgroundColor: '#3b82f6',
          textColor: '#ffffff'
        }
      }
    },
    {
      id: 'text-1',
      name: 'Text Block',
      category: 'Content',
      icon: '📝',
      preview: '/api/placeholder/300/200',
      template: {
        type: 'text',
        style: 'default',
        content: {
          text: 'Add your content here. You can format this text and add links, bold text, and more.',
          alignment: 'left',
          fontSize: 'medium'
        }
      }
    },
    {
      id: 'image-1',
      name: 'Image Block',
      category: 'Media',
      icon: '🖼️',
      preview: '/api/placeholder/300/200',
      template: {
        type: 'image',
        style: 'default',
        content: {
          image: '',
          alt: 'Image description',
          caption: '',
          alignment: 'center',
          width: '100%'
        }
      }
    },
    {
      id: 'spacer-1',
      name: 'Spacer',
      category: 'Layout',
      icon: '📏',
      preview: '/api/placeholder/300/200',
      template: {
        type: 'spacer',
        style: 'default',
        content: {
          height: '60px'
        }
      }
    }
  ]

  useEffect(() => {
    loadImages()
    loadPageElements()
  }, [])

  const loadImages = async () => {
    try {
      const uploadedImages = await getUploadedImages()
      setImages(uploadedImages)
    } catch (error) {
      console.error('Error loading images:', error)
    }
  }

  const loadPageElements = async () => {
    try {
      // Load existing page structure
      const pageData = await getPageContent('home', 'structure')
      if (pageData?.content) {
        setPageElements(JSON.parse(pageData.content))
      } else {
        // Load default website structure if no custom structure exists
        setPageElements([
          {
            id: 'hero-section',
            type: 'website-hero',
            position: 0,
            content: {
              title: 'SoftBrace',
              subtitle: 'Comfortable, Invisible Orthodontic Solution',
              buttonText: 'Shop Now',
              buttonLink: '/shop',
              isLiveSection: true
            }
          },
          {
            id: 'product-section',
            type: 'website-product',
            position: 1,
            content: {
              title: 'Our Products',
              isLiveSection: true
            }
          },
          {
            id: 'usage-section',
            type: 'website-usage',
            position: 2,
            content: {
              title: 'How to Use',
              isLiveSection: true
            }
          },
          {
            id: 'faq-section',
            type: 'website-faq',
            position: 3,
            content: {
              title: 'Frequently Asked Questions',
              isLiveSection: true
            }
          }
        ])
      }
    } catch (error) {
      console.error('Error loading page elements:', error)
      // Load default website structure on error
      setPageElements([
        {
          id: 'hero-section',
          type: 'website-hero',
          position: 0,
          content: {
            title: 'SoftBrace',
            subtitle: 'Comfortable, Invisible Orthodontic Solution',
            buttonText: 'Shop Now',
            buttonLink: '/shop',
            isLiveSection: true
          }
        }
      ])
    }
  }

  const handleSave = async () => {
    if (!hasChanges) return
    
    setSaving(true)
    try {
      // Convert the page structure to a JSON string for storage
      const contentToSave = JSON.stringify(pageElements)
      
      console.log('Saving page content:', {
        page: 'visual-editor',
        section: 'page-structure',
        contentLength: contentToSave.length
      })
      
      await updatePageContent('visual-editor', 'page-structure', contentToSave)
      
      setHasChanges(false)
      setSaveMessage('Changes saved successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Save error:', error)
      
      // Provide more specific error messages
      let errorMessage = 'Failed to save changes. '
      
      if (error.message?.includes('relation "page_content" does not exist')) {
        errorMessage += 'Database table not found. Please run the database setup script first.'
      } else if (error.message?.includes('permission denied')) {
        errorMessage += 'Permission denied. Please check your database permissions.'
      } else if (error.message?.includes('network')) {
        errorMessage += 'Network error. Please check your connection and try again.'
      } else {
        errorMessage += `Error: ${error.message || 'Unknown error occurred'}`
      }
      
      setSaveMessage(errorMessage)
      setTimeout(() => setSaveMessage(''), 5000)
    } finally {
      setSaving(false)
    }
  }

  const handleComponentDragStart = (component, e) => {
    setDraggedComponent(component)
    setIsDragging(true)
    
    // Create drag preview
    if (dragPreviewRef.current) {
      dragPreviewRef.current.style.display = 'block'
      dragPreviewRef.current.textContent = component.name
    }
  }

  const handleComponentDragEnd = () => {
    setDraggedComponent(null)
    setIsDragging(false)
    
    if (dragPreviewRef.current) {
      dragPreviewRef.current.style.display = 'none'
    }
  }

  const handleDropZoneDrop = (e, insertIndex) => {
    e.preventDefault()
    
    if (!draggedComponent) return

    // Create new element from component template
    const newElement = {
      id: `element-${Date.now()}`,
      ...draggedComponent.template,
      position: insertIndex
    }

    // Insert element at the specified position
    const newElements = [...pageElements]
    newElements.splice(insertIndex, 0, newElement)
    
    // Update positions
    newElements.forEach((el, index) => {
      el.position = index
    })

    setPageElements(newElements)
    setHasChanges(true)
    handleComponentDragEnd()
  }

  const handleElementSelect = (element) => {
    setSelectedElement(element)
    setEditingElement(null)
  }

  const handleElementUpdate = (elementId, updates) => {
    setPageElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ))
    setHasChanges(true)
  }

  const handleElementDelete = (elementId) => {
    setPageElements(prev => prev.filter(el => el.id !== elementId))
    setSelectedElement(null)
    setEditingElement(null)
    setHasChanges(true)
  }

  const handleElementMove = (elementId, direction) => {
    setPageElements(prev => {
      const currentIndex = prev.findIndex(el => el.id === elementId)
      if (currentIndex === -1) return prev
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev
      
      const newElements = [...prev]
      const [movedElement] = newElements.splice(currentIndex, 1)
      newElements.splice(newIndex, 0, movedElement)
      
      // Update positions
      return newElements.map((el, index) => ({ ...el, position: index }))
    })
    setHasChanges(true)
  }

  // New resize functionality
  const handleResizeStart = (element, handle, e) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeHandle(handle)
    setSelectedElement(element)
    
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = parseInt(element.content.width) || 100
    const startHeight = parseInt(element.content.height) || 100

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      
      let newWidth = startWidth
      let newHeight = startHeight

      if (handle.includes('right')) {
        newWidth = Math.max(50, startWidth + (deltaX / 2)) // Slower resize
      }
      if (handle.includes('left')) {
        newWidth = Math.max(50, startWidth - (deltaX / 2))
      }
      if (handle.includes('bottom')) {
        newHeight = Math.max(30, startHeight + (deltaY / 2))
      }
      if (handle.includes('top')) {
        newHeight = Math.max(30, startHeight - (deltaY / 2))
      }

      // Update element with new dimensions
      const updates = {
        content: {
          ...element.content,
          width: `${Math.round(newWidth)}%`,
          height: element.type === 'spacer' ? `${Math.round(newHeight)}px` : element.content.height
        }
      }

      handleElementUpdate(element.id, updates)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeHandle(null)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Alignment controls
  const handleAlignmentChange = (elementId, alignment) => {
    const element = pageElements.find(el => el.id === elementId)
    if (element) {
      const updates = {
        content: {
          ...element.content,
          alignment: alignment
        }
      }
      handleElementUpdate(elementId, updates)
    }
  }

  const renderElement = (element) => {
    const isSelected = selectedElement?.id === element.id
    
    return (
      <div 
        key={element.id}
        className={`page-element ${isSelected ? 'selected' : ''}`}
        onClick={() => handleElementSelect(element)}
      >
        {/* Element Controls */}
        {isSelected && (
          <div className="element-controls">
            {/* Alignment Controls */}
            <div className="alignment-controls">
              <button
                onClick={() => handleAlignmentChange(element.id, 'left')}
                className={element.content.alignment === 'left' ? 'active' : ''}
                title="Align Left"
              >
                ⬅️
              </button>
              <button
                onClick={() => handleAlignmentChange(element.id, 'center')}
                className={element.content.alignment === 'center' ? 'active' : ''}
                title="Align Center"
              >
                ↔️
              </button>
              <button
                onClick={() => handleAlignmentChange(element.id, 'right')}
                className={element.content.alignment === 'right' ? 'active' : ''}
                title="Align Right"
              >
                ➡️
              </button>
            </div>

            {/* Action Controls */}
            <div className="action-controls">
              <button onClick={() => handleElementMove(element.id, 'up')} title="Move Up">
                ⬆️
              </button>
              <button onClick={() => handleElementMove(element.id, 'down')} title="Move Down">
                ⬇️
              </button>
              <button onClick={() => setEditingElement(element)} title="Edit">
                ✏️
              </button>
              <button onClick={() => handleElementDelete(element.id)} title="Delete">
                🗑️
              </button>
            </div>
          </div>
        )}

        {/* Resize Handles for resizable elements */}
        {isSelected && (element.type === 'image' || element.type === 'spacer') && (
          <div className="resize-handles">
            <div 
              className="resize-handle top-left"
              onMouseDown={(e) => handleResizeStart(element, 'top-left', e)}
            />
            <div 
              className="resize-handle top-right"
              onMouseDown={(e) => handleResizeStart(element, 'top-right', e)}
            />
            <div 
              className="resize-handle bottom-left"
              onMouseDown={(e) => handleResizeStart(element, 'bottom-left', e)}
            />
            <div 
              className="resize-handle bottom-right"
              onMouseDown={(e) => handleResizeStart(element, 'bottom-right', e)}
            />
            <div 
              className="resize-handle left"
              onMouseDown={(e) => handleResizeStart(element, 'left', e)}
            />
            <div 
              className="resize-handle right"
              onMouseDown={(e) => handleResizeStart(element, 'right', e)}
            />
            <div 
              className="resize-handle top"
              onMouseDown={(e) => handleResizeStart(element, 'top', e)}
            />
            <div 
              className="resize-handle bottom"
              onMouseDown={(e) => handleResizeStart(element, 'bottom', e)}
            />
          </div>
        )}

        {/* Element Content */}
        <div className="element-content">
          {renderElementContent(element)}
        </div>
      </div>
    )
  }

  const renderElementContent = (element) => {
    switch (element.type) {
      case 'website-hero':
        return <div className="live-component-wrapper"><Hero /></div>
      case 'website-product':
        return <div className="live-component-wrapper"><Product /></div>
      case 'website-usage':
        return <div className="live-component-wrapper"><Usage /></div>
      case 'website-faq':
        return <div className="live-component-wrapper"><FAQ /></div>
      case 'website-contact':
        return <div className="live-component-wrapper"><Contact /></div>
      case 'hero':
        return renderHeroElement(element)
      case 'features':
        return renderFeaturesElement(element)
      case 'cta':
        return renderCTAElement(element)
      case 'text':
        return renderTextElement(element)
      case 'image':
        return renderImageElement(element)
      case 'spacer':
        return renderSpacerElement(element)
      default:
        return <div className="unknown-element">Unknown element type: {element.type}</div>
    }
  }

  const renderHeroElement = (element) => {
    const { content, style } = element
    
    if (style === 'centered') {
      return (
        <section className="hero-section centered" style={{ backgroundColor: content.backgroundColor }}>
          <div className="hero-content">
            <h1>{content.title}</h1>
            <p>{content.subtitle}</p>
            <button className="hero-button">{content.buttonText}</button>
          </div>
        </section>
      )
    } else if (style === 'split') {
      return (
        <section className="hero-section split" style={{ backgroundColor: content.backgroundColor }}>
          <div className="hero-content">
            <div className="hero-text">
              <h1>{content.title}</h1>
              <p>{content.subtitle}</p>
              <button className="hero-button">{content.buttonText}</button>
            </div>
            <div className="hero-image">
              {content.image ? (
                <img src={content.image} alt={content.title} />
              ) : (
                <div className="image-placeholder">Image Placeholder</div>
              )}
            </div>
          </div>
        </section>
      )
    }
  }

  const renderFeaturesElement = (element) => {
    const { content, style } = element
    
    if (style === 'grid-3') {
      return (
        <section className="features-section grid-3">
          <div className="features-content">
            <h2>{content.title}</h2>
            <div className="features-grid">
              {content.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    } else if (style === 'alternating') {
      return (
        <section className="features-section alternating">
          {content.features.map((feature, index) => (
            <div key={index} className={`feature-row ${feature.imagePosition}`}>
              <div className="feature-text">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
              <div className="feature-image">
                {feature.image ? (
                  <img src={feature.image} alt={feature.title} />
                ) : (
                  <div className="image-placeholder">Image Placeholder</div>
                )}
              </div>
            </div>
          ))}
        </section>
      )
    }
  }

  const renderCTAElement = (element) => {
    const { content } = element
    
    return (
      <section 
        className="cta-section" 
        style={{ 
          backgroundColor: content.backgroundColor,
          color: content.textColor 
        }}
      >
        <div className="cta-content">
          <h2>{content.title}</h2>
          <p>{content.subtitle}</p>
          <button className="cta-button">{content.buttonText}</button>
        </div>
      </section>
    )
  }

  const renderTextElement = (element) => {
    const { content } = element
    
    return (
      <div 
        className="text-element" 
        style={{ 
          textAlign: content.alignment,
          fontSize: content.fontSize === 'small' ? '14px' : content.fontSize === 'large' ? '18px' : '16px'
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: content.text }} />
      </div>
    )
  }

  const renderImageElement = (element) => {
    const { content } = element
    
    return (
      <div className="image-element" style={{ textAlign: content.alignment }}>
        {content.image ? (
          <img 
            src={content.image} 
            alt={content.alt}
            style={{ width: content.width }}
          />
        ) : (
          <div className="image-placeholder" style={{ width: content.width }}>
            Click to add image
          </div>
        )}
        {content.caption && <p className="image-caption">{content.caption}</p>}
      </div>
    )
  }

  const renderSpacerElement = (element) => {
    const { content } = element
    
    return (
      <div 
        className="spacer-element" 
        style={{ height: content.height }}
      />
    )
  }

  const getPreviewClass = () => {
    switch (previewMode) {
      case 'mobile': return 'preview-mobile'
      case 'tablet': return 'preview-tablet'
      default: return 'preview-desktop'
    }
  }

  return (
    <div className="visual-editor-v2">
      {/* Drag Preview */}
      <div ref={dragPreviewRef} className="drag-preview" style={{ display: 'none' }}>
        Component Preview
      </div>

      {/* Header */}
      <div className="editor-header">
        <div className="editor-title">
          <h2>Visual Page Builder</h2>
          {hasChanges && <span className="changes-indicator">● Saving...</span>}
        </div>
        
        <div className="editor-controls">
          <div className="view-controls">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`view-btn ${previewMode === 'desktop' ? 'active' : ''}`}
              title="Desktop View"
            >
              🖥️
            </button>
            <button
              onClick={() => setPreviewMode('tablet')}
              className={`view-btn ${previewMode === 'tablet' ? 'active' : ''}`}
              title="Tablet View"
            >
              📱
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`view-btn ${previewMode === 'mobile' ? 'active' : ''}`