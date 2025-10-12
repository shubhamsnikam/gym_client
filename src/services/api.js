import axios from 'axios';

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
axios.defaults.baseURL = REACT_APP_BACKEND_URL;

// ===== Member API =====

// Helper to log FormData content for debugging
const logFormData = (formData) => {
  console.log('--- FormData Content ---');
  for (let pair of formData.entries()) {
    console.log(pair[0], ':', pair[1]);
  }
  console.log('-----------------------');
};

// ===== Fetch All Members =====
export const getMembers = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/members`);
    return res.data;
  } catch (error) {
    console.error('Error fetching members:', error.response?.data || error.message);
    throw error;
  }
};

// ===== Fetch Member by ID =====
export const getMemberById = async (id) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/members/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching member ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// ===== Create Member =====
export const createMember = async (memberData) => {
  try {
    const formData = memberData instanceof FormData ? memberData : new FormData();

    if (!(memberData instanceof FormData)) {
      for (let key in memberData) {
        let value = memberData[key];
        if ((Array.isArray(value) || typeof value === 'object') && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      }
    }

    logFormData(formData); // 🔍 Debug

    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/members`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error) {
    console.error('Error creating member:', error.response?.data || error.message);
    throw error;
  }
};

// ===== Update Member =====
export const updateMember = async (id, memberData) => {
  try {
    const formData = memberData instanceof FormData ? memberData : new FormData();

    if (!(memberData instanceof FormData)) {
      for (let key in memberData) {
        let value = memberData[key];
        if ((Array.isArray(value) || typeof value === 'object') && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      }
    }

    logFormData(formData); // 🔍 Debug

    const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/members/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error) {
    console.error(`Error updating member ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// ===== Delete Member =====
export const deleteMember = async (id) => {
  try {
    const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/members/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error deleting member ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// ===== ✅ Fixed Image URL Helper =====
export const getMemberImageUrl = (photoPath) => {
  if (!photoPath) return '';
  // ✅ Corrected: ensure /uploads/ is included in path
  return `${REACT_APP_BACKEND_URL}/uploads/${photoPath}`;
};
