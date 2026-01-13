// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              <img src="/favicon.png" alt="" />
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">
              GigFlow
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Find Jobs
            </Link>
            
            {user ? (
              <>
                <Link to="/create-gig" className="text-gray-600 hover:text-blue-600 font-medium transition">
                  Post a Job
                </Link>
                
                <div className="flex items-center gap-4 pl-6 border-l">
                  <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-black">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                      {user.name?.charAt(0)}
                    </div>
                    <span className="font-medium text-sm">{user.name}</span>
                  </Link>
                  
                  <button 
                    onClick={handleLogout} 
                    className="text-gray-400 hover:text-red-500 transition"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                  Sign In
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 bg-white absolute left-0 right-0 shadow-xl px-4 z-50">
            <div className="space-y-4">
              <Link to="/" className="block py-2 text-gray-600 font-medium">
                Find Jobs
              </Link>
              
              {user ? (
                <>
                  <Link to="/create-gig" className="block py-2 text-gray-600 font-medium">
                    Post a Job
                  </Link>
                  <Link to="/profile" className="block py-2 text-gray-600 font-medium">
                    My Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-red-600 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Link to="/login" className="text-center py-2 border rounded-lg">
                    Sign In
                  </Link>
                  <Link to="/register" className="text-center py-2 bg-blue-600 text-white rounded-lg">
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar