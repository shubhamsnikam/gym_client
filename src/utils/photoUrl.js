// Replace this with your real backend URL
const BASE_URL = 'https://gym-server-1-nqw8.onrender.com';

export const getPhotoUrl = (filename) => {
  if (!filename) return 'https://via.placeholder.com/150?text=No+Image';
  return `${BASE_URL}/uploads/${filename}`;
};
