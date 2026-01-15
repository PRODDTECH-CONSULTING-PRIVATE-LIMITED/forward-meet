// import React, { useEffect, useRef } from "react";

// const GooglePlaceCardCompact = ({ placeId, locationInfo, setIsDetailedView }) => {
//   const ref = useRef(null);

//   // Destructure optional location info
//   const {
//     serves_gluten_free_food = false,
//     serves_vegan_food = false,
//     serves_vegetarian_food = false,
//     travel_time_from_loc1_min,
//     travel_time_from_loc2_min,
//     travel_distance_from_loc1_km,
//     travel_distance_from_loc2_km,
//     time_difference_min,
//   } = locationInfo || {};

//   useEffect(() => {
//     if (!ref.current || !placeId) return;

//     // Clear old DOM children
//     ref.current.innerHTML = "";

//     // Orientation
//     ref.current.setAttribute("orientation", "horizontal");

//     // Google Maps Web Component: Request & Content Config
//     const request = document.createElement("gmp-place-details-place-request");
//     request.setAttribute("place", placeId);

//     const config = document.createElement("gmp-place-content-config");
//     const createElement = (tag, attrs = {}) => {
//       const el = document.createElement(tag);
//       for (const [key, val] of Object.entries(attrs)) {
//         el.setAttribute(key, val);
//       }
//       return el;
//     };

//     // Append child component tags
//     config.appendChild(createElement("gmp-place-media"));
//     config.appendChild(createElement("gmp-place-address"));
//     config.appendChild(createElement("gmp-place-rating"));
//     config.appendChild(createElement("gmp-place-type"));
//     config.appendChild(createElement("gmp-place-price"));
//     config.appendChild(createElement("gmp-place-accessible-entrance-icon"));
//     config.appendChild(createElement("gmp-place-open-now-status"));
//     config.appendChild(
//       createElement("gmp-place-attribution", {
//         "light-scheme-color": "gray",
//         "dark-scheme-color": "white",
//       })
//     );

//     ref.current.appendChild(request);
//     ref.current.appendChild(config);
//   }, [placeId]);

//   if (!placeId) return null;

//   return (
//   <div
//     style={{
//       width: "100%",
//       maxWidth: 520,
//       borderRadius: "12px",
//       boxShadow: "0 4px 16px rgba(0, 0, 0, 0.09)",
//       overflow: "hidden",
//       backgroundColor: "#ffffff",
//       marginBottom: "2rem",
//       fontFamily: "Roboto, Arial, sans-serif",
//       color: "#000",
//     }}
//     className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
//     onClick={() => {
//         setIsDetailedView(false);
//     }}
//   >
//     {/* Google Place Card */}
//     <gmp-place-details-compact
//       ref={ref}
//       truncation-preferred
//       style={{
//         width: "100%",
//         display: "block",
//         "--gmp-mat-color-surface": "#ffffff",             // Card background
//         "--gmp-mat-color-on-surface": "#000000",          // Title and text
//         "--gmp-mat-color-on-surface-variant": "#555555",  // Subtitle text
//         "--gmp-mat-color-primary": "#4285f4",             // Accent (Google Blue)
//         "--gmp-mat-color-outline-decorative": "#e0e0e0",  // Border
//         "--gmp-header-visibility": "none",
//         "--gmp-footer-visibility": "none",
//         fontSize: "14px",
//         cursor: "pointer",
//       }}
//     />

//     {/* Custom Travel Info Panel */}
//     {locationInfo && (
//     <>
//       {/* Custom Travel Info Panel */}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "row",
//           backgroundColor: "#f9fafb",
//           padding: "12px 16px",
//           gap: "12px",
//           borderTop: "1px solid #e0e0e0",
//           overflowX: "auto",
//           whiteSpace: "nowrap",
//           scrollbarWidth: "thin",
//           cursor: "pointer"
//         }}
//       >
//         <InfoBox
//           label="User 1"
//           time={travel_time_from_loc1_min}
//           distance={travel_distance_from_loc1_km}
//         />
//         <InfoBox
//           label="User 2"
//           time={travel_time_from_loc2_min}
//           distance={travel_distance_from_loc2_km}
//         />
//       </div>
//     </>
//   )}

//   </div>
// );
// };

// // Reusable Info Box
// const InfoBox = ({ label, time, distance }) => (
//   <div
//     style={{
//       fontSize: "13px",
//       padding: "8px 12px",
//       borderRadius: "8px",
//       backgroundColor: "#e8f0fe",
//       color: "#1a1a1a",
//       display: "inline-flex",  // Changed from flex to inline-flex
//       flexDirection: "row",
//       minWidth: "140px",
//       gap: "8px",
//       marginRight: "8px"      // Ensure spacing between boxes when scrolling
//     }}
//   >
//     <strong style={{ fontSize: "13px", marginRight: "4px" }}>{label}</strong>
//     <div>
//       {time ? `${time}min` : ""}{distance !== undefined ? ` – ${distance} km` : ""}
//     </div>
//   </div>
// );


// export default GooglePlaceCardCompact;

// import React, { useEffect, useRef, useState } from "react";
// const GooglePlaceCardCompact = ({ placeId, locationInfo, setIsDetailedView }) => {
//   const ref = useRef(null);
//   const [photoUris, setPhotoUris] = useState([]);
//   const [photosLoading, setPhotosLoading] = useState(false);
//   const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
//   // Destructure optional location info
//   const {
//     serves_gluten_free_food = false,
//     serves_vegan_food = false,
//     serves_vegetarian_food = false,
//     travel_time_from_loc1_min,
//     travel_time_from_loc2_min,
//     travel_distance_from_loc1_km,
//     travel_distance_from_loc2_km,
//     time_difference_min,
//   } = locationInfo || {};
//   // Fetch Place Photos using Google Maps Places API
//   useEffect(() => {
//     const fetchPlacePhotos = async () => {
//       if (!window.google || !placeId) return;
//       setPhotosLoading(true);
//       try {
//         const { Place } = await window.google.maps.importLibrary("places");
//         const place = new Place({ id: placeId });
//         // Fetch place data including photos
//         await place.fetchFields({
//           fields: ["photos", "displayName", "editorialSummary"]
//         });
//         if (place.photos && place.photos.length > 0) {
//           // Generate photo URIs with different sizes for thumbnail and full view
//           const photoData = place.photos.slice(0, 10).map((photo, index) => ({
//             thumbnail: photo.getURI({ maxHeight: 120, maxWidth: 120 }),
//             fullSize: photo.getURI({ maxHeight: 400, maxWidth: 600 }),
//             attributions: photo.authorAttributions
//           }));
//           setPhotoUris(photoData);
//         } else {
//           setPhotoUris([]);
//         }
//       } catch (error) {
//         console.error("Error fetching place photos:", error);
//         setPhotoUris([]);
//       } finally {
//         setPhotosLoading(false);
//       }
//     };
//     fetchPlacePhotos();
//   }, [placeId]);
//   // Setup Google Place Details component
//   useEffect(() => {
//     if (!ref.current || !placeId) return;
//     // Clear old DOM children
//     ref.current.innerHTML = "";
//     // Orientation
//     ref.current.setAttribute("orientation", "horizontal");
//     // Google Maps Web Component: Request & Content Config
//     const request = document.createElement("gmp-place-details-place-request");
//     request.setAttribute("place", placeId);
//     const config = document.createElement("gmp-place-content-config");
//     const createElement = (tag, attrs = {}) => {
//       const el = document.createElement(tag);
//       for (const [key, val] of Object.entries(attrs)) {
//         el.setAttribute(key, val);
//       }
//       return el;
//     };
//     // Append child component tags
//     // config.appendChild(createElement("gmp-place-media"));
//     config.appendChild(createElement("gmp-place-address"));
//     config.appendChild(createElement("gmp-place-rating"));
//     config.appendChild(createElement("gmp-place-type"));
//     config.appendChild(createElement("gmp-place-price"));
//     config.appendChild(createElement("gmp-place-accessible-entrance-icon"));
//     config.appendChild(createElement("gmp-place-open-now-status"));
//     config.appendChild(
//       createElement("gmp-place-attribution", {
//         "light-scheme-color": "gray",
//         "dark-scheme-color": "white",
//       })
//     );
//     ref.current.appendChild(request);
//     ref.current.appendChild(config);
//   }, [placeId]);
//   if (!placeId) return null;
//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: 520,
//         borderRadius: "12px",
//         boxShadow: "0 4px 16px rgba(0, 0, 0, 0.09)",
//         overflow: "hidden",
//         backgroundColor: "#FFFFFF",
//         marginBottom: "2rem",
//         fontFamily: "Roboto, Arial, sans-serif",
//         color: "#000",
//       }}
//       className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
//     >
    
