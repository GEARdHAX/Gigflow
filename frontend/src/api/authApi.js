// src/api/authApi.js
import apiClient from './axiosInstance'

export const registerUser = async (userData) => {
  const { data } = await apiClient.post('/auth/register', userData)
  return data
}

export const loginUser = async (credentials) => {
  const { data } = await apiClient.post('/auth/login', credentials)
  return data
}

export const logoutUser = async () => {
  await apiClient.post('/auth/logout')
}

// This is the key function - it checks if the user is logged in
export const getCurrentUser = async () => {
  try {
    const { data } = await apiClient.get('/auth/me')
    return data
  } catch (error) {
    // If the token is invalid or expired, clear the user
    if (error.response?.status === 401) {
      throw new Error('Not authenticated')
    }
    throw error
  }
}