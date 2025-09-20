// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  FIND_MIDWAY: `${API_BASE_URL}/api/find_midway_restaurant`,
  PLACE_PHOTO: `${API_BASE_URL}/api/place_photo`,
  GENERATE_INVITATION: `${API_BASE_URL}/api/generate_invitation`
};