//       {/* Horizontal Scrollable Photo Gallery */}
//       {photoUris.length > 0 && (
//         <div
//           style={{
//             backgroundColor: "#F9FAFB",
//             borderTop: "1px solid #E0E0E0",
//           }}
//         >
//           {/* Photo Gallery */}
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               overflowX: "auto",
//               gap: "8px",
//               padding: "12px 16px 8px 16px",
//               scrollbarWidth: "thin",
//               scrollBehavior: "smooth",
//             }}
//             className="photo-gallery-scroll"
//           >
//             {photoUris.map((photo, index) => (
//               <img
//                 key={index}
//                 src={photo.thumbnail}
//                 alt={`Place photo ${index + 1}`}
//                 style={{
//                   minWidth: "80px",
//                   width: "80px",
//                   height: "80px",
//                   objectFit: "cover",
//                   borderRadius: "8px",
//                   cursor: "pointer",
//                   border: selectedPhotoIndex === index ? "2px solid #4285F4" : "2px solid transparent",
//                   transition: "border-color 0.2s ease",
//                 }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setSelectedPhotoIndex(index);
//                 }}
//                 onError={(e) => {
//                   e.target.style.display = 'none';
//                 }}
//               />
//             ))}
//           </div>
//           {/* Photo Attribution */}
//           {photoUris[selectedPhotoIndex]?.attributions && (
//             <div
//               style={{
//                 fontSize: "10px",
//                 color: "#666",
//                 padding: "0 16px 8px 16px",
//                 textAlign: "right",
//               }}
//             >
//             </div>
//           )}
//         </div>
//       )}
//       {/* Loading State for Photos */}
//       {photosLoading && (
//         <div
//           style={{
//             padding: "16px",
//             textAlign: "center",
//             backgroundColor: "#F9FAFB",
//             borderTop: "1px solid #E0E0E0",
//             fontSize: "12px",
//             color: "#666",
//           }}
//         >
//           Loading photos...
//         </div>
//       )}

//       {/* Google Place Card */}
//       <div
//         onClick={() => setIsDetailedView(false)}
//       >
//         <gmp-place-details-compact
//           ref={ref}
//           truncation-preferred
//           style={{
//             width: "100%",
//             display: "block",
//             "--gmp-mat-color-surface": "#FFFFFF",
//             "--gmp-mat-color-on-surface": "#000000",
//             "--gmp-mat-color-on-surface-variant": "#555555",
//             "--gmp-mat-color-primary": "#4285F4",
//             "--gmp-mat-color-outline-decorative": "#E0E0E0",
//             "--gmp-header-visibility": "none",
//             "--gmp-footer-visibility": "none",
//             fontSize: "14px",
//             cursor: "pointer",
//           }}
//         />
//       </div>

//       {/* Custom Travel Info Panel */}
//       {locationInfo && (
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             backgroundColor: "#F9FAFB",
//             padding: "12px 16px",
//             gap: "12px",
//             borderTop: photoUris.length > 0 || photosLoading ? "none" : "1px solid #E0E0E0",
//             overflowX: "auto",
//             whiteSpace: "nowrap",
//             scrollbarWidth: "thin",
//             cursor: "pointer"
//           }}
//           onClick={() => setIsDetailedView(false)}
//         >
//           <InfoBox
//             label="User 1"
//             time={travel_time_from_loc1_min}
//             distance={travel_distance_from_loc1_km}
//           />
//           <InfoBox
//             label="User 2"
//             time={travel_time_from_loc2_min}
//             distance={travel_distance_from_loc2_km}
//           />
//         </div>
//       )}
//     </div>
//   );
// };
// // Reusable Info Box Component
// const InfoBox = ({ label, time, distance }) => (
//   <div
//     style={{
//       fontSize: "13px",
//       padding: "8px 12px",
//       borderRadius: "8px",
//       backgroundColor: "#E8F0FE",
//       color: "#1A1A1A",
//       display: "inline-flex",
//       flexDirection: "row",
//       minWidth: "140px",
//       gap: "8px",
//       marginRight: "8px"
//     }}
//   >
//     <strong style={{ fontSize: "13px", marginRight: "4px" }}>{label}</strong>
//     <div>
//       {time ? `${time}min` : ""}{distance !== undefined ? ` – ${distance} km` : ""}
//     </div>
//   </div>
// );
// export default GooglePlaceCardCompact;

// import React, { useEffect, useRef, useState } from "react";
// const GooglePlaceCardCompact = ({ placeId, locationInfo, setIsDetailedView }) => {
//   const ref = useRef(null);
//   const [photoUris, setPhotoUris] = useState([]);
//   const [photosLoading, setPhotosLoading] = useState(false);
//   const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
//   // Destructure optional location info
//   const {
//     serves_gluten_free_food = false,
//     serves_vegan_food = false,
//     serves_vegetarian_food = false,
//     travel_time_from_loc1_min,
//     travel_time_from_loc2_min,
//     travel_distance_from_loc1_km,
//     travel_distance_from_loc2_km,
//     time_difference_min,
//   } = locationInfo || {};
//   // Fetch Place Photos using Google Maps Places API
//   useEffect(() => {
//     const fetchPlacePhotos = async () => {
//       if (!window.google || !placeId) return;
//       setPhotosLoading(true);
//       try {
//         const { Place } = await window.google.maps.importLibrary("places");
//         const place = new Place({ id: placeId });
//         // Fetch place data including photos
//         await place.fetchFields({
//           fields: ["photos", "displayName", "editorialSummary"]
//         });
//         if (place.photos && place.photos.length > 0) {
//           // Generate photo URIs with different sizes for thumbnail and full view
//           const photoData = place.photos.slice(0, 10).map((photo, index) => ({
//             thumbnail: photo.getURI({ maxHeight: 120, maxWidth: 120 }),
//             fullSize: photo.getURI({ maxHeight: 400, maxWidth: 600 }),
//             attributions: photo.authorAttributions
//           }));
//           setPhotoUris(photoData);
//         } else {
//           setPhotoUris([]);
//         }
//       } catch (error) {
//         console.error("Error fetching place photos:", error);
//         setPhotoUris([]);
//       } finally {
//         setPhotosLoading(false);
//       }
//     };
//     fetchPlacePhotos();
//   }, [placeId]);
//   // Setup Google Place Details component
//   useEffect(() => {
//     if (!ref.current || !placeId) return;
//     // Clear old DOM children
//     ref.current.innerHTML = "";
//     // Orientation
//     ref.current.setAttribute("orientation", "horizontal");
//     // Google Maps Web Component: Request & Content Config
//     const request = document.createElement("gmp-place-details-place-request");
//     request.setAttribute("place", placeId);
//     const config = document.createElement("gmp-place-content-config");
//     const createElement = (tag, attrs = {}) => {
//       const el = document.createElement(tag);
//       for (const [key, val] of Object.entries(attrs)) {
//         el.setAttribute(key, val);
//       }
//       return el;
//     };
//     // Append child component tags
//     // config.appendChild(createElement("gmp-place-media"));
//     // config.appendChild(createElement("gmp-place-address"));
//     config.appendChild(createElement("gmp-place-rating"));
//     config.appendChild(createElement("gmp-place-type"));
//     config.appendChild(createElement("gmp-place-price"));
//     config.appendChild(createElement("gmp-place-accessible-entrance-icon"));
//     config.appendChild(createElement("gmp-place-open-now-status"));
//     config.appendChild(
//       createElement("gmp-place-attribution", {
//         "light-scheme-color": "gray",
//         "dark-scheme-color": "white",
//       })
//     );
//     config.appendChild(createElement("gmp-place-reviews", {
//       "max-reviews": "1",   
//       "review-format": "snippet",
//     }));

//     ref.current.appendChild(request);
//     ref.current.appendChild(config);
//   }, [placeId]);
//   if (!placeId) return null;
//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: 520,
//         borderRadius: "12px",
//         boxShadow: "0 4px 16px rgba(0, 0, 0, 0.09)",
//         overflow: "hidden",
//         backgroundColor: "#FFFFFF",
//         marginBottom: "2rem",
//         fontFamily: "Roboto, Arial, sans-serif",
//         color: "#000",
//       }}
//       className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
//     >
    
//       {/* Google Place Card */}
//       <div
//         onClick={() => setIsDetailedView(false)}
//       >
//         <gmp-place-details
//           ref={ref}
//           truncation-preferred
//           style={{
//             width: "100%",
//             display: "block",
//             "--gmp-mat-color-surface": "#FFFFFF",
//             "--gmp-mat-color-on-surface": "#000000",
//             "--gmp-mat-color-on-surface-variant": "#555555",
//             "--gmp-mat-color-primary": "#4285F4",
//             "--gmp-mat-color-outline-decorative": "#E0E0E0",
//             "--gmp-header-visibility": "none",
//             "--gmp-footer-visibility": "none",
//             fontSize: "14px",
//             cursor: "pointer",
//           }}
//         />
//       </div>

//       {/* Horizontal Scrollable Photo Gallery */}
//       {photoUris.length > 0 && (
//         <div
//           style={{
//             backgroundColor: "#F9FAFB",
//             borderTop: "1px solid #E0E0E0",
//           }}
//         >
//           {/* Photo Gallery */}
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               overflowX: "auto",
//               gap: "8px",
//               padding: "12px 16px 8px 16px",
//               scrollbarWidth: "thin",
//               scrollBehavior: "smooth",
//             }}
//             className="photo-gallery-scroll"
//           >
//             {photoUris.map((photo, index) => (
//               <img
//                 key={index}
//                 src={photo.thumbnail}
//                 alt={`Place photo ${index + 1}`}
//                 style={{
//                   minWidth: "80px",
//                   width: "80px",
//                   height: "80px",
//                   objectFit: "cover",
//                   borderRadius: "8px",
//                   cursor: "pointer",
//                   border: selectedPhotoIndex === index ? "2px solid #4285F4" : "2px solid transparent",
//                   transition: "border-color 0.2s ease",
//                 }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setSelectedPhotoIndex(index);
//                 }}
//                 onError={(e) => {
//                   e.target.style.display = 'none';
//                 }}
//               />
//             ))}
//           </div>

//           {/* Photo Attribution */}
//           {photoUris[selectedPhotoIndex]?.attributions && (
//             <div
//               style={{
//                 fontSize: "10px",
//                 color: "#666",
//                 padding: "0 16px 8px 16px",
//                 textAlign: "right",
//               }}
//             >
//             </div>
//           )}
//         </div>
//       )}
      
//       {/* Loading State for Photos */}
//       {photosLoading && (
//         <div
//           style={{
//             padding: "16px",
//             textAlign: "center",
//             backgroundColor: "#F9FAFB",
//             borderTop: "1px solid #E0E0E0",
//             fontSize: "12px",
//             color: "#666",
//           }}
//         >
//           Loading photos...
//         </div>
//       )}

//       {/* Custom Travel Info Panel */}
//       {locationInfo && (
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             backgroundColor: "#F9FAFB",
//             padding: "12px 16px",
//             gap: "12px",
//             borderTop: photoUris.length > 0 || photosLoading ? "none" : "1px solid #E0E0E0",
//             overflowX: "auto",
//             whiteSpace: "nowrap",
//             scrollbarWidth: "thin",
//             cursor: "pointer"
//           }}
//           onClick={() => setIsDetailedView(false)}
//         >
//           <InfoBox
//             label="User 1"
//             time={travel_time_from_loc1_min}
//             distance={travel_distance_from_loc1_km}
//           />
//           <InfoBox
//             label="User 2"
//             time={travel_time_from_loc2_min}
//             distance={travel_distance_from_loc2_km}
//           />
//         </div>
//       )}
//     </div>
//   );
// };
// // Reusable Info Box Component
// const InfoBox = ({ label, time, distance }) => (
//   <div
//     style={{
//       fontSize: "13px",
//       padding: "8px 12px",
//       borderRadius: "8px",
//       backgroundColor: "#E8F0FE",
//       color: "#1A1A1A",
//       display: "inline-flex",
//       flexDirection: "row",
//       minWidth: "140px",
//       gap: "8px",
//       marginRight: "8px"
//     }}
//   >
//     <strong style={{ fontSize: "13px", marginRight: "4px" }}>{label}</strong>
//     <div>
//       {time ? `${time}min` : ""}{distance !== undefined ? ` – ${distance} km` : ""}
//     </div>
//   </div>
// );
// export default GooglePlaceCardCompact;

