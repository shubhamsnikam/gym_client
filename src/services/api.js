// src/services/api.js
import axios from 'axios';

// Use environment variable if defined, fallback to local
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://gym-server-1-nqw8.onrender.com';

// Set default base URL for all requests
axios.defaults.baseURL = BACKEND_URL;

// ✅ Members API functions
export const getMembers = async () => {
  const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/members`);
  return res.data;
};

export const getMemberById = async (id) => {
  const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/members/${id}`);
  return res.data;
};

export const createMember = async (formData) => {
  const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/members`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateMember = async (id, formData) => {
  const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/members/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteMember = async (id) => {
  const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/members/${id}`);
  return res.data;
};

// ⚠️ No need for getMemberImageUrl anymore — handled in `utils/photoUrl.js`
