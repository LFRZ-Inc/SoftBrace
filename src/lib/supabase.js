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
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export const createUserProfile = async (profile) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([profile])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
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
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      ),
      user_profiles (
        email,
        full_name
      )
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
} 