// import React, { useEffect, useRef, useState } from "react";

// const GooglePlacesCardCompact = ({ placeId, locationInfo, setIsDetailedView }) => {
//   const ref = useRef(null);
//   const [photoUris, setPhotoUris] = useState([]);
//   const [photosLoading, setPhotosLoading] = useState(false);
//   const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
//   const [reviews, setReviews] = useState([]);
//   const [reviewsLoading, setReviewsLoading] = useState(false);

//   const {
//     travel_time_from_loc1_min,
//     travel_time_from_loc2_min,
//     travel_distance_from_loc1_km,
//     travel_distance_from_loc2_km,
//   } = locationInfo || {};

//   // Fetch Place Photos
//   useEffect(() => {
//     const fetchPlacePhotos = async () => {
//       if (!window.google || !placeId) return;
//       setPhotosLoading(true);
//       try {
//         const { Place } = await window.google.maps.importLibrary("places");
//         const place = new Place({ id: placeId });

//         await place.fetchFields({ fields: ["photos"] });

//         if (place.photos && place.photos.length > 0) {
//           const photoData = place.photos.slice(0, 10).map((photo) => ({
//             thumbnail: photo.getURI({ maxHeight: 120, maxWidth: 120 }),
//             fullSize: photo.getURI({ maxHeight: 400, maxWidth: 600 }),
//             attributions: photo.authorAttributions,
//           }));
//           setPhotoUris(photoData);
//         } else {
//           setPhotoUris([]);
//         }
//       } catch (error) {
//         console.error("Error fetching place photos:", error);
//         setPhotoUris([]);
//       } finally {
//         setPhotosLoading(false);
//       }
//     };
//     fetchPlacePhotos();
//   }, [placeId]);

//   // Fetch Place Reviews
//   useEffect(() => {
//     const fetchPlaceReviews = async () => {
//       if (!window.google || !placeId) return;
//       setReviewsLoading(true);
//       try {
//         const { Place } = await window.google.maps.importLibrary("places");
//         const place = new Place({ id: placeId });

//         await place.fetchFields({ fields: ["reviews"] });

//       if (place.reviews && place.reviews.length > 0) {
//         const mappedReviews = place.reviews.slice(0, 5).map((r) => ({
//             rating: r.rating,
//             text: r.text.length > 80 ? r.text.slice(0, 80) + "…" : r.text,
//             author: r.authorAttribution?.displayName || "Anonymous",
//             photo: r.authorAttribution?.photoURI || null,
//             profileUrl: r.authorAttribution?.uri || "#",
//           }));
//           setReviews(mappedReviews);
//         } else {
//           setReviews([]);
//         }
//       } catch (error) {
//         console.error("Error fetching place reviews:", error);
//         setReviews([]);
//       } finally {
//         setReviewsLoading(false);
//       }
//     };
//     fetchPlaceReviews();
//   }, [placeId]);

//   // Setup Google Place Card
//   useEffect(() => {
//     if (!ref.current || !placeId) return;
//     ref.current.innerHTML = "";

//     const request = document.createElement("gmp-place-details-place-request");
//     request.setAttribute("place", placeId);

//     const config = document.createElement("gmp-place-content-config");
//     const createElement = (tag, attrs = {}) => {
//       const el = document.createElement(tag);
//       for (const [key, val] of Object.entries(attrs)) {
//         el.setAttribute(key, val);
//       }
//       return el;
//     };

//     config.appendChild(createElement("gmp-place-rating"));
//     config.appendChild(createElement("gmp-place-type"));
//     config.appendChild(createElement("gmp-place-price"));
//     config.appendChild(createElement("gmp-place-open-now-status"));
//     config.appendChild(
//       createElement("gmp-place-attribution", {
//         "light-scheme-color": "gray",
//         "dark-scheme-color": "white",
//       })
//     );

//     ref.current.appendChild(request);
//     ref.current.appendChild(config);
//   }, [placeId]);

//   if (!placeId) return null;

//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: 520,
//         borderRadius: "12px",
//         boxShadow: "0 4px 16px rgba(0, 0, 0, 0.09)",
//         overflow: "hidden",
//         backgroundColor: "#FFFFFF",
//         marginBottom: "2rem",
//         fontFamily: "Roboto, Arial, sans-serif",
//         color: "#000",
//       }}
//       className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
//     >
//       {/* Google Place Card */}
//       <div onClick={() => setIsDetailedView(false)}>
//         <gmp-place-details
//           ref={ref}
//           truncation-preferred
//           style={{
//             width: "100%",
//             display: "block",
//             "--gmp-mat-color-surface": "#FFFFFF",
//             "--gmp-mat-color-on-surface": "#000000",
//             "--gmp-mat-color-primary": "#4285F4",
//             "--gmp-mat-color-outline-decorative": "#E0E0E0",
//             "--gmp-header-visibility": "none",
//             "--gmp-footer-visibility": "none",
//             fontSize: "14px",
//             cursor: "pointer",
//           }}
//         />
//       </div>

//       {/* Horizontal Photo Gallery */}
//       {photoUris.length > 0 && (
//         <div style={{ backgroundColor: "#F9FAFB", borderTop: "1px solid #E0E0E0" }}>
//           <div
//             className="hide-scrollbar"
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               overflowX: "auto",
//               gap: "8px",
//               padding: "12px 16px 8px 16px",
//               scrollBehavior: "smooth",
//             }}
//           >
//             {photoUris.map((photo, index) => (
//               <img
//                 key={index}
//                 src={photo.thumbnail}
//                 alt={`Place photo ${index + 1}`}
//                 style={{
//                   minWidth: "80px",
//                   width: "80px",
//                   height: "80px",
//                   objectFit: "cover",
//                   borderRadius: "8px",
//                   cursor: "pointer",
//                   border:
//                     selectedPhotoIndex === index
//                       ? "2px solid #4285F4"
//                       : "2px solid transparent",
//                 }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setSelectedPhotoIndex(index);
//                 }}
//                 onError={(e) => (e.target.style.display = "none")}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Reviews */}
//       {reviewsLoading ? (
//         <div
//           style={{
//             padding: "12px 16px",
//             fontSize: "13px",
//             color: "#666",
//             background: "#F9FAFB",
//             borderTop: "1px solid #E0E0E0",
//           }}
//         >
//           Loading reviews…
//         </div>
//       ) : reviews.length > 0 ? (
//         <div
//           className="hide-scrollbar"
//           style={{
//             backgroundColor: "#F9FAFB",
//             borderTop: "1px solid #E0E0E0",
//             padding: "12px 16px",
//             overflowX: "auto",
//             display: "flex",
//             gap: "12px",
//             whiteSpace: "nowrap",
//           }}
//         >
//           {reviews.map((r, idx) => (
//             <div
//               key={idx}
//               style={{
//                 minWidth: "220px",
//                 maxWidth: "260px",
//                 background: "#fff",
//                 border: "1px solid #E0E0E0",
//                 borderRadius: "8px",
//                 padding: "8px 12px",
//                 boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//                 fontSize: "13px",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "nowrap",
//               }}
//               title={r.text}
//             >
//               {/* Author with profile link */}
//               <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
//                 {r.photo && (
//                   <img
//                     src={r.photo}
//                     alt={r.author}
//                     style={{
//                       width: "24px",
//                       height: "24px",
//                       borderRadius: "50%",
//                       marginRight: "8px",
//                     }}
//                   />
//                 )}
//                 <a
//                   href={r.profileUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   style={{ fontWeight: "500", fontSize: "12px", color: "#1a73e8" }}
//                 >
//                   {r.author}
//                 </a>
//               </div>
//               {/* Rating + text */}
//               <span style={{ color: "#fbbc04", marginRight: "6px" }}>★ {r.rating}</span>
//               {r.text}
//             </div>
//           ))}
//         </div>
//       ) : null}

