// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react'
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../api/authApi'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount and on page refresh
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const userData = await getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.log('No valid session found')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const userData = await loginUser(credentials)
      setUser(userData)
      return { success: true, data: userData }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const register = async (userData) => {
    try {
      const newUser = await registerUser(userData)
      setUser(newUser)
      return { success: true, data: newUser }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    checkAuthStatus // Export this if needed elsewhere
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}