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
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        await loadUserProfile(session.user.id)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          await loadUserProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId) => {
    try {
      let userProfile = await getUserProfile(userId)
      
      // If no profile exists, create one
      if (!userProfile) {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        const isAdmin = authUser?.email === 'luisdrod750@gmail.com'
        
        try {
          userProfile = await createUserProfile({
            id: userId,
            email: authUser?.email,
            full_name: authUser?.user_metadata?.full_name || (isAdmin ? 'Luis Rodriguez (Admin)' : ''),
            phone: authUser?.user_metadata?.phone || '',
            is_admin: isAdmin
          })
        } catch (createError) {
          console.error('Error creating user profile:', createError)
          // If profile creation fails, try to call the ensure function
          try {
            await supabase.rpc('ensure_admin_profile', { 
              user_email: authUser?.email,
              user_id: userId 
            })
            // Try to get the profile again
            userProfile = await getUserProfile(userId)
          } catch (ensureError) {
            console.error('Error ensuring admin profile:', ensureError)
            // Create a minimal profile object to prevent app crashes
            userProfile = {
              id: userId,
              email: authUser?.email,
              full_name: authUser?.user_metadata?.full_name || '',
              is_admin: authUser?.email === 'luisdrod750@gmail.com'
            }
          }
        }
      }
      
      setProfile(userProfile)
      
      // Log admin status for debugging
      if (userProfile?.is_admin) {
        console.log('🔑 Admin user logged in:', userProfile.email)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
      // Don't crash the app, just log the error
      setProfile(null)
    }
  }

  const signUp = async (email, password, metadata = {}) => {
    try {
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
      
      // If signup successful but there's a profile issue, try to ensure the profile exists
      if (data.user && !error && email === 'luisdrod750@gmail.com') {
        try {
          await supabase.rpc('ensure_admin_profile', { 
            user_email: email,
            user_id: data.user.id 
          })
        } catch (ensureError) {
          console.warn('Could not ensure admin profile, but signup was successful:', ensureError)
        }
      }
      
      return { data, error }
    } catch (err) {
      console.error('Signup error:', err)
      return { data: null, error: err }
    }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
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