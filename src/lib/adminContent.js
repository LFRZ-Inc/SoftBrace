import { supabase } from './supabase'

// Note: Admin authentication is now handled directly in AdminPage.js
// for better separation from customer authentication

// Content management functions
export const getPageContent = async (page, section) => {
  try {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page', page)
      .eq('section', section)
      .single()

    if (error) {
      // If no content found, return null (use default/hardcoded content)
      if (error.code === 'PGRST116') {
        return null
      }
      throw error
    }

    return data
  } catch (error) {
    console.error('Error getting page content:', error)
    return null // Fallback to hardcoded content
  }
}

export const updatePageContent = async (page, section, content) => {
  try {
    const { data, error } = await supabase
      .from('page_content')
      .upsert({
        page,
        section,
        content,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'page,section'
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating page content:', error)
    throw error
  }
}

// Image management functions
export const uploadImage = async (file, folder = 'admin-uploads') => {
  try {
    console.log('Starting image upload:', file.name, file.size, file.type)
    
    // Create unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    console.log('Uploading to path:', filePath)

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    console.log('Upload result:', { data, error })

    if (error) {
      console.error('Upload error:', error)
      throw error
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    // Save image record to database
    const { data: imageRecord, error: dbError } = await supabase
      .from('uploaded_images')
      .insert({
        filename: fileName,
        original_name: file.name,
        file_path: filePath,
        public_url: publicUrl,
        folder: folder,
        size: file.size,
        mime_type: file.type
      })
      .select()
      .single()

    if (dbError) throw dbError

    return {
      success: true,
      url: publicUrl,
      record: imageRecord
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export const getUploadedImages = async (folder = null) => {
  try {
    let query = supabase
      .from('uploaded_images')
      .select('*')
      .order('created_at', { ascending: false })

    if (folder) {
      query = query.eq('folder', folder)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting uploaded images:', error)
    return []
  }
}

export const deleteImage = async (imageId) => {
  try {
    // Get image record first
    const { data: image, error: fetchError } = await supabase
      .from('uploaded_images')
      .select('*')
      .eq('id', imageId)
      .single()

    if (fetchError) throw fetchError

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('images')
      .remove([image.file_path])

    if (storageError) throw storageError

    // Delete from database
    const { error: dbError } = await supabase
      .from('uploaded_images')
      .delete()
      .eq('id', imageId)

    if (dbError) throw dbError

    return { success: true }
  } catch (error) {
    console.error('Error deleting image:', error)
    return { success: false, error: error.message }
  }
}

// Get all available pages for editing
export const getEditablePages = () => {
  return [
    { id: 'home', name: 'Home Page', sections: ['hero', 'features', 'how-it-works', 'cta'] },
    { id: 'about', name: 'About Page', sections: ['hero', 'story', 'team'] },
    { id: 'products', name: 'Products Page', sections: ['hero', 'products'] },
    { id: 'contact', name: 'Contact Page', sections: ['hero', 'info'] },
    { id: 'usage', name: 'Usage Instructions', sections: ['header', 'instructions', 'guidelines'] }
  ]
} 