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
        const user = await supabase.auth.getUser()
        const isAdmin = user.data.user?.email === 'luisdrod750@gmail.com'
        
        userProfile = await createUserProfile({
          id: userId,
          email: user.data.user?.email,
          full_name: user.data.user?.user_metadata?.full_name || (isAdmin ? 'Luis Rodriguez (Admin)' : ''),
          phone: user.data.user?.user_metadata?.phone || '',
          is_admin: isAdmin
        })
      }
      
      setProfile(userProfile)
      
      // Log admin status for debugging
      if (userProfile?.is_admin) {
        console.log('🔑 Admin user logged in:', userProfile.email)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const signUp = async (email, password, metadata = {}) => {
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
    return { data, error }
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