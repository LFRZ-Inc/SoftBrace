import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ebodynepuqrocggtevdw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVib2R5bmVwdXFyb2NnZ3RldmR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3ODk5OTMsImV4cCI6MjA2NTM2NTk5M30.LMq1DcLd5_pPf77NL0EqQmUHIp0WnU61UpxndtSmhr8'

// Add debug logging
console.log('Supabase Config:', {
  url: supabaseUrl,
  keyPrefix: supabaseAnonKey.substring(0, 20) + '...'
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    debug: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js'
    }
  }
})

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
  try {
    console.log('Fetching addresses for user:', userId);
    
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
  
    if (error) {
      console.error('Supabase error fetching user addresses:', error)
      
      // Handle common RLS/permissions issues  
      if (error.code === '42501' || error.code === '42P01') {
        console.log('Address table access issue, returning empty array')
        return []
      }
      
      throw error
    }

    console.log('Successfully fetched user addresses:', data?.length || 0, 'addresses')
    return data || []
  } catch (error) {
    console.error('Exception in getUserAddresses:', error)
    
    // Return empty array for table/permission issues
    if (error.message.includes('table') || error.message.includes('relation') || error.message.includes('permission')) {
      console.log('Database access issue, returning empty addresses array')
      return []
    }
    
    return [] // Return empty array instead of throwing
  }
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
  try {
    console.log('Fetching orders for user:', userId);
    
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
  
    if (error) {
      console.error('Supabase error fetching user orders:', error)
      
      // Handle common RLS/permissions issues
      if (error.code === '42501') {
        console.log('RLS policy issue, returning empty orders array')
        return []
      }
      
      throw error
    }

    console.log('Successfully fetched user orders:', data?.length || 0, 'orders')
    return data || []
  } catch (error) {
    console.error('Exception in getUserOrders:', error)
    
    // Return empty array for table/permission issues
    if (error.message.includes('table') || error.message.includes('relation') || error.message.includes('permission')) {
      console.log('Database access issue, returning empty orders array')
      return []
    }
    
    throw error
  }
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

// Points System Functions
export const getUserPoints = async (userId) => {
  try {
    // Calculate available points by summing all non-expired transactions
    const { data, error } = await supabase
      .from('points_transactions')
      .select('points')
      .eq('user_id', userId)
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())

    if (error) {
      console.error('Error fetching user points:', error)
      throw error
    }

    // Sum up all points (positive for earned, negative for redeemed)
    const totalPoints = data?.reduce((sum, transaction) => sum + transaction.points, 0) || 0
    return Math.max(0, totalPoints) // Ensure points never go negative
  } catch (error) {
    console.error('Exception in getUserPoints:', error)
    // Return 0 points if there's an error to prevent dashboard from hanging
    return 0
  }
}

export const getPointsTransactions = async (userId) => {
  try {
    console.log('Fetching points transactions for user:', userId);
    
    const { data, error } = await supabase
      .from('points_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error fetching points transactions:', error)
      
      // Handle common RLS/permissions issues
      if (error.code === '42501' || error.code === '42P01') {
        console.log('Points transactions table access issue, returning empty array')
        return []
      }
      
      throw error
    }

    console.log('Successfully fetched points transactions:', data?.length || 0, 'transactions')
    return data || []
  } catch (error) {
    console.error('Exception in getPointsTransactions:', error)
    
    // Return empty array for table/permission issues
    if (error.message.includes('table') || error.message.includes('relation') || error.message.includes('permission')) {
      console.log('Database access issue, returning empty transactions array')
      return []
    }
    
    return [] // Return empty array instead of throwing
  }
}

export const redeemPoints = async (userId, pointsToRedeem, description = 'Points redeemed for free product') => {
  try {
    // Check if user has enough points
    const availablePoints = await getUserPoints(userId)
    if (availablePoints < pointsToRedeem) {
      throw new Error('Insufficient points')
    }

    // Create redemption transaction
    const { data, error } = await supabase
      .from('points_transactions')
      .insert({
        user_id: userId,
        type: 'redeemed',
        points: -pointsToRedeem,
        description: description
      })
      .select()
      .single()

    if (error) {
      console.error('Error redeeming points:', error)
      throw error
    }

    // Update user's points balance
    await updateUserPointsBalance(userId)

    return data
  } catch (error) {
    console.error('Exception in redeemPoints:', error)
    throw error
  }
}

