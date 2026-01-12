// src/components/NotificationManager.jsx
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import io from 'socket.io-client'
import toast from 'react-hot-toast'
import { Award } from 'lucide-react'

// Safe URL handling for Vite
const socketUrl = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api', '') 
  : 'http://localhost:5000'

const socket = io(socketUrl)

const NotificationManager = () => {
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // 1. Join Private Room
      socket.emit('join', user._id)

      // 2. Listen for 'HIRE' event (Bonus 2)
      socket.on('notification:hired', (data) => {
        toast.custom((t) => (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-lg max-w-md">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-lg">🎉 Congratulations!</p>
                <p className="text-green-100">{data.message}</p>
              </div>
            </div>
          </div>
        ), { duration: 6000 })
      })

      // NOTE: 'new-bid' event is not yet implemented in backend, so listener is disabled.
    }

    return () => {
      socket.off('notification:hired')
    }
  }, [user])

  return null
}

export default NotificationManager