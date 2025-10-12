// photoUrl.js
export const getPhotoUrl = (filename) => {
    if (!filename) return 'https://via.placeholder.com/150?text=No+Image';
    return `https://gym-server-1-nqw8.onrender.com/uploads/${filename}`;
};
