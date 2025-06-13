import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ebodynepuqrocggtevdw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVib2R5bmVwdXFyb2NnZ3RldmR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3ODk5OTMsImV4cCI6MjA2NTM2NTk5M30.LMq1DcLd5_pPf77NL0EqQmUHIp0WnU61UpxndtSmhr8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for common operations
export const auth = supabase.auth

// Products
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('id')
  
  if (error) throw error
  return data
}

// Check if address is in Laredo, TX for free shipping
export const checkLaredoShipping = async (city, state) => {
  const { data, error } = await supabase
    .from('shipping_zones')
    .select('*')
    .ilike('city', city)
    .ilike('state', state)
    .eq('is_free_shipping', true)
  
  if (error) throw error
  return data.length > 0
}

// User profile functions
export const getUserProfile = async (userId) => {
  try {
    console.log('Fetching user profile for ID:', userId)
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      // If no profile found, return null (not an error)
      if (error.code === 'PGRST116') {
        console.log('No profile found for user:', userId)
        return null
      }
      
      console.error('Error fetching user profile:', error)
      throw error
    }

    console.log('Successfully fetched user profile:', data)
    return data
  } catch (error) {
    console.error('Exception in getUserProfile:', error)
    throw error
  }
}

export const createUserProfile = async (profileData) => {
  try {
    console.log('Creating user profile:', profileData)
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single()

    if (error) {
      console.error('Error creating user profile:', error)
      throw error
    }

    console.log('Successfully created user profile:', data)
    return data
  } catch (error) {
    console.error('Exception in createUserProfile:', error)
    throw error
  }
}

export const updateUserProfile = async (userId, updates) => {
  try {
    console.log('Updating user profile:', userId, updates)
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      throw error
    }

    console.log('Successfully updated user profile:', data)
    return data
  } catch (error) {
    console.error('Exception in updateUserProfile:', error)
    throw error
  }
}

// Address functions
export const getUserAddresses = async (userId) => {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
  
  if (error) throw error
  return data
}

export const createAddress = async (address) => {
  const { data, error } = await supabase
    .from('addresses')
    .insert([address])
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Order functions
export const createOrder = async (order) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getUserOrders = async (userId) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Admin functions
export const getAllOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        user_profiles (
          full_name,
          email
        ),
        order_items (
          *,
          products (
            name,
            price
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all orders:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Exception in getAllOrders:', error)
    throw error
  }
}

export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all users:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Exception in getAllUsers:', error)
    throw error
  }
}

// Helper function to ensure admin profile exists
export const ensureAdminProfile = async (email, userId) => {
  try {
    console.log('Ensuring admin profile exists for:', email, userId)
    
    const { data, error } = await supabase.rpc('ensure_admin_profile', {
      user_email: email,
      user_id: userId
    })

    if (error) {
      console.error('Error ensuring admin profile:', error)
      throw error
    }

    console.log('Admin profile ensured successfully:', data)
    return data
  } catch (error) {
    console.error('Exception in ensureAdminProfile:', error)
    throw error
  }
} 