//       {/* Custom Travel Info Panel (User 1 & User 2) */}
//       {locationInfo && (
//         <div
//           className="hide-scrollbar"
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             backgroundColor: "#F9FAFB",
//             padding: "12px 16px",
//             gap: "12px",
//             borderTop:
//               photoUris.length > 0 || reviews.length > 0 || photosLoading || reviewsLoading
//                 ? "none"
//                 : "1px solid #E0E0E0",
//             overflowX: "auto",
//             whiteSpace: "nowrap",
//             cursor: "pointer",
//           }}
//           onClick={() => setIsDetailedView(false)}
//         >
//           <InfoBox
//             label="User 1"
//             time={travel_time_from_loc1_min}
//             distance={travel_distance_from_loc1_km}
//           />
//           <InfoBox
//             label="User 2"
//             time={travel_time_from_loc2_min}
//             distance={travel_distance_from_loc2_km}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// // Reusable Info Box Component
// const InfoBox = ({ label, time, distance }) => (
//   <div
//     style={{
//       fontSize: "13px",
//       padding: "8px 12px",
//       borderRadius: "8px",
//       backgroundColor: "#E8F0FE",
//       color: "#1A1A1A",
//       display: "inline-flex",
//       flexDirection: "row",
//       minWidth: "140px",
//       gap: "8px",
//       marginRight: "8px",
//     }}
//   >
//     <strong style={{ fontSize: "13px", marginRight: "4px" }}>{label}</strong>
//     <div>
//       {time ? `${time}min` : ""}
//       {distance !== undefined ? ` – ${distance} km` : ""}
//     </div>
//   </div>
// );

// export default GooglePlacesCardCompact;

// import React, { useEffect, useRef, useState } from "react";

// const GooglePlacesCardCompact = ({ placeId, locationInfo, setIsDetailedView }) => {
//   const ref = useRef(null);
//   const [photoUris, setPhotoUris] = useState([]);
//   const [photosLoading, setPhotosLoading] = useState(false);
//   const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
//   const [reviews, setReviews] = useState([]);
//   const [reviewsLoading, setReviewsLoading] = useState(false);

//   const {
//     travel_time_from_loc1_min,
//     travel_time_from_loc2_min,
//     travel_distance_from_loc1_km,
//     travel_distance_from_loc2_km,
//   } = locationInfo || {};

//   // Fetch Place Photos
//   useEffect(() => {
//     const fetchPlacePhotos = async () => {
//       if (!window.google || !placeId) return;
//       setPhotosLoading(true);
//       try {
//         const { Place } = await window.google.maps.importLibrary("places");
//         const place = new Place({ id: placeId });

//         await place.fetchFields({ fields: ["photos"] });

//         if (place.photos && place.photos.length > 0) {
//           const photoData = place.photos.slice(0, 10).map((photo) => ({
//             thumbnail: photo.getURI({ maxHeight: 120, maxWidth: 120 }),
//             fullSize: photo.getURI({ maxHeight: 400, maxWidth: 600 }),
//             attributions: photo.authorAttributions,
//           }));
//           setPhotoUris(photoData);
//         } else {
//           setPhotoUris([]);
//         }
//       } catch (error) {
//         console.error("Error fetching place photos:", error);
//         setPhotoUris([]);
//       } finally {
//         setPhotosLoading(false);
//       }
//     };
//     fetchPlacePhotos();
//   }, [placeId]);

//   // Fetch Place Reviews
//   useEffect(() => {
//     const fetchPlaceReviews = async () => {
//       if (!window.google || !placeId) return;
//       setReviewsLoading(true);
//       try {
//         const { Place } = await window.google.maps.importLibrary("places");
//         const place = new Place({ id: placeId });

//         await place.fetchFields({ fields: ["reviews"] });

//       if (place.reviews && place.reviews.length > 0) {
//         const mappedReviews = place.reviews.slice(0, 5).map((r) => ({
//             rating: r.rating,
//             text: r.text.length > 80 ? r.text.slice(0, 80) + "…" : r.text,
//             author: r.authorAttribution?.displayName || "Anonymous",
//             photo: r.authorAttribution?.photoURI || null,
//             profileUrl: r.authorAttribution?.uri || "#",
//           }));
//           setReviews(mappedReviews);
//         } else {
//           setReviews([]);
//         }
//       } catch (error) {
//         console.error("Error fetching place reviews:", error);
//         setReviews([]);
//       } finally {
//         setReviewsLoading(false);
//       }
//     };
//     fetchPlaceReviews();
//   }, [placeId]);

//   // Setup Google Place Card
//   useEffect(() => {
//     if (!ref.current || !placeId) return;
//     ref.current.innerHTML = "";

//     const request = document.createElement("gmp-place-details-place-request");
//     request.setAttribute("place", placeId);

//     const config = document.createElement("gmp-place-content-config");
//     const createElement = (tag, attrs = {}) => {
//       const el = document.createElement(tag);
//       for (const [key, val] of Object.entries(attrs)) {
//         el.setAttribute(key, val);
//       }
//       return el;
//     };

//     config.appendChild(createElement("gmp-place-rating"));
//     config.appendChild(createElement("gmp-place-type"));
//     config.appendChild(createElement("gmp-place-price"));
//     config.appendChild(createElement("gmp-place-open-now-status"));
//     config.appendChild(
//       createElement("gmp-place-attribution", {
//         "light-scheme-color": "gray",
//         "dark-scheme-color": "white",
//       })
//     );

//     ref.current.appendChild(request);
//     ref.current.appendChild(config);
//   }, [placeId]);

//   if (!placeId) return null;

