// src/api/axiosInstance.js
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log('Session expired or invalid')
      // You can dispatch an action here if using Redux, or navigate to login
      // For now, we'll just reject the promise
    }
    return Promise.reject(error)
  }
)

export default apiClient