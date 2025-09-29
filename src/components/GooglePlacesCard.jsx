import React, { useRef, useEffect } from "react";

// Icons (if used again in the future)
const CheckIcon = () => <span style={{ color: "#4285F4", marginRight: "6px" }}>✅</span>;
const CrossIcon = () => <span style={{ color: "#D93025", marginRight: "6px" }}>❌</span>;

const GooglePlaceCard = ({ placeId, setDetailedPlaceId, setIsDetailedView, onPhotoClick }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && placeId) {
      ref.current.innerHTML = "";

      const placeRequest = document.createElement("gmp-place-details-place-request");
      placeRequest.setAttribute("place", placeId);

      const contentConfig = document.createElement("gmp-place-content-config");

      const childrenTags = [
        "gmp-place-media",
        "gmp-place-address",
        "gmp-place-about",
        "gmp-place-rating",
        "gmp-place-type",
        "gmp-place-price",
        "gmp-place-accessible-entrance-icon",
        "gmp-place-open-now-status",
        "gmp-place-attribution",
        "gmp-place-reviews",
        "gmp-place-phone-number",
        "gmp-place-opening-hours"
      ];

      childrenTags.forEach((tagName) => {
        const tag = document.createElement(tagName);

        if (tagName === "gmp-place-attribution") {
          tag.setAttribute("light-scheme-color", "gray");
          tag.setAttribute("dark-scheme-color", "white");
        }

        contentConfig.appendChild(tag);
      });

      ref.current.appendChild(placeRequest);
      ref.current.appendChild(contentConfig);
    }
  }, [placeId]);

  if (!placeId) return null;

  return (
    <div
      className="group transition-transform duration-300 ease-in-out transform hover:scale-[1.015] hover:shadow-xl cursor-pointer"
      style={{
        width: "100%",
        maxWidth: 520,
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        marginBottom: "2rem",
        fontFamily: "Roboto, Arial, sans-serif",
        color: "#000",
        boxShadow: "0 16px 26px rgba(0, 0, 0, 0.07), 0 2px 8px rgba(66, 133, 244, 0.10)", // Added blue shadow
      }}
    >
      <button
        onClick={() => {
          setIsDetailedView(false);
          setDetailedPlaceId(null);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          background: "none",
          border: "none",
          color: "#4285F4",
          fontWeight: 600,
          fontSize: "15px",
          cursor: "pointer",
          padding: "8px 0px 8px 8px",
        
          marginBottom: "0px",
          // gap: "6px",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          style={{ marginRight: "4px" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 15L8 10.5L12.5 6"
            stroke="#4285F4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to all Places
      </button>

      {/* Google Maps Platform Details */}
      <gmp-place-details
        ref={ref}
        orientation="vertical"
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",

          // Theme: Light colors
          backgroundColor: "#ffffff",
          "--gmp-mat-color-on-surface": "#000000",
          "--gmp-mat-color-on-surface-variant": "#555555",
          "--gmp-mat-color-primary": "#4285F4",
          "--gmp-mat-color-outline-decorative": "#dcdcdc",
          "--gmp-mat-color-positive": "#34A853",
          "--gmp-mat-color-negative": "#EA4335",
          "--gmp-mat-color-on-secondary-container": "#000000",
          "--gmp-mat-color-secondary-container": "#e8f0fe",

          // Header/Footer visibility configuration
          "--gmp-header-visibility": "none",

          // Optional: Media height (you can remove this line if not needed)
          "--gmpx-media-height": "120px",
        }}
      />
    </div>
  );
};

export default GooglePlaceCard;
