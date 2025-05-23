import axios from 'axios';

// Backend base URL
// const REACT_APP_BACKEND_URL = 'https://gym-server-k6k4.onrender.com/api';


// Member API calls
export const getMembers = async () => {
  try {
    const response = await axios.get(`/api/members`);
    return response.data;
  } catch (error) {
    console.error('Error fetching members:', error.response?.data || error.message);
    throw error;
  }
};

export const getMemberById = async (id) => {
  try {
    const response = await axios.get(`/api/members/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching member with id ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const createMember = async (memberData) => {
  try {
    const response = await axios.post(`/api/members`, memberData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating member:', error.response?.data || error.message);
    throw error;
  }
};


export const updateMember = async (id, memberData) => {
  try {
    const response = await axios.put(`/api/members/${id}`, memberData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating member with id ${id}:`, error.response?.data || error.message);
    throw error;
  }
};


export const deleteMember = async (id) => {
  try {
    const response = await axios.delete(`/api/members/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting member with id ${id}:`, error.response?.data || error.message);
    throw error;
  }
};
