// src/components/PublicRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  // 1. Wait for auth check to finish to prevent redirecting too early
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>
  }

  // 2. If user is already logged in, redirect to Dashboard
  if (user) {
    return <Navigate to="/" replace />
  }

  // 3. Otherwise, render the Login/Register page
  return children
}

export default PublicRoute