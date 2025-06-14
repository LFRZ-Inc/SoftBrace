import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, getUserProfile, createUserProfile } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          await loadUserProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    // Set a timeout to ensure loading doesn't get stuck
    const loadingTimeout = setTimeout(() => {
      console.log('Auth loading timeout reached, setting loading to false')
      setLoading(false)
    }, 5000)

    getInitialSession().finally(() => {
      clearTimeout(loadingTimeout)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        
        try {
          if (event === 'SIGNED_OUT') {
            console.log('AuthContext: User signed out, clearing state')
            setUser(null)
            setProfile(null)
            setLoading(false)
            return
          }
          
          if (session?.user) {
            console.log('AuthContext: User session found, loading profile')
            setUser(session.user)
            await loadUserProfile(session.user.id)
          } else {
            console.log('AuthContext: No user session, clearing state')
            setUser(null)
            setProfile(null)
          }
        } catch (error) {
          console.error('Error handling auth state change:', error)
          // Don't crash the app, just clear the state
          setUser(null)
          setProfile(null)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId) => {
    try {
      console.log('Loading user profile for:', userId)
      
      // Try to get existing profile first
      let userProfile = null
      
      try {
        userProfile = await getUserProfile(userId)
      } catch (profileError) {
        console.warn('Standard profile fetch failed, trying alternative method:', profileError)
        
        // Try the safe function as fallback
        try {
          const { data } = await supabase.rpc('safe_get_profile', { user_id: userId })
          if (data && data.length > 0) {
            userProfile = data[0]
          }
        } catch (rpcError) {
          console.warn('RPC profile fetch also failed:', rpcError)
        }
      }
      
      // If no profile exists, create one
      if (!userProfile) {
        console.log('No profile found, creating new profile')
        
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) {
          throw new Error('No authenticated user found')
        }
        
        const isAdmin = authUser.email === 'luisdrod750@gmail.com'
        
        const profileData = {
          id: userId,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || (isAdmin ? 'Luis Rodriguez (Admin)' : ''),
          phone: authUser.user_metadata?.phone || null,
          is_admin: isAdmin
        }
        
        try {
          userProfile = await createUserProfile(profileData)
          console.log('Created new profile:', userProfile)
        } catch (createError) {
          console.error('Failed to create profile:', createError)
          
          // If profile creation fails, try the ensure function as fallback
          try {
            await supabase.rpc('ensure_admin_profile', { 
              user_email: authUser.email,
              user_id: userId 
            })
            
            // Try to get the profile again after ensuring it exists
            userProfile = await getUserProfile(userId)
            console.log('Profile ensured and retrieved:', userProfile)
          } catch (ensureError) {
            console.error('Failed to ensure profile:', ensureError)
            
            // Create a minimal profile object to prevent app crashes
            userProfile = {
              id: userId,
              email: authUser.email,
              full_name: authUser.user_metadata?.full_name || (isAdmin ? 'Luis Rodriguez (Admin)' : ''),
              phone: authUser.user_metadata?.phone || null,
              is_admin: isAdmin,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            console.log('Using fallback profile:', userProfile)
          }
        }
      }
      
      setProfile(userProfile)
      
      // Log admin status for debugging
      if (userProfile?.is_admin) {
        console.log('🔑 Admin user logged in:', userProfile.email)
      }
      
      return userProfile
    } catch (error) {
      console.error('Error loading user profile:', error)
      
      // Don't crash the app, just set profile to null
      setProfile(null)
      
      // For critical errors, we might want to sign out the user
      if (error.message?.includes('schema') || error.message?.includes('RLS')) {
        console.error('Database schema error detected, signing out user')
        await supabase.auth.signOut()
      }
      
      throw error
    }
  }

  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            full_name: metadata.full_name || (email === 'luisdrod750@gmail.com' ? 'Luis Rodriguez (Admin)' : '')
          }
        }
      })
      
      if (error) {
        console.error('Signup error:', error)
        return { data: null, error }
      }
      
      // If signup successful and it's the admin email, try to ensure the profile exists
      if (data.user && email === 'luisdrod750@gmail.com') {
        try {
          await supabase.rpc('ensure_admin_profile', { 
            user_email: email,
            user_id: data.user.id 
          })
          console.log('Admin profile ensured during signup')
        } catch (ensureError) {
          console.warn('Could not ensure admin profile during signup:', ensureError)
        }
      }
      
      return { data, error: null }
    } catch (err) {
      console.error('Signup exception:', err)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      
      console.log('Attempting to sign in:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Sign in error:', error)
        return { data: null, error }
      }
      
      console.log('Sign in successful:', data.user?.email)
      return { data, error: null }
    } catch (err) {
      console.error('Sign in exception:', err)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      console.log('AuthContext: Starting sign out process...')
      setLoading(true)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('AuthContext: Sign out error:', error)
        return { error }
      }
      
      console.log('AuthContext: Sign out successful, clearing state...')
      // Clear state immediately
      setUser(null)
      setProfile(null)
      
      return { error: null }
    } catch (err) {
      console.error('AuthContext: Sign out exception:', err)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return { data, error }
  }

  const updatePassword = async (password) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    })
    return { data, error }
  }

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.is_admin || false,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    loadUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 