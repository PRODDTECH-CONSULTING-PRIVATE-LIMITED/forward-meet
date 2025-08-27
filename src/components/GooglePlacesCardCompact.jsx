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

import React, { useEffect, useRef, useState } from "react";

const GooglePlaceCardCompact = ({ placeId, locationInfo, setIsDetailedView }) => {
  const ref = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showSlider, setShowSlider] = useState(false);

  // Destructure optional location info
  const {
    serves_gluten_free_food = false,
    serves_vegan_food = false,
    serves_vegetarian_food = false,
    travel_time_from_loc1_min,
    travel_time_from_loc2_min,
    travel_distance_from_loc1_km,
    travel_distance_from_loc2_km,
    time_difference_min,
  } = locationInfo || {};

  // Fetch place photos using Google Places API
  useEffect(() => {
    if (!placeId || !window.google) return;
    
    const fetchPhotos = async () => {
      try {
        // Create a temporary map element for PlacesService
        const mapDiv = document.createElement('div');
        const map = new window.google.maps.Map(mapDiv);
        
        // Create PlacesService instance
        const service = new window.google.maps.places.PlacesService(map);
        
        // Request place details with photos
        service.getDetails({
          placeId: placeId,
          fields: ['photos', 'name'] 
        }, (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place.photos) {
            // Extract photo URLs from Google Places photos
            const photoUrls = place.photos.slice(0, 10).map(photo => 
              photo.getUrl({
                maxWidth: 520,  // Match your card width
                maxHeight: 300  // Good aspect ratio for the slider
              })
            );
            
            setPhotos(photoUrls);
            setShowSlider(photoUrls.length > 1);
          } else {
            console.warn('No photos found for this place or API error:', status);
            
            setPhotos([]);
            setShowSlider(false);
          }
        });
      } catch (error) {
        console.error('Error fetching photos:', error);
        setPhotos([]);
        setShowSlider(false);
      }
    };

    setTimeout(fetchPhotos, 100);
  }, [placeId]);

  useEffect(() => {
    if (!ref.current || !placeId) return;

    ref.current.innerHTML = "";

    ref.current.setAttribute("orientation", "horizontal");


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

    // Append child component tags
    config.appendChild(createElement("gmp-place-address"));
    config.appendChild(createElement("gmp-place-rating"));
    config.appendChild(createElement("gmp-place-type"));
    config.appendChild(createElement("gmp-place-price"));
    config.appendChild(createElement("gmp-place-accessible-entrance-icon"));
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

  const nextPhoto = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  if (!placeId) return null;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 520,
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.09)",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        marginBottom: "2rem",
        fontFamily: "Roboto, Arial, sans-serif",
        color: "#000",
      }}
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => {
        setIsDetailedView(false);
      }}
    >
      {/* Horizontal Photo Gallery */}
      {photos.length > 0 && (
        <div 
          style={{ 
            display: "flex",
            overflowX: "auto",
            gap: "8px",
            padding: "0",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
            WebkitScrollbarWidth: "none", // Safari
          }}
          className="scrollbar-hide"
        >
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {photos.map((photo, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                flexShrink: 0,
                width: index === 0 ? "140px" : "140px", // First image larger
                height: "120px",
                borderRadius: index === 0 ? "0" : "8px",
                overflow: "hidden",
                cursor: "pointer"
              }}
              onClick={() => {
                // e.stopPropagation();
                setCurrentPhotoIndex(index);
              }}
            >
              <img
                src={photo}
                alt={`Place photo ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.2s ease"
                }}
                className="hover:scale-105"
              />
              
              {index === 1 && photos.length > 2 && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "8px solid white",
                      borderTop: "5px solid transparent",
                      borderBottom: "5px solid transparent",
                      marginLeft: "2px"
                    }}
                  />
                </div>
              )}
              
              {/* Photo count overlay on last image */}
              {index === photos.length - 1 && photos.length > 3 && (
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    right: "0",
                    bottom: "0",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "600"
                  }}
                >
                  +{photos.length - 3}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Google Place Details */}
      <div style={{ padding: "16px" }}>
        <gmp-place-details-compact
          ref={ref}
          truncation-preferred
          style={{
            width: "100%",
            display: "block",
            "--gmp-mat-color-surface": "#ffffff",
            "--gmp-mat-color-on-surface": "#000000",
            "--gmp-mat-color-on-surface-variant": "#555555",
            "--gmp-mat-color-primary": "#4285f4",
            "--gmp-mat-color-outline-decorative": "#e0e0e0",
            "--gmp-header-visibility": "none",
            "--gmp-footer-visibility": "none",
            fontSize: "20px",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Custom Travel Info Panel */}
      {locationInfo && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#f9fafb",
            padding: "12px 16px",
            gap: "12px",
            borderTop: "1px solid #e0e0e0",
            overflowX: "auto",
            whiteSpace: "nowrap",
            scrollbarWidth: "thin",
            cursor: "pointer"
          }}
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

// Reusable Info Box
const InfoBox = ({ label, time, distance }) => (
  <div
    style={{
      fontSize: "13px",
      padding: "8px 12px",
      borderRadius: "8px",
      backgroundColor: "#e8f0fe",
      color: "#1a1a1a",
      display: "inline-flex",
      flexDirection: "row",
      minWidth: "140px",
      gap: "8px",
      marginRight: "8px"
    }}
  >
    <strong style={{ fontSize: "13px", marginRight: "4px" }}>{label}</strong>
    <div>
      {time ? `${time}min` : ""}{distance !== undefined ? ` – ${distance} km` : ""}
    </div>
  </div>
);

export default GooglePlaceCardCompact;