//   // Add DM Sans font
//   useEffect(() => {
//     const link = document.createElement('link');
//     link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap';
//     link.rel = 'stylesheet';
//     document.head.appendChild(link);
//     return () => {
//       document.head.removeChild(link);
//     };
//   }, []);

//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: 450,
//         borderRadius: "16px",
//         boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
//         overflow: "hidden",
//         backgroundColor: "#FFFFFF",
//         marginBottom: "1.5rem",
//         fontFamily: "'DM Sans', sans-serif",
//         color: "#000",
//       }}
//       className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
//     >
//       {/* Google Place Card with Figma Styling */}
//       <div onClick={() => setIsDetailedView(false)}>
//         <gmp-place-details
//           ref={ref}
//           truncation-preferred
//           style={{
//             width: "100%",
//             display: "block",
//             padding: "16px",
//             paddingTop: "12px",
//             "--gmp-mat-color-surface": "#FFFFFF",
//             "--gmp-mat-color-on-surface": "#474747",
//             "--gmp-mat-color-primary": "#4285F4",
//             "--gmp-mat-color-outline-decorative": "#E0E0E0",
//             "--gmp-header-visibility": "none",
//             "--gmp-footer-visibility": "none",
//             fontSize: "14px",
//             cursor: "pointer",
//           }}
//         />
//         <style>{`
//           gmp-place-details {
//             font-family: 'DM Sans', sans-serif !important;
//           }
//           gmp-place-details [slot="headline"] {
//             font-family: 'DM Sans', sans-serif !important;
//             font-weight: 600 !important;
//             font-size: 14px !important;
//             line-height: 21px !important;
//             letter-spacing: 0 !important;
//             color: #474747 !important;
//             width: 255px !important;
//             height: 21px !important;
//           }
//           gmp-place-details gmp-place-rating {
//             width: 158px !important;
//             height: 21px !important;
//             gap: 12px !important;
//             margin-top: 4px !important;
//           }
//           gmp-place-details gmp-place-type {
//             font-family: 'DM Sans', sans-serif !important;
//             font-weight: 400 !important;
//             font-size: 12px !important;
//             line-height: 15.6px !important;
//             letter-spacing: 0 !important;
//             color: #777777 !important;
//             width: 167px !important;
//             height: 16px !important;
//             gap: 12px !important;
//           }
//           gmp-place-details gmp-place-open-now-status {
//             font-family: 'DM Sans', sans-serif !important;
//             font-weight: 400 !important;
//             font-size: 12px !important;
//             line-height: 15.6px !important;
//             letter-spacing: 0 !important;
//             width: 57px !important;
//             height: 16px !important;
//           }
//           gmp-place-details gmp-place-price {
//             font-family: 'DM Sans', sans-serif !important;
//             font-weight: 500 !important;
//             font-size: 12px !important;
//             line-height: 15.6px !important;
//             letter-spacing: 0 !important;
//             width: 65px !important;
//             height: 16px !important;
//           }
//           gmp-place-details .content-container {
//             gap: 8px !important;
//           }
//         `}</style>
//       </div>

//       {/* Horizontal Photo Gallery */}
//       {photoUris.length > 0 && (
//         <div style={{ backgroundColor: "#FAFBFC", borderTop: "1px solid #EAEAEA" }}>
//           <div
//             className="hide-scrollbar"
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               overflowX: "auto",
//               gap: "8px",
//               padding: "12px 16px",
//               scrollBehavior: "smooth",
//             }}
//           >
//             {photoUris.map((photo, index) => (
//               <img
//                 key={index}
//                 src={photo.thumbnail}
//                 alt={`Place photo ${index + 1}`}
//                 style={{
//                   minWidth: "100px",
//                   width: "100px",
//                   height: "100px",
//                   objectFit: "cover",
//                   borderRadius: "8px",
//                   cursor: "pointer",
//                   border:
//                     selectedPhotoIndex === index
//                       ? "2px solid #4285F4"
//                       : "2px solid transparent",
//                 }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setSelectedPhotoIndex(index);
//                 }}
//                 onError={(e) => (e.target.style.display = "none")}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Reviews Section*/}
//       {reviewsLoading ? (
//         <div
//           style={{
//             padding: "12px 16px",
//             fontSize: "12px",
//             fontFamily: "'DM Sans', sans-serif",
//             color: "#777777",
//             background: "#FAFBFC",
//             borderTop: "1px solid #EAEAEA",
//           }}
//         >
//           Loading reviews…
//         </div>
//       ) : reviews.length > 0 ? (
//         <div
//           className="hide-scrollbar"
//           style={{
//             backgroundColor: "#FAFBFC",
//             borderTop: "1px solid #EAEAEA",
//             padding: "12px 16px",
//             overflowX: "auto",
//             display: "flex",
//             gap: "8px",
//             whiteSpace: "nowrap",
//           }}
//         >
//           {reviews.map((r, idx) => (
//             <div
//               key={idx}
//               style={{
//                 minWidth: "240px",
//                 maxWidth: "280px",
//                 background: "#fff",
//                 border: "1px solid #EAEAEA",
//                 borderRadius: "8px",
//                 padding: "10px 12px",
//                 boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                 fontSize: "12px",
//                 fontFamily: "'DM Sans', sans-serif",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "nowrap",
//                 width: "322px",
//                 minHeight: "32px",
//                 gap: "4px",
//               }}
//               title={r.text}
//             >
//               {/* Author with profile link */}
//               <div style={{ 
//                 display: "flex", 
//                 alignItems: "center", 
//                 marginBottom: "6px",
//                 gap: "8px"
//               }}>
//                 {r.photo && (
//                   <img
//                     src={r.photo}
//                     alt={r.author}
//                     style={{
//                       width: "24px",
//                       height: "24px",
//                       borderRadius: "50%",
//                     }}
//                   />
//                 )}
//                 <a
//                   href={r.profileUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   style={{ 
//                     fontWeight: "500", 
//                     fontSize: "12px", 
//                     color: "#1a73e8",
//                     fontFamily: "'DM Sans', sans-serif",
//                     textDecoration: "none"
//                   }}
//                 >
//                   {r.author}
//                 </a>
//               </div>
//               {/* Rating + text */}
//               <div style={{ 
//                 fontSize: "12px",
//                 lineHeight: "15.6px",
//                 fontFamily: "'DM Sans', sans-serif",
//                 color: "#474747"
//               }}>
//                 <span style={{ color: "#fbbc04", marginRight: "6px" }}>★ {r.rating}</span>
//                 {r.text}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : null}

