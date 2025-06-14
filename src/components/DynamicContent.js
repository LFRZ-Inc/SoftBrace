import React, { useState, useEffect } from 'react'
import { getPageContent } from '../lib/adminContent'

const DynamicContent = ({ 
  page, 
  section, 
  fallbackContent, 
  className = '',
  as = 'div' 
}) => {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const dynamicContent = await getPageContent(page, section)
        setContent(dynamicContent)
      } catch (error) {
        console.error('Error loading dynamic content:', error)
        setContent(null)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [page, section])

  if (loading) {
    // Return fallback content while loading
    return React.createElement(as, { className }, fallbackContent)
  }

  if (content && content.content) {
    // Render dynamic content from database
    return React.createElement(as, {
      className,
      dangerouslySetInnerHTML: { __html: content.content }
    })
  }

  // Fall back to original hardcoded content
  return React.createElement(as, { className }, fallbackContent)
}

export default DynamicContent 