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
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const {
    travel_time_from_loc1_min,
    travel_time_from_loc2_min,
    travel_distance_from_loc1_km,
    travel_distance_from_loc2_km,
  } = locationInfo || {};

  // Fetch Place Photos using legacy PlacesService
  useEffect(() => {
    if (!window.google || !placeId) return;
    
    setPhotosLoading(true);
    
    // Create a temporary div for PlacesService (required by the API)
    const tempDiv = document.createElement('div');
    const service = new window.google.maps.places.PlacesService(tempDiv);
    
    service.getDetails(
      {
        placeId: placeId,
        fields: ['photos']
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.photos) {
          const photoData = place.photos.slice(0, 10).map((photo) => ({
            thumbnail: photo.getUrl({ maxHeight: 120, maxWidth: 120 }),
            fullSize: photo.getUrl({ maxHeight: 400, maxWidth: 600 }),
          }));
          setPhotoUris(photoData);
        } else {
          console.log("No photos available or error:", status);
          setPhotoUris([]);
        }
        setPhotosLoading(false);
      }
    );
  }, [placeId]);

  // Fetch Place Reviews using legacy PlacesService
  useEffect(() => {
    if (!window.google || !placeId) return;
    
    setReviewsLoading(true);
    
    // Create a temporary div for PlacesService (required by the API)
    const tempDiv = document.createElement('div');
    const service = new window.google.maps.places.PlacesService(tempDiv);
    
    service.getDetails(
      {
        placeId: placeId,
        fields: ['reviews']
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.reviews && place.reviews.length > 0) {
          const mappedReviews = place.reviews.slice(0, 5).map((r) => ({
            rating: r.rating,
            text: r.text && r.text.length > 80 ? r.text.slice(0, 80) + "…" : (r.text || ""),
            author: r.author_name || "Anonymous",
            photo: r.profile_photo_url || null,
            profileUrl: r.author_url || "#",
          }));
          setReviews(mappedReviews);
        } else {
          console.log("No reviews available or error:", status);
          setReviews([]);
        }
        setReviewsLoading(false);
      }
    );
  }, [placeId]);

  // Setup Google Place Card
  useEffect(() => {
    if (!ref.current || !placeId) return;
    ref.current.innerHTML = "";

    const request = document.createElement("gmp-place-details-place-request");
    request.setAttribute("place", placeId);

    const config = document.createElement("gmp-place-content-config");
    const createElement = (tag, attrs = {}) => {
      const el = document.createElement(tag);
      for (const [key, val] of Object.entries(attrs)) {
        el.setAttribute(key, val);
      }
      return el;
    };

    config.appendChild(createElement("gmp-place-rating"));
    config.appendChild(createElement("gmp-place-type"));
    config.appendChild(createElement("gmp-place-price"));
    config.appendChild(createElement("gmp-place-open-now-status"));
    config.appendChild(
      createElement("gmp-place-attribution", {
        "light-scheme-color": "gray",
        "dark-scheme-color": "white",
      })
    );

    ref.current.appendChild(request);
    ref.current.appendChild(config);
  }, [placeId]);

  if (!placeId) return null;

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 450,
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        marginBottom: "1.5rem",
        fontFamily: "'DM Sans', sans-serif",
        color: "#000",
        transition: "all 0.3s ease",
      }}
      className="cursor-pointer hover:shadow-xl transition-shadow duration-300"
    >
      {/* Hero Image with Venue Name Overlay */}
      {photoUris.length > 0 ? (
        <div 
          style={{
            width: "100%",
            height: "250px",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#F5F5F5",
          }}
          onClick={() => setIsDetailedView(false)}
        >
          <img
            src={photoUris[selectedPhotoIndex]?.fullSize || photoUris[0]?.fullSize}
            alt="Venue"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          
          {/* Gradient Overlay */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "100px",
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
          }} />
          
          {/* Venue Name on Image - Hidden, will use Google's component */}
          <div style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            right: "16px",
            zIndex: 2,
          }}>
            <div 
              ref={ref}
              style={{
                color: "#FFFFFF",
                fontSize: "18px",
                fontWeight: "600",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                lineHeight: "1.3",
              }}
            />
          </div>
          
          {/* Photo counter badge */}
          {photoUris.length > 1 && (
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                color: "#FFFFFF",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600",
                fontFamily: "'DM Sans', sans-serif",
                backdropFilter: "blur(4px)",
              }}
            >
              {selectedPhotoIndex + 1} / {photoUris.length}
            </div>
          )}
        </div>
      ) : photosLoading ? (
        <div
          style={{
            width: "100%",
            height: "250px",
            backgroundColor: "#F5F5F5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            color: "#999",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Loading image...
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "180px",
            backgroundColor: "#F5F5F5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            color: "#999",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          No image available
        </div>
      )}

      {/* Card Content */}
      <div style={{ padding: "20px" }}>
        {/* Venue Name (from Google component - positioned absolutely on image) */}
        <div style={{ display: "none" }}>
          <gmp-place-details
            ref={ref}
            truncation-preferred
            style={{
              width: "100%",
              display: "block",
            }}
          />
        </div>

        {/* Rating, Type, Price, Status Row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "16px",
        }}>
          {/* We'll use a custom layout but keep Google's component hidden for data */}
          <div 
            onClick={() => setIsDetailedView(false)}
            style={{
              width: "100%",
            }}
          >
            <gmp-place-details
              truncation-preferred
              style={{
                width: "100%",
                display: "block",
                "--gmp-mat-color-surface": "#FFFFFF",
                "--gmp-mat-color-on-surface": "#474747",
                "--gmp-mat-color-primary": "#4285F4",
                "--gmp-header-visibility": "none",
                "--gmp-footer-visibility": "none",
                fontSize: "14px",
              }}
            />
          </div>
        </div>

        {/* Travel Time Cards */}
        {locationInfo && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              onClick={() => setIsDetailedView(false)}
              style={{
                flex: 1,
                backgroundColor: "#E3F2FD",
                borderRadius: "12px",
                padding: "12px 14px",
                border: "1px solid #BBDEFB",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#BBDEFB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#E3F2FD";
              }}
            >
              <div style={{
                fontSize: "11px",
                fontWeight: "600",
                color: "#1976D2",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                User 1
              </div>
              <div style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#0D47A1",
              }}>
                {travel_time_from_loc1_min ? `${travel_time_from_loc1_min} min` : "N/A"}
              </div>
              <div style={{
                fontSize: "11px",
                color: "#1976D2",
                marginTop: "2px",
              }}>
                {travel_distance_from_loc1_km !== undefined ? `${travel_distance_from_loc1_km} km` : ""}
              </div>
            </div>

            <div
              onClick={() => setIsDetailedView(false)}
              style={{
                flex: 1,
                backgroundColor: "#F3E5F5",
                borderRadius: "12px",
                padding: "12px 14px",
                border: "1px solid #E1BEE7",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#E1BEE7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F3E5F5";
              }}
            >
              <div style={{
                fontSize: "11px",
                fontWeight: "600",
                color: "#7B1FA2",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                User 2
              </div>
              <div style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#4A148C",
              }}>
                {travel_time_from_loc2_min ? `${travel_time_from_loc2_min} min` : "N/A"}
              </div>
              <div style={{
                fontSize: "11px",
                color: "#7B1FA2",
                marginTop: "2px",
              }}>
                {travel_distance_from_loc2_km !== undefined ? `${travel_distance_from_loc2_km} km` : ""}
              </div>
            </div>
          </div>
        )}

        {/* Photo Gallery Thumbnails */}
        {photoUris.length > 1 && (
          <div style={{ marginBottom: "12px" }}>
            <div
              className="hide-scrollbar"
              style={{
                display: "flex",
                gap: "8px",
                overflowX: "auto",
                scrollBehavior: "smooth",
                paddingBottom: "4px",
              }}
            >
              {photoUris.map((photo, index) => (
                <img
                  key={index}
                  src={photo.thumbnail}
                  alt={`Photo ${index + 1}`}
                  style={{
                    minWidth: "70px",
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: selectedPhotoIndex === index
                      ? "3px solid #4285F4"
                      : "3px solid transparent",
                    transition: "all 0.2s ease",
                    opacity: selectedPhotoIndex === index ? 1 : 0.7,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex(index);
                  }}
                  onError={(e) => (e.target.style.display = "none")}
                  onMouseEnter={(e) => {
                    if (selectedPhotoIndex !== index) {
                      e.currentTarget.style.opacity = "1";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPhotoIndex !== index) {
                      e.currentTarget.style.opacity = "0.7";
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {reviewsLoading ? (
          <div
            style={{
              padding: "12px",
              fontSize: "12px",
              fontFamily: "'DM Sans', sans-serif",
              color: "#999",
              textAlign: "center",
              backgroundColor: "#F8F9FA",
              borderRadius: "8px",
            }}
          >
            Loading reviews...
          </div>
        ) : reviews.length > 0 ? (
          <div style={{ marginTop: "8px" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#5F6368",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Recent Reviews
            </div>
            <div
              className="hide-scrollbar"
              style={{
                display: "flex",
                gap: "10px",
                overflowX: "auto",
                paddingBottom: "4px",
              }}
            >
              {reviews.map((r, idx) => (
                <div
                  key={idx}
                  style={{
                    minWidth: "260px",
                    maxWidth: "300px",
                    background: "#F8F9FA",
                    border: "1px solid #E8EAED",
                    borderRadius: "10px",
                    padding: "12px",
                    fontSize: "12px",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  title={r.text}
                >
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px",
                    marginBottom: "6px",
                  }}>
                    {r.photo && (
                      <img
                        src={r.photo}
                        alt={r.author}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                    <a
                      href={r.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        fontWeight: "600", 
                        fontSize: "12px", 
                        color: "#1a73e8",
                        textDecoration: "none",
                        flex: 1,
                      }}
                    >
                      {r.author}
                    </a>
                    <span style={{ 
                      color: "#FBBC04", 
                      fontSize: "13px",
                      fontWeight: "600",
                    }}>
                      ★ {r.rating}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: "11px",
                    lineHeight: "16px",
                    color: "#5F6368",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}>
                    {r.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
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
        
        /* Hide Google Place Details component but extract venue name */
        gmp-place-details {
          font-family: 'DM Sans', sans-serif !important;
        }
        
        gmp-place-details [slot="headline"] {
          font-family: 'DM Sans', sans-serif !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          line-height: 22px !important;
          color: #202124 !important;
        }
        
        gmp-place-details gmp-place-rating {
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
        
        gmp-place-details gmp-place-type {
          font-family: 'DM Sans', sans-serif !important;
          font-size: 13px !important;
          color: #5F6368 !important;
        }
        
        gmp-place-details gmp-place-open-now-status {
          font-family: 'DM Sans', sans-serif !important;
          font-size: 12px !important;
        }
        
        gmp-place-details gmp-place-price {
          font-family: 'DM Sans', sans-serif !important;
          font-size: 13px !important;
          font-weight: 500 !important;
        }
      `}</style>
    </div>
  );
};

// Info Box Component 
const InfoBox = ({ label, time, distance }) => (
  <div
    style={{
      width: "190px",
      height: "37px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      borderRadius: "4px",
      border: "1px solid #E0E0E0",
      paddingTop: "8px",
      paddingRight: "24px",
      paddingBottom: "8px",
      paddingLeft: "24px",
      backgroundColor: "#FFFFFF"
    }}
  >
    <span style={{
      width: "39px",
      height: "21px",
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: "600",
      fontSize: "14px",
      lineHeight: "21px",
      color: "#000000",
      display: "flex",
      alignItems: "center"
    }}>
      {label}
    </span>
    <span style={{
      width: "95px",
      height: "21px",
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: "500",
      fontSize: "14px",
      lineHeight: "21px",
      color: "#777777",
      display: "flex",
      alignItems: "center"
    }}>
      {time ? `${time}min` : ""}{time && distance !== undefined ? " • " : ""}{distance !== undefined ? `${distance}km` : ""}
    </span>
  </div>
);

const UserInfoContainer = ({ user1Data, user2Data }) => (
  <div
    style={{
      width: "414px",
      height: "37px",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    }}
  >
    <InfoBox 
      label="User 1" 
      time={user1Data?.time} 
      distance={user1Data?.distance} 
    />
    <InfoBox 
      label="User 2" 
      time={user2Data?.time} 
      distance={user2Data?.distance} 
    />
  </div>
);

export default GooglePlacesCardCompact;