//       {/* Custom Travel Info Panel (User 1 & User 2) */}
//       {locationInfo && (
//         <div
//           className="hide-scrollbar"
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             backgroundColor: "#FAFBFC",
//             padding: "12px 16px",
//             gap: "12px",
//             borderTop:
//               photoUris.length > 0 || reviews.length > 0 || photosLoading || reviewsLoading
//                 ? "none"
//                 : "1px solid #EAEAEA",
//             overflowX: "auto",
//             whiteSpace: "nowrap",
//             cursor: "pointer",
//           }}
//           onClick={() => setIsDetailedView(false)}
//         >
//           <InfoBox
//             label="User 1"
//             time={travel_time_from_loc1_min}
//             distance={travel_distance_from_loc1_km}
//           />
//           <InfoBox
//             label="User 2"
//             time={travel_time_from_loc2_min}
//             distance={travel_distance_from_loc2_km}
//           />
//         </div>
//       )}

//       <style>{`
//         .hide-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//         .hide-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </div>
//   );
// };

// // Reusable Info Box Component
// const InfoBox = ({ label, time, distance }) => (
//   <div
//     style={{
//       fontSize: "12px",
//       fontFamily: "'DM Sans', sans-serif",
//       fontWeight: "400",
//       padding: "8px 12px",
//       borderRadius: "8px",
//       backgroundColor: "#F0F6FF",
//       color: "#474747",
//       display: "inline-flex",
//       flexDirection: "row",
//       minWidth: "140px",
//       gap: "8px",
//       alignItems: "center",
//     }}
//   >
//     <strong style={{ 
//       fontSize: "12px", 
//       fontWeight: "600",
//       fontFamily: "'DM Sans', sans-serif",
//       marginRight: "4px",
//       color: "#474747"
//     }}>{label}</strong>
//     <div style={{
//       fontSize: "12px",
//       fontWeight: "400",
//       fontFamily: "'DM Sans', sans-serif",
//       color: "#474747"
//     }}>
//       {time ? `${time}min` : ""}
//       {distance !== undefined ? ` – ${distance} km` : ""}
//     </div>
//   </div>
// );

// export default GooglePlacesCardCompact;

import React, { useEffect, useRef, useState } from "react";

