// src/utils/photoUrl.js

const BASE_URL = 'https://gym-server-1-nqw8.onrender.com';

export const getPhotoUrl = (photo) => {
  if (!photo) return 'https://via.placeholder.com/150?text=No+Image';

  if (photo.startsWith('http') || photo.startsWith('https')) {
    return photo; // Cloudinary or any full URL
  }

  return `${BASE_URL}/uploads/${photo}`; // Old uploads from Render backend
};