export const awardPoints = async (userId, pointsToAward, orderId = null, description = 'Points earned from purchase') => {
  try {
    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + 2) // 2 years from now

    const { data, error } = await supabase
      .from('points_transactions')
      .insert({
        user_id: userId,
        order_id: orderId,
        type: 'earned',
        points: pointsToAward,
        description: description,
        expires_at: expiryDate.toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error awarding points:', error)
      throw error
    }

    // Update user's points balance and activity
    await updateUserPointsBalance(userId)
    await updateUserActivity(userId)

    return data
  } catch (error) {
    console.error('Exception in awardPoints:', error)
    throw error
  }
}

export const updateUserPointsBalance = async (userId) => {
  try {
    const availablePoints = await getUserPoints(userId)
    
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        points_balance: availablePoints,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user points balance:', error)
      throw error
    }

    return availablePoints
  } catch (error) {
    console.error('Exception in updateUserPointsBalance:', error)
    throw error
  }
}

export const updateUserActivity = async (userId) => {
  try {
    const { error } = await supabase.rpc('update_user_activity', {
      user_uuid: userId
    })

    if (error) {
      console.error('Error updating user activity:', error)
      throw error
    }
  } catch (error) {
    console.error('Exception in updateUserActivity:', error)
    throw error
  }
}

// Order functions with points integration
export const createOrderWithPoints = async (orderData) => {
  try {
    // Generate order number
    const orderNumber = `SB${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-6)}`
    
    const orderWithNumber = {
      ...orderData,
      order_number: orderNumber,
      created_at: new Date().toISOString()
    }

    const { data: order, error } = await supabase
      .from('orders')
      .insert(orderWithNumber)
      .select()
      .single()

    if (error) {
      console.error('Error creating order:', error)
      throw error
    }

    // Award points if user is logged in (1 point per $1 spent)
    if (order.user_id && order.total_amount > 0) {
      const pointsToAward = Math.floor(order.total_amount)
      if (pointsToAward > 0) {
        await awardPoints(
          order.user_id, 
          pointsToAward, 
          order.id, 
          `Points earned from order ${order.order_number}`
        )
        
        // Update the order with points earned
        await supabase
          .from('orders')
          .update({ points_earned: pointsToAward })
          .eq('id', order.id)
      }
    }

    return order
  } catch (error) {
    console.error('Exception in createOrderWithPoints:', error)
    throw error
  }
}

export const createOrderItems = async (orderId, items) => {
  try {
    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      quantity: item.quantity,
      total_price: item.price * item.quantity
    }))

    const { data, error } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select()

    if (error) {
      console.error('Error creating order items:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Exception in createOrderItems:', error)
    throw error
  }
}

// ===== PRODUCT REVIEWS FUNCTIONS =====

// Submit a new product review
export const submitProductReview = async (reviewData) => {
  try {
    console.log('=== Starting review submission ===')
    console.log('Review data:', reviewData)
    console.log('Supabase client configured:', !!supabase)
    
    const insertData = {
      product_id: reviewData.product_id,
      rating: reviewData.rating,
      review_text: reviewData.review_text || null,
      user_email: reviewData.user_email,
      user_name: reviewData.user_name,
      is_approved: false // Reviews require approval
    }
    
    console.log('Data to insert:', insertData)
    
    const { data, error } = await supabase
      .from('product_reviews')
      .insert(insertData)
      .select()
      .single()

    console.log('Supabase response:', { data, error })

    if (error) {
      console.error('=== Supabase Error Details ===')
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Error details:', error.details)
      console.error('Error hint:', error.hint)
      console.error('Full error object:', error)
      throw error
    }

    console.log('=== Review submitted successfully ===')
    console.log('Inserted review:', data)
    return data
  } catch (error) {
    console.error('=== Exception in submitProductReview ===')
    console.error('Error type:', typeof error)
    console.error('Error constructor:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Full error:', error)
    throw error
  }
}

// Get approved reviews for a specific product
export const getProductReviews = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching product reviews:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Exception in getProductReviews:', error)
    throw error
  }
}

// Get review statistics for a product (average rating, count)
export const getProductReviewStats = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .select('rating')
      .eq('product_id', productId)
      .eq('is_approved', true)

    if (error) {
      console.error('Error fetching review stats:', error)
      throw error
    }

    const reviews = data || []
    const totalReviews = reviews.length
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10 // Round to 1 decimal
    }
  } catch (error) {
    console.error('Exception in getProductReviewStats:', error)
    throw error
  }
}

// Admin: Get all reviews (pending and approved)
export const getAllReviews = async () => {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all reviews:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Exception in getAllReviews:', error)
    throw error
  }
}

