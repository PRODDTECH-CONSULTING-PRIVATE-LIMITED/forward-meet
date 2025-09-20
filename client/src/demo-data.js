// Demo data for GitHub Pages deployment (when backend is not available)
export const DEMO_RESTAURANTS = [
  {
    place_id: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    name: "Cafe Central",
    address: "123 Main Street, Downtown",
    lat: 12.9716,
    lon: 77.5946,
    rating: 4.5,
    user_ratings_total: 150,
    Maps_url: "https://maps.google.com",
    website: "https://example.com",
    phone: "+91 98765 43210",
    opening_hours: ["Monday: 9:00 AM – 10:00 PM", "Tuesday: 9:00 AM – 10:00 PM"],
    business_status: "OPERATIONAL",
    price_level: 2,
    photo_references: [],
    serves_vegetarian_food: true,
    travel_time_from_loc1_min: 15,
    travel_distance_from_loc1_km: 8.5,
    travel_time_from_loc2_min: 18,
    travel_distance_from_loc2_km: 9.2,
    time_difference_min: 3,
    distance_difference_km: 0.7,
    loc1_lat: 12.9716,
    loc1_lon: 77.5946,
    loc2_lat: 12.9716,
    loc2_lon: 77.5946
  },
  {
    place_id: "ChIJN1t_tDeuEmsRUsoyG83frY5",
    name: "The Coffee House",
    address: "456 Park Avenue, City Center",
    lat: 12.9716,
    lon: 77.5946,
    rating: 4.2,
    user_ratings_total: 89,
    Maps_url: "https://maps.google.com",
    website: "https://example.com",
    phone: "+91 98765 43211",
    opening_hours: ["Monday: 8:00 AM – 11:00 PM", "Tuesday: 8:00 AM – 11:00 PM"],
    business_status: "OPERATIONAL",
    price_level: 1,
    photo_references: [],
    serves_vegetarian_food: true,
    travel_time_from_loc1_min: 12,
    travel_distance_from_loc1_km: 7.2,
    travel_time_from_loc2_min: 16,
    travel_distance_from_loc2_km: 8.1,
    time_difference_min: 4,
    distance_difference_km: 0.9,
    loc1_lat: 12.9716,
    loc1_lon: 77.5946,
    loc2_lat: 12.9716,
    loc2_lon: 77.5946
  }
];

export const isDemoMode = () => {
  return !import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL.includes('api.forward-meet.com');
};