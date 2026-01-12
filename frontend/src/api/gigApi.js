// src/api/gigApi.js
import apiClient from './axiosInstance'

export const fetchGigs = async (search = '') => {
  const { data } = await apiClient.get(`/gigs?search=${search}`)
  return data
}

export const createGig = async (gigData) => {
  const { data } = await apiClient.post('/gigs', gigData)
  return data
}

export const getGigById = async (gigId) => {
  const { data } = await apiClient.get(`/gigs/${gigId}`)
  return data
}

export const updateGig = async (gigId, gigData) => {
  const { data } = await apiClient.put(`/gigs/${gigId}`, gigData)
  return data
}

export const deleteGig = async (gigId) => {
  const { data } = await apiClient.delete(`/gigs/${gigId}`)
  return data
}
// Add this export
export const fetchMyGigs = async () => {
  const { data } = await apiClient.get('/gigs/my_gigs');
  return data;
};