// Public: Get all approved reviews for the reviews page
export const getAllApprovedReviews = async () => {
  try {
    console.log('Fetching all approved reviews...');
    
    const { data, error } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error fetching approved reviews:', error)
      
      // Check if table doesn't exist or access denied
      if (error.code === '42P01') {
        throw new Error('Reviews table not found. Please contact support.')
      }
      if (error.code === '42501') {
        console.log('RLS policy blocking access, returning empty array for public access')
        return []
      }
      
      throw error
    }

    console.log('Successfully fetched approved reviews:', data?.length || 0, 'reviews')
    return data || []
  } catch (error) {
    console.error('Exception in getAllApprovedReviews:', error)
    
    // For now, return empty array instead of throwing to prevent page crashes
    if (error.message.includes('table') || error.message.includes('relation')) {
      console.log('Database table issue, returning empty reviews array')
      return []
    }
    
    throw error
  }
}

// Admin: Approve a review
export const approveReview = async (reviewId) => {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .update({ is_approved: true })
      .eq('id', reviewId)
      .select()
      .single()

    if (error) {
      console.error('Error approving review:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Exception in approveReview:', error)
    throw error
  }
}

// Admin: Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .delete()
      .eq('id', reviewId)
      .select()
      .single()

    if (error) {
      console.error('Error deleting review:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Exception in deleteReview:', error)
    throw error
  }
}

// Admin: Toggle spotlight status for a review
export const toggleReviewSpotlight = async (reviewId, isSpotlight) => {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .update({ is_spotlight: isSpotlight })
      .eq('id', reviewId)
      .select()
      .single()

    if (error) {
      console.error('Error toggling review spotlight:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Exception in toggleReviewSpotlight:', error)
    throw error
  }
}

// Get spotlight reviews (for homepage or featured sections)
export const getSpotlightReviews = async (limit = 6) => {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .select(`
        *,
        products (name, price)
      `)
      .eq('is_approved', true)
      .eq('is_spotlight', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching spotlight reviews:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Exception in getSpotlightReviews:', error)
    throw error
  }
}

// Get reviews filtered by star rating
export const getReviewsByRating = async (rating, productId = null) => {
  try {
    let query = supabase
      .from('product_reviews')
      .select(`
        *,
        products (name, price)
      `)
      .eq('is_approved', true)
      .eq('rating', rating)
      .order('created_at', { ascending: false })

    if (productId) {
      query = query.eq('product_id', productId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching reviews by rating:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Exception in getReviewsByRating:', error)
    throw error
  }
}

// Get review statistics by rating breakdown
export const getReviewRatingBreakdown = async (productId = null) => {
  try {
    let query = supabase
      .from('product_reviews')
      .select('rating')
      .eq('is_approved', true)

    if (productId) {
      query = query.eq('product_id', productId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching rating breakdown:', error)
      throw error
    }

    const reviews = data || []
    const breakdown = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0,
      total: reviews.length,
      average: 0
    }

    reviews.forEach(review => {
      breakdown[review.rating]++
    })

    if (reviews.length > 0) {
      breakdown.average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    }

    return breakdown
  } catch (error) {
    console.error('Exception in getReviewRatingBreakdown:', error)
    throw error
  }
}

// ===== SUPPORT MESSAGES FUNCTIONS =====

// Submit a support message
export const submitSupportMessage = async (messageData) => {
  try {
    const { data, error } = await supabase
      .from('support_messages')
      .insert({
        user_id: messageData.user_id || null,
        email: messageData.email,
        name: messageData.name,
        inquiry_type: messageData.inquiry_type || 'general',
        subject: messageData.subject || messageData.inquiry_type || 'General Inquiry',
        message: messageData.message,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Error submitting support message:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Exception in submitSupportMessage:', error)
    throw error
  }
}

// Get user's support messages
export const getUserSupportMessages = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user support messages:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Exception in getUserSupportMessages:', error)
    throw error
  }
}

// Admin: Get all support messages
export const getAllSupportMessages = async () => {
  try {
    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all support messages:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Exception in getAllSupportMessages:', error)
    throw error
  }
}

// Admin: Update support message status
export const updateSupportMessageStatus = async (messageId, status) => {
  try {
    const { data, error } = await supabase
      .from('support_messages')
      .update({ status })
      .eq('id', messageId)
      .select()
      .single()

    if (error) {
      console.error('Error updating support message status:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Exception in updateSupportMessageStatus:', error)
    throw error
  }
} 