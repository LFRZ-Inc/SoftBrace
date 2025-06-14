import { supabase } from './supabase'

// Admin Activity Logger
// Tracks all admin actions for audit trail and debugging

export const logAdminActivity = async (action, details = {}) => {
  try {
    const logEntry = {
      action_type: action,
      details: details,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      ip_address: null, // Will be populated by database trigger if needed
      session_id: getAdminSessionId()
    }

    console.log('Admin Activity:', logEntry)

    // Insert into database
    const { data, error } = await supabase
      .from('admin_activity_log')
      .insert([logEntry])

    if (error) {
      console.error('Failed to log admin activity:', error)
      // Still continue with the original action even if logging fails
    }

    return { success: !error, data }
  } catch (error) {
    console.error('Exception in admin activity logger:', error)
    return { success: false, error: error.message }
  }
}

// Get current admin session ID for tracking
const getAdminSessionId = () => {
  try {
    const sessionData = localStorage.getItem('softbrace_admin_session')
    if (sessionData) {
      const session = JSON.parse(sessionData)
      return session.sessionId || 'unknown'
    }
    return 'no-session'
  } catch {
    return 'invalid-session'
  }
}

// Specific logging functions for different admin actions

export const logImageUpload = async (imageData) => {
  return await logAdminActivity('IMAGE_UPLOAD', {
    filename: imageData.original_name,
    file_size: imageData.size,
    mime_type: imageData.mime_type,
    public_url: imageData.public_url,
    folder: imageData.folder
  })
}

export const logImageDelete = async (imageData) => {
  return await logAdminActivity('IMAGE_DELETE', {
    image_id: imageData.id,
    filename: imageData.original_name,
    public_url: imageData.public_url
  })
}

export const logContentEdit = async (page, section, oldContent, newContent) => {
  return await logAdminActivity('CONTENT_EDIT', {
    page,
    section,
    content_length_before: oldContent?.length || 0,
    content_length_after: newContent?.length || 0,
    content_preview: newContent.substring(0, 100) + (newContent.length > 100 ? '...' : ''),
    changed_significantly: Math.abs((oldContent?.length || 0) - newContent.length) > 50
  })
}

export const logVisualEditorAction = async (action, details) => {
  return await logAdminActivity('VISUAL_EDITOR', {
    editor_action: action,
    ...details
  })
}

export const logAdminLogin = async () => {
  return await logAdminActivity('ADMIN_LOGIN', {
    login_time: new Date().toISOString(),
    browser: getBrowserInfo()
  })
}

export const logAdminLogout = async () => {
  return await logAdminActivity('ADMIN_LOGOUT', {
    logout_time: new Date().toISOString(),
    session_duration: getSessionDuration()
  })
}

// Helper functions
const getBrowserInfo = () => {
  const ua = navigator.userAgent
  let browser = 'Unknown'
  
  if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Safari')) browser = 'Safari'
  else if (ua.includes('Edge')) browser = 'Edge'
  
  return browser
}

const getSessionDuration = () => {
  try {
    const sessionData = localStorage.getItem('softbrace_admin_session')
    if (sessionData) {
      const session = JSON.parse(sessionData)
      const startTime = session.timestamp
      const duration = Date.now() - startTime
      return Math.round(duration / 1000) // seconds
    }
  } catch {
    return 0
  }
  return 0
}

// Export activity summary function
export const getAdminActivitySummary = async (limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('admin_activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching admin activity:', error)
    return []
  }
}

// Export function to get activity by date range
export const getAdminActivityByDateRange = async (startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from('admin_activity_log')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching admin activity by date:', error)
    return []
  }
}

// Export function to get activity statistics
export const getAdminActivityStats = async () => {
  try {
    const { data, error } = await supabase
      .from('admin_activity_log')
      .select('action_type, created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

    if (error) throw error

    // Process statistics
    const stats = {
      total_actions: data.length,
      actions_by_type: {},
      actions_by_day: {},
      most_active_day: null,
      last_activity: data[0]?.created_at || null
    }

    data.forEach(activity => {
      // Count by type
      stats.actions_by_type[activity.action_type] = (stats.actions_by_type[activity.action_type] || 0) + 1
      
      // Count by day
      const day = activity.created_at.split('T')[0]
      stats.actions_by_day[day] = (stats.actions_by_day[day] || 0) + 1
    })

    // Find most active day
    let maxActions = 0
    Object.entries(stats.actions_by_day).forEach(([day, count]) => {
      if (count > maxActions) {
        maxActions = count
        stats.most_active_day = { date: day, actions: count }
      }
    })

    return stats
  } catch (error) {
    console.error('Error calculating admin activity stats:', error)
    return null
  }
} 