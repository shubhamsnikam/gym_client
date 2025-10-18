// src/utils/photoUrl.js

// Base URL of your deployed backend (for backward compatibility with older uploads)
const BASE_URL = 'https://gym-server-1-nqw8.onrender.com';

/**
 * Returns the correct photo URL for a member.
 * - Uses Cloudinary full URLs directly
 * - Falls back to backend uploads (old members)
 * - Uses placeholder if no image
 */
export const getPhotoUrl = (photo) => {
  if (!photo) {
    // Default fallback image
    return 'https://via.placeholder.com/150?text=No+Image';
  }

  // ✅ If it's already a full URL (Cloudinary or remote)
  if (photo.startsWith('http') || photo.startsWith('https')) {
    return photo;
  }

  // ✅ Backward compatibility (old uploads on server)
  return `${BASE_URL}/uploads/${photo}`;
};