const GooglePlacesCardCompact = ({ placeId, locationInfo, setIsDetailedView }) => {
  const ref = useRef(null);
  const [photoUris, setPhotoUris] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [placeData, setPlaceData] = useState(null);

  const {
    travel_time_from_loc1_min,
    travel_time_from_loc2_min,
    travel_distance_from_loc1_km,
    travel_distance_from_loc2_km,
  } = locationInfo || {};

  // Fetch Place Data including photos, reviews, and details
  useEffect(() => {
    if (!window.google || !placeId) return;
    
    setPhotosLoading(true);
    
    const tempDiv = document.createElement('div');
    const service = new window.google.maps.places.PlacesService(tempDiv);
    
    service.getDetails(
      {
        placeId: placeId,
        fields: ['name', 'rating', 'user_ratings_total', 'price_level', 'types', 'opening_hours', 'photos', 'reviews', 'editorial_summary', 'wheelchair_accessible_entrance']
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlaceData(place);
          
          // Process photos
          if (place?.photos) {
            const photoData = place.photos.slice(0, 10).map((photo) => ({
              thumbnail: photo.getUrl({ maxHeight: 150, maxWidth: 150 }),
              fullSize: photo.getUrl({ maxHeight: 400, maxWidth: 600 }),
            }));
            setPhotoUris(photoData);
          } else {
            setPhotoUris([]);
          }
        } else {
          console.log("Error fetching place details:", status);
        }
        setPhotosLoading(false);
      }
    );
  }, [placeId]);

  if (!placeId) return null;

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  // Helper functions
  const getPriceLevel = (level) => {
    if (!level) return '';
    return '₹'.repeat(level);
  };

  const getPlaceType = (types) => {
    if (!types || types.length === 0) return '';
    // Filter out generic types and return the most specific one
    const specificTypes = types.filter(t => !['point_of_interest', 'establishment'].includes(t));
    if (specificTypes.length > 0) {
      return specificTypes[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return '';
  };

  const getOpenStatus = (openingHours) => {
    if (!openingHours) return null;
    const isOpen = openingHours.isOpen?.();
    if (isOpen === undefined) return null;
    
    // Get current day's hours
    const now = new Date();
    const dayOfWeek = now.getDay();
    const periods = openingHours.periods;
    
    if (periods && periods.length > 0) {
      const todayPeriod = periods.find(p => p.open.day === dayOfWeek);
      if (todayPeriod && todayPeriod.close) {
        const closeTime = todayPeriod.close.time;
        const hours = closeTime.substring(0, 2);
        const minutes = closeTime.substring(2);
        const formattedTime = `${parseInt(hours) % 12 || 12}:${minutes} ${parseInt(hours) >= 12 ? 'pm' : 'am'}`;
        return {
          isOpen,
          closeTime: formattedTime
        };
      }
    }
    
    return { isOpen };
  };

  const openStatus = placeData?.opening_hours ? getOpenStatus(placeData.opening_hours) : null;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        borderRadius: "16px",
        boxShadow: "0 1px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        marginBottom: "0.75rem",
        fontFamily: "'Roboto', sans-serif",
        color: "#000",
      }}
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => setIsDetailedView(false)}
    >
      {/* Venue Name and Travel Time Grid */}
      <div style={{ padding: "12px 12px 6px 12px" }}>
        {/* Venue Name and Rating on Same Line */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "6px",
        }}>
          <h2 style={{
            fontSize: "15px",
            fontWeight: "500",
            color: "#202124",
            margin: 0,
            lineHeight: "20px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
            minWidth: 0,
          }}>
            {placeData?.name || "Loading..."}
          </h2>
          
          {/* Rating inline with name */}
          {placeData?.rating && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
              fontSize: "12px",
              color: "#70757a",
              flexShrink: 0,
            }}>
              <span style={{ fontWeight: "500", color: "#202124" }}>{placeData.rating}</span>
              <span style={{ color: "#fbbc04", fontSize: "11px" }}>★</span>
              {placeData?.user_ratings_total && (
                <span>({placeData.user_ratings_total})</span>
              )}
            </div>
          )}
        </div>

        {/* Single-Line Travel Time Display */}
     

        {/* Open/Closed Status */}
        {openStatus && (
          <div style={{
            fontSize: "12px",
            color: openStatus.isOpen ? "#188038" : "#d93025",
            fontWeight: "500",
          }}>
            {openStatus.isOpen ? "Open" : "Closed"}
            {openStatus.closeTime && openStatus.isOpen && (
              <span style={{ color: "#70757a", fontWeight: "400" }}>
                {" "}· Closes {openStatus.closeTime}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Photo Gallery */}
      {photoUris.length > 0 && (
        <div style={{ padding: "0 12px 8px 12px" }}>
          <div
            className="hide-scrollbar"
            style={{
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              scrollBehavior: "smooth",
            }}
          >
            {photoUris.slice(0, 5).map((photo, index) => (
              <img
                key={index}
                src={photo.thumbnail}
                alt={`Photo ${index + 1}`}
                style={{
                  minWidth: "100px",
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex(index);
                }}
                onError={(e) => (e.target.style.display = "none")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            ))}
          </div>
        </div>
      )}

    

      {/* Reviews Section */}
      {placeData?.reviews && placeData.reviews.length > 0 && (
        <div style={{
          padding: "0 12px 8px 12px",
        }}>
          <div
            className="hide-scrollbar"
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              scrollBehavior: "smooth",
            }}
          >
            {placeData.reviews.slice(0, 5).map((review, index) => (
              <div
                key={index}
                style={{
                  minWidth: "260px",
                  maxWidth: "260px",
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  border: "1px solid #e8eaed",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Reviewer Info */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}>
                  {review.profile_photo_url ? (
                    <img
                      src={review.profile_photo_url}
                      alt={review.author_name}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        objectFit: "cover",
                        backgroundColor: "#e8eaed",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  {/* Fallback Avatar */}
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: "#e8eaed",
                    display: review.profile_photo_url ? "none" : "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "12px",
                    color: "#5f6368",
                    fontWeight: "500",
                  }}>
                    {review.author_name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#202124",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {review.author_name}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                {/* <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                  marginBottom: "6px",
                }}>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      style={{
                        color: i < review.rating ? "#fbbc04" : "#e8eaed",
                        fontSize: "12px",
                      }}
                    >
                      ★
                    </span>
                  ))}
                  <span style={{
                    fontSize: "11px",
                    color: "#70757a",
                    marginLeft: "4px",
                  }}>
                    {review.relative_time_description}
                  </span>
                </div> */}

                {/* Review Text */}
                <div style={{
                  fontSize: "12px",
                  color: "#3c4043",
                  lineHeight: "16px",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  {review.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      

      {/* Action Buttons */}
      <div style={{
        display: "flex",
        gap: "6px",
        padding: "6px 12px 12px 12px",
        borderTop: "1px solid #e8eaed",
        overflowX: "auto",
      }}
      className="hide-scrollbar"
      >
           {locationInfo && (
          <div style={{
            display: "flex",
            gap: "6px",
            marginBottom: "6px",
            fontSize: "11px",
            width: "100%",
          }}>
            {/* Person A */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 8px",
              backgroundColor: "#e8f0fe",
              borderRadius: "4px",
              flex: 1,
              minWidth: "fit-content",
            }}>
              <span style={{ 
                fontWeight: "600", 
                color: "#1a73e8",
                fontSize: "10px",
              }}>Person A:</span>
              <span style={{ color: "#5f6368" }}>🕐</span>
              <span style={{ fontWeight: "500", color: "#202124" }}>
                {travel_time_from_loc1_min ? `${travel_time_from_loc1_min}m` : "N/A"}
              </span>
              <span style={{ color: "#70757a" }}>•</span>
              <span style={{ color: "#5f6368" }}>📍</span>
              <span style={{ color: "#5f6368" }}>
                {travel_distance_from_loc1_km ? `${travel_distance_from_loc1_km}km` : "N/A"}
              </span>
            </div>

            {/* Person B */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 8px",
              backgroundColor: "#fce8e6",
              borderRadius: "4px",
              flex: 1,
              minWidth: "fit-content",
            }}>
              <span style={{ 
                fontWeight: "600", 
                color: "#ea4335",
                fontSize: "10px",
              }}>Person B:</span>
              <span style={{ color: "#5f6368" }}>🕐</span>
              <span style={{ fontWeight: "500", color: "#202124" }}>
                {travel_time_from_loc2_min ? `${travel_time_from_loc2_min}m` : "N/A"}
              </span>
              <span style={{ color: "#70757a" }}>•</span>
              <span style={{ color: "#5f6368" }}>📍</span>
              <span style={{ color: "#5f6368" }}>
                {travel_distance_from_loc2_km ? `${travel_distance_from_loc2_km}km` : "N/A"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons - Separate Row */}
      <div style={{
        display: "flex",
        gap: "6px",
        padding: "0 12px 12px 12px",
        overflowX: "auto",
      }}
      className="hide-scrollbar"
      >
        <ActionButton icon="🧭" label="Directions" />
        <ActionButton icon="🚕" label="Book Cab" />
        <ActionButton icon="📅" label="Reserve" />
        <ActionButton icon="📋" label="Menu" />
        <ActionButton icon="📞" label="Call" />
        <ActionButton icon="↗" label="Share" />
      </div>

      {/* Styles */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

// Action Button Component
const ActionButton = ({ icon, label }) => (
  <button
    style={{
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "6px 12px",
      backgroundColor: "#e8f0fe",
      border: "none",
      borderRadius: "16px",
      fontSize: "12px",
      fontWeight: "500",
      color: "#1a73e8",
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "background-color 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "#d2e3fc";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "#e8f0fe";
    }}
    onClick={(e) => {
      e.stopPropagation();
    }}
  >
    <span style={{ fontSize: "14px" }}>{icon}</span>
    <span>{label}</span>
  </button>
);

// Travel Time Card Component
const TravelTimeCard = ({ label, time, distance, color }) => (
  <div
    style={{
      flex: 1,
      padding: "8px 10px",
      backgroundColor: "#f8f9fa",
      borderRadius: "6px",
      border: `1px solid #e8eaed`,
    }}
  >
    <div style={{
      fontSize: "10px",
      fontWeight: "500",
      color: "#70757a",
      marginBottom: "3px",
      textTransform: "uppercase",
      letterSpacing: "0.3px",
    }}>
      {label}
    </div>
    <div style={{
      fontSize: "13px",
      fontWeight: "500",
      color: color,
    }}>
      {time ? `${time} min` : "N/A"}
    </div>
    {distance !== undefined && (
      <div style={{
        fontSize: "10px",
        color: "#70757a",
        marginTop: "1px",
      }}>
        {distance} km
      </div>
    )}
  </div>
);

export default GooglePlacesCardCompact;


  // {/* AI Review Summary */}
  //     {locationInfo?.review_summary && (
  //       <div style={{
  //         padding: "0 12px 8px 12px",
  //       }}>
  //         <div style={{
  //           padding: "10px 12px",
  //           backgroundColor: "#f0f7ff",
  //           borderRadius: "8px",
  //           border: "1px solid #d2e3fc",
  //         }}>
  //           {/* Header with AI badge */}
  //           <div style={{
  //             display: "flex",
  //             alignItems: "center",
  //             gap: "6px",
  //             marginBottom: "6px",
  //           }}>
  //             <span style={{ fontSize: "14px" }}>✨</span>
  //             <span style={{
  //               fontSize: "11px",
  //               fontWeight: "600",
  //               color: "#1a73e8",
  //               textTransform: "uppercase",
  //               letterSpacing: "0.5px",
  //             }}>
  //               AI Summary
  //             </span>
  //           </div>
  //           {/* Summary text */}
  //           <div style={{
  //             fontSize: "12px",
  //             color: "#3c4043",
  //             lineHeight: "18px",
  //             fontStyle: "italic",
  //           }}>
  //             {locationInfo.review_summary}
  //           </div>
  //         </div>
  //       </div>
  //     )}