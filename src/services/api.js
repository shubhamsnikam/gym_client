// src/services/api.js
import axios from 'axios';

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
axios.defaults.baseURL = REACT_APP_BACKEND_URL;

export const getMembers = async () => {
  const res = await axios.get('/api/members');
  return res.data;
};

export const getMemberById = async (id) => {
  const res = await axios.get(`/api/members/${id}`);
  return res.data;
};

export const createMember = async (formData) => {
  const res = await axios.post('/api/members', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateMember = async (id, formData) => {
  const res = await axios.put(`/api/members/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteMember = async (id) => {
  const res = await axios.delete(`/api/members/${id}`);
  return res.data;
};
