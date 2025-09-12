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

  // Fetch Place Photos
  useEffect(() => {
    const fetchPlacePhotos = async () => {
      if (!window.google || !placeId) return;
      setPhotosLoading(true);
      try {
        const { Place } = await window.google.maps.importLibrary("places");
        const place = new Place({ id: placeId });

        await place.fetchFields({ fields: ["photos"] });

        if (place.photos && place.photos.length > 0) {
          const photoData = place.photos.slice(0, 10).map((photo) => ({
            thumbnail: photo.getURI({ maxHeight: 120, maxWidth: 120 }),
            fullSize: photo.getURI({ maxHeight: 400, maxWidth: 600 }),
            attributions: photo.authorAttributions,
          }));
          setPhotoUris(photoData);
        } else {
          setPhotoUris([]);
        }
      } catch (error) {
        console.error("Error fetching place photos:", error);
        setPhotoUris([]);
      } finally {
        setPhotosLoading(false);
      }
    };
    fetchPlacePhotos();
  }, [placeId]);

  // Fetch Place Reviews
  useEffect(() => {
    const fetchPlaceReviews = async () => {
      if (!window.google || !placeId) return;
      setReviewsLoading(true);
      try {
        const { Place } = await window.google.maps.importLibrary("places");
        const place = new Place({ id: placeId });

        await place.fetchFields({ fields: ["reviews"] });

      if (place.reviews && place.reviews.length > 0) {
        const mappedReviews = place.reviews.slice(0, 5).map((r) => ({
            rating: r.rating,
            text: r.text.length > 80 ? r.text.slice(0, 80) + "…" : r.text,
            author: r.authorAttribution?.displayName || "Anonymous",
            photo: r.authorAttribution?.photoURI || null,
            profileUrl: r.authorAttribution?.uri || "#",
          }));
          setReviews(mappedReviews);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching place reviews:", error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchPlaceReviews();
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

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 520,
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.09)",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        marginBottom: "2rem",
        fontFamily: "Roboto, Arial, sans-serif",
        color: "#000",
      }}
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
    >
      {/* Google Place Card */}
      <div onClick={() => setIsDetailedView(false)}>
        <gmp-place-details
          ref={ref}
          truncation-preferred
          style={{
            width: "100%",
            display: "block",
            "--gmp-mat-color-surface": "#FFFFFF",
            "--gmp-mat-color-on-surface": "#000000",
            "--gmp-mat-color-primary": "#4285F4",
            "--gmp-mat-color-outline-decorative": "#E0E0E0",
            "--gmp-header-visibility": "none",
            "--gmp-footer-visibility": "none",
            fontSize: "14px",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Horizontal Photo Gallery */}
      {photoUris.length > 0 && (
        <div style={{ backgroundColor: "#F9FAFB", borderTop: "1px solid #E0E0E0" }}>
          <div
            className="hide-scrollbar"
            style={{
              display: "flex",
              flexDirection: "row",
              overflowX: "auto",
              gap: "8px",
              padding: "12px 16px 8px 16px",
              scrollBehavior: "smooth",
            }}
          >
            {photoUris.map((photo, index) => (
              <img
                key={index}
                src={photo.thumbnail}
                alt={`Place photo ${index + 1}`}
                style={{
                  minWidth: "80px",
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border:
                    selectedPhotoIndex === index
                      ? "2px solid #4285F4"
                      : "2px solid transparent",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex(index);
                }}
                onError={(e) => (e.target.style.display = "none")}
              />
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {reviewsLoading ? (
        <div
          style={{
            padding: "12px 16px",
            fontSize: "13px",
            color: "#666",
            background: "#F9FAFB",
            borderTop: "1px solid #E0E0E0",
          }}
        >
          Loading reviews…
        </div>
      ) : reviews.length > 0 ? (
        <div
          className="hide-scrollbar"
          style={{
            backgroundColor: "#F9FAFB",
            borderTop: "1px solid #E0E0E0",
            padding: "12px 16px",
            overflowX: "auto",
            display: "flex",
            gap: "12px",
            whiteSpace: "nowrap",
          }}
        >
          {reviews.map((r, idx) => (
            <div
              key={idx}
              style={{
                minWidth: "220px",
                maxWidth: "260px",
                background: "#fff",
                border: "1px solid #E0E0E0",
                borderRadius: "8px",
                padding: "8px 12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                fontSize: "13px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={r.text}
            >
              {/* Author with profile link */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                {r.photo && (
                  <img
                    src={r.photo}
                    alt={r.author}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      marginRight: "8px",
                    }}
                  />
                )}
                <a
                  href={r.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontWeight: "500", fontSize: "12px", color: "#1a73e8" }}
                >
                  {r.author}
                </a>
              </div>
              {/* Rating + text */}
              <span style={{ color: "#fbbc04", marginRight: "6px" }}>★ {r.rating}</span>
              {r.text}
            </div>
          ))}
        </div>
      ) : null}

      {/* Custom Travel Info Panel (User 1 & User 2) */}
      {locationInfo && (
        <div
          className="hide-scrollbar"
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#F9FAFB",
            padding: "12px 16px",
            gap: "12px",
            borderTop:
              photoUris.length > 0 || reviews.length > 0 || photosLoading || reviewsLoading
                ? "none"
                : "1px solid #E0E0E0",
            overflowX: "auto",
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
          onClick={() => setIsDetailedView(false)}
        >
          <InfoBox
            label="User 1"
            time={travel_time_from_loc1_min}
            distance={travel_distance_from_loc1_km}
          />
          <InfoBox
            label="User 2"
            time={travel_time_from_loc2_min}
            distance={travel_distance_from_loc2_km}
          />
        </div>
      )}
    </div>
  );
};

// Reusable Info Box Component
const InfoBox = ({ label, time, distance }) => (
  <div
    style={{
      fontSize: "13px",
      padding: "8px 12px",
      borderRadius: "8px",
      backgroundColor: "#E8F0FE",
      color: "#1A1A1A",
      display: "inline-flex",
      flexDirection: "row",
      minWidth: "140px",
      gap: "8px",
      marginRight: "8px",
    }}
  >
    <strong style={{ fontSize: "13px", marginRight: "4px" }}>{label}</strong>
    <div>
      {time ? `${time}min` : ""}
      {distance !== undefined ? ` – ${distance} km` : ""}
    </div>
  </div>
);

export default GooglePlacesCardCompact;