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

  const savePageElements = async () => {
    try {
      await updatePageContent('home', 'structure', JSON.stringify(pageElements))
      setHasChanges(false)
      console.log('Page structure saved successfully')
    } catch (error) {
      console.error('Error saving page elements:', error)
      alert('Failed to save changes. Please try again.')
    }
  }

  // Auto-save when changes are made
  useEffect(() => {
    if (hasChanges) {
      const saveTimeout = setTimeout(() => {
        savePageElements()
      }, 2000) // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(saveTimeout)
    }
  }, [hasChanges, pageElements])

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
    setSelectedElement(element.id)
    setEditingElement(element)
  }

  const handleElementUpdate = (elementId, updates) => {
    const updatedElements = pageElements.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    )
    setPageElements(updatedElements)
    setHasChanges(true)
  }

  const handleElementDelete = (elementId) => {
    const filteredElements = pageElements.filter(el => el.id !== elementId)
    // Update positions
    filteredElements.forEach((el, index) => {
      el.position = index
    })
    setPageElements(filteredElements)
    setSelectedElement(null)
    setEditingElement(null)
    setHasChanges(true)
  }

  const handleElementMove = (elementId, direction) => {
    const elementIndex = pageElements.findIndex(el => el.id === elementId)
    if (elementIndex === -1) return

    const newIndex = direction === 'up' ? elementIndex - 1 : elementIndex + 1
    if (newIndex < 0 || newIndex >= pageElements.length) return

    const newElements = [...pageElements]
    const [movedElement] = newElements.splice(elementIndex, 1)
    newElements.splice(newIndex, 0, movedElement)
    
    // Update positions
    newElements.forEach((el, index) => {
      el.position = index
    })

    setPageElements(newElements)
    setHasChanges(true)
  }

  const renderElement = (element) => {
    const isSelected = selectedElement === element.id
    
    return (
      <div
        key={element.id}
        className={`page-element ${isSelected ? 'selected' : ''}`}
        onClick={() => handleElementSelect(element)}
      >
        {/* Element Controls */}
        {isSelected && (
          <div className="element-controls">
            <button onClick={() => handleElementMove(element.id, 'up')} title="Move Up">↑</button>
            <button onClick={() => handleElementMove(element.id, 'down')} title="Move Down">↓</button>
            <button onClick={() => setEditingElement(element)} title="Edit">✏️</button>
            <button onClick={() => handleElementDelete(element.id)} title="Delete">🗑️</button>
          </div>
        )}

        {/* Render element based on type */}
        {renderElementContent(element)}
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
              className={`view-btn ${previewMode === 'mobile' ? 'active' : ''}`}
              title="Mobile View"
            >
              📱
            </button>
          </div>
          
          <button onClick={savePageElements} className="save-btn">
            💾 Save
          </button>
        </div>
      </div>

      <div className="editor-workspace">
        {/* Left Sidebar - Component Library */}
        <div className="editor-sidebar left">
          <div className="sidebar-tabs">
            <button
              onClick={() => { setShowComponentLibrary(true); setShowImageLibrary(false); }}
              className={`tab-btn ${showComponentLibrary ? 'active' : ''}`}
            >
              🧩 Components
            </button>
            <button
              onClick={() => { setShowComponentLibrary(false); setShowImageLibrary(true); }}
              className={`tab-btn ${showImageLibrary ? 'active' : ''}`}
            >
              🖼️ Images
            </button>
          </div>

          {/* Component Library */}
          {showComponentLibrary && (
            <div className="component-library">
              <div className="library-search">
                <input type="text" placeholder="Search components..." />
              </div>
              
              {['Website', 'Hero', 'Features', 'CTA', 'Content', 'Media', 'Layout'].map(category => (
                <div key={category} className="component-category">
                  <h3>{category}</h3>
                  <div className="component-grid">
                    {componentLibrary
                      .filter(comp => comp.category === category)
                      .map(component => (
                        <div
                          key={component.id}
                          className="component-item"
                          draggable
                          onDragStart={(e) => handleComponentDragStart(component, e)}
                          onDragEnd={handleComponentDragEnd}
                        >
                          <div className="component-preview">
                            <span className="component-icon">{component.icon}</span>
                          </div>
                          <span className="component-name">{component.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Image Library */}
          {showImageLibrary && (
            <div className="image-library">
              <div className="library-search">
                <input type="text" placeholder="Search images..." />
              </div>
              
              <div className="image-grid">
                {images.map(image => (
                  <div
                    key={image.id}
                    className="image-item"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('image', JSON.stringify(image))
                    }}
                  >
                    <img src={image.public_url} alt={image.original_name} />
                    <span className="image-name">{image.original_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Canvas */}
        <div className="editor-canvas">
          <div className={`canvas-preview ${getPreviewClass()}`}>
            <div className="page-container">
              {/* Drop zones between elements */}
              <div
                className="drop-zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropZoneDrop(e, 0)}
              >
                Drop components here
              </div>

              {pageElements.map((element, index) => (
                <React.Fragment key={element.id}>
                  {renderElement(element)}
                  <div
                    className="drop-zone"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropZoneDrop(e, index + 1)}
                  >
                    Drop components here
                  </div>
                </React.Fragment>
              ))}

              {pageElements.length === 0 && (
                <div className="empty-canvas">
                  <h3>Start Building Your Page</h3>
                  <p>Drag components from the left sidebar to begin</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Element Properties */}
        <div className="editor-sidebar right">
          <div className="properties-panel">
            {editingElement ? (
              <ElementEditor
                element={editingElement}
                images={images}
                onUpdate={(updates) => handleElementUpdate(editingElement.id, updates)}
                onClose={() => setEditingElement(null)}
              />
            ) : (
              <div className="no-selection">
                <h3>Element Properties</h3>
                <p>Select an element to edit its properties</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Element Editor Component
const ElementEditor = ({ element, images, onUpdate, onClose }) => {
  const [localContent, setLocalContent] = useState(element.content)

  const handleContentChange = (field, value) => {
    const newContent = { ...localContent, [field]: value }
    setLocalContent(newContent)
    onUpdate({ content: newContent })
  }

  const handleNestedContentChange = (parentField, index, field, value) => {
    const newContent = { ...localContent }
    newContent[parentField][index][field] = value
    setLocalContent(newContent)
    onUpdate({ content: newContent })
  }

  return (
    <div className="element-editor">
      <div className="editor-header">
        <h3>Edit {element.type.charAt(0).toUpperCase() + element.type.slice(1)}</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="editor-content">
        {element.type.startsWith('website-') && (
          <div className="live-section-editor">
            <div className="info-box">
              <h4>🔴 Live Website Section</h4>
              <p>This is a live section from your actual website. To edit the content, you'll need to modify the source component files.</p>
              <div className="component-info">
                <strong>Component:</strong> {element.type.replace('website-', '').charAt(0).toUpperCase() + element.type.replace('website-', '').slice(1)}
              </div>
              <div className="edit-instructions">
                <h5>To edit this section:</h5>
                <ol>
                  <li>Go to the "Content Editing" tab in the admin panel</li>
                  <li>Or modify the component files directly in the code</li>
                  <li>Changes will appear here automatically</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {element.type === 'hero' && (
          <>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={localContent.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <textarea
                value={localContent.subtitle || ''}
                onChange={(e) => handleContentChange('subtitle', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Button Text</label>
              <input
                type="text"
                value={localContent.buttonText || ''}
                onChange={(e) => handleContentChange('buttonText', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Button Link</label>
              <input
                type="text"
                value={localContent.buttonLink || ''}
                onChange={(e) => handleContentChange('buttonLink', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Background Color</label>
              <input
                type="color"
                value={localContent.backgroundColor || '#ffffff'}
                onChange={(e) => handleContentChange('backgroundColor', e.target.value)}
              />
            </div>
          </>
        )}

        {element.type === 'text' && (
          <>
            <div className="form-group">
              <label>Text Content</label>
              <textarea
                value={localContent.text || ''}
                onChange={(e) => handleContentChange('text', e.target.value)}
                rows={6}
              />
            </div>
            <div className="form-group">
              <label>Alignment</label>
              <select
                value={localContent.alignment || 'left'}
                onChange={(e) => handleContentChange('alignment', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div className="form-group">
              <label>Font Size</label>
              <select
                value={localContent.fontSize || 'medium'}
                onChange={(e) => handleContentChange('fontSize', e.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </>
        )}

        {element.type === 'image' && (
          <>
            <div className="form-group">
              <label>Select Image</label>
              <select
                value={localContent.image || ''}
                onChange={(e) => handleContentChange('image', e.target.value)}
              >
                <option value="">Select an image...</option>
                {images.map(image => (
                  <option key={image.id} value={image.public_url}>
                    {image.original_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Alt Text</label>
              <input
                type="text"
                value={localContent.alt || ''}
                onChange={(e) => handleContentChange('alt', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Caption</label>
              <input
                type="text"
                value={localContent.caption || ''}
                onChange={(e) => handleContentChange('caption', e.target.value)}
              />
            </div>
          </>
        )}

        {element.type === 'spacer' && (
          <div className="form-group">
            <label>Height</label>
            <input
              type="text"
              value={localContent.height || '60px'}
              onChange={(e) => handleContentChange('height', e.target.value)}
              placeholder="e.g., 60px, 2rem"
            />
          </div>
        )}

        {element.type === 'cta' && (
          <>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={localContent.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <textarea
                value={localContent.subtitle || ''}
                onChange={(e) => handleContentChange('subtitle', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Button Text</label>
              <input
                type="text"
                value={localContent.buttonText || ''}
                onChange={(e) => handleContentChange('buttonText', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Background Color</label>
              <input
                type="color"
                value={localContent.backgroundColor || '#3b82f6'}
                onChange={(e) => handleContentChange('backgroundColor', e.target.value)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VisualEditor 