import React, { useEffect, useRef } from "react";

const GooglePlaceCardCompact = ({ placeId, locationInfo, setIsDetailedView }) => {
  const ref = useRef(null);

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

  useEffect(() => {
    if (!ref.current || !placeId) return;

    // Clear old DOM children
    ref.current.innerHTML = "";

    // Orientation
    ref.current.setAttribute("orientation", "horizontal");

    // Google Maps Web Component: Request & Content Config
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
    config.appendChild(createElement("gmp-place-media"));
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
    {/* Google Place Card */}
    <gmp-place-details-compact
      ref={ref}
      truncation-preferred
      style={{
        width: "100%",
        display: "block",
        "--gmp-mat-color-surface": "#ffffff",             // Card background
        "--gmp-mat-color-on-surface": "#000000",          // Title and text
        "--gmp-mat-color-on-surface-variant": "#555555",  // Subtitle text
        "--gmp-mat-color-primary": "#4285f4",             // Accent (Google Blue)
        "--gmp-mat-color-outline-decorative": "#e0e0e0",  // Border
        "--gmp-header-visibility": "none",
        "--gmp-footer-visibility": "none",
        fontSize: "14px",
        cursor: "pointer",
      }}
    />

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
          overflowX: "auto",         // Enable horizontal scrolling
          whiteSpace: "nowrap",      // Prevent wrapping to next line
          // Remove flexWrap; it's not needed anymore
          scrollbarWidth: "thin",    // (optional) thinner scrollbar for Firefox
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
        {/* Additional InfoBoxes can be added here if needed */}
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
      display: "inline-flex",  // Changed from flex to inline-flex
      flexDirection: "row",
      minWidth: "140px",
      gap: "8px",
      marginRight: "8px"      // Ensure spacing between boxes when scrolling
    }}
  >
    <strong style={{ fontSize: "13px", marginRight: "4px" }}>{label}</strong>
    <div>
      {time ? `${time}min` : ""}{distance !== undefined ? ` – ${distance} km` : ""}
    </div>
  </div>
);


export default GooglePlaceCardCompact;
