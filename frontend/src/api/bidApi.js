// src/api/bidApi.js
import apiClient from './axiosInstance'

export const fetchBids = async (gigId) => {
  const { data } = await apiClient.get(`/bids/${gigId}`)
  return data
}

export const placeBid = async (gigId, bidData) => {
  const { data } = await apiClient.post(`/bids/${gigId}`, bidData)
  return data
}

export const hireFreelancer = async (bidId) => {
  const { data } = await apiClient.patch(`/bids/${bidId}/hire`)
  return data
}

export const getUserBids = async () => {
  const { data } = await apiClient.get('/bids/my-bids')
  return data
}

export const fetchMyBids = async () => {
  const { data } = await apiClient.get('/bids/my-bids');
  return data;
};