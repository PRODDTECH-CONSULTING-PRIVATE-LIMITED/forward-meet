import React, { useState, useEffect, useRef } from "react";
import { useVenueData } from "./useVenueData";
import "./VenueCard.css";

/* ─── SVG Icons ─────────────────────────────────────────── */
const DirectionIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
  </svg>
);

const CabIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </svg>
);

const ForkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" />
  </svg>
);

const ShareIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

/* ─── Skeleton Loader ────────────────────────────────────── */
const VenueCardSkeleton = () => (
  <div className="venue-card venue-card--skeleton">
    <div className="skeleton-block skeleton-title" />
    <div className="skeleton-block skeleton-subtitle" />
    <div className="skeleton-photos">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton-block skeleton-photo" />
      ))}
    </div>
    <div className="skeleton-block skeleton-line skeleton-line--long" />
    <div className="skeleton-block skeleton-line skeleton-line--short" />
  </div>
);

/* ─── Main Component ─────────────────────────────────────── */
const VenueCard = ({ placeId, locationInfo, onClick, setIsDetailedView }) => {
  const { placeData, photoUris, isLoading, openStatus, totalPhotoCount } =
    useVenueData(placeId);

  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const {
    travel_time_from_loc1_min,
    travel_time_from_loc2_min,
    travel_distance_from_loc1_km,
    travel_distance_from_loc2_km,
  } = locationInfo || {};

  /* ── Handlers ───────────────────────────────────────────── */
  const handleCardClick = () => {
    if (onClick) onClick();
    else if (setIsDetailedView) setIsDetailedView(true);
  };

  const handleDirections = (e) => {
    e.stopPropagation();
    const loc = placeData?.geometry?.location;
    if (loc) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${loc.lat()},${loc.lng()}`,
        "_blank"
      );
    }
  };

  const handleBookCab = (e) => {
    e.stopPropagation();
    const loc = placeData?.geometry?.location;
    if (loc) {
      const name = encodeURIComponent(placeData?.name || "");
      window.open(
        `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${loc.lat()}&dropoff[longitude]=${loc.lng()}&dropoff[nickname]=${name}`,
        "_blank"
      );
    }
  };

  const handleAddToCalendar = (e) => {
    e.stopPropagation();
    const name = encodeURIComponent(placeData?.name || "Meeting");
    window.open(
      `https://calendar.google.com/calendar/r/eventedit?text=${name}&details=Meeting+at+${name}`,
      "_blank"
    );
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    const loc = placeData?.geometry?.location;
    const name = encodeURIComponent(placeData?.name || "");
    // Build a Google Maps search/place link
    const link = loc
      ? `https://www.google.com/maps/search/?api=1&query=${loc.lat()},${loc.lng()}&query_place_id=${placeId}`
      : `https://www.google.com/maps/search/?api=1&query=${name}`;
    navigator.clipboard
      .writeText(link)
      .then(() => showToast("📋 Link copied to clipboard!"))
      .catch(() => showToast("Failed to copy link", "error"));
  };

  const handleCall = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    const phone = placeData?.formatted_phone_number;
    if (!phone) {
      showToast("No phone number available", "error");
      return;
    }
    navigator.clipboard
      .writeText(phone)
      .then(() => showToast(`📞 ${phone} copied!`))
      .catch(() => showToast("Failed to copy number", "error"));
  };

  /* ── Derived values ─────────────────────────────────────── */
  const visiblePhotos = photoUris.slice(0, 5);

  /* ── Render ─────────────────────────────────────────────── */
  if (isLoading) return <VenueCardSkeleton />;
  if (!placeId) return null;

  return (
    <div className="venue-card" onClick={handleCardClick}>

      {/* ── Header ── */}
      <div className="venue-card__header">
        <div className="venue-card__title-section">
          <h2 className="venue-card__name">
            {placeData?.name || "Loading..."}
          </h2>

          <div className="venue-card__meta">
            {placeData?.rating && (
              <span className="venue-card__rating">
                <span className="venue-card__rating-score">
                  {placeData.rating}
                </span>
                <span className="venue-card__rating-star"> ★</span>
                <span className="venue-card__rating-count">
                  {" "}({placeData.user_ratings_total?.toLocaleString()} reviews)
                </span>
              </span>
            )}

            {openStatus && (
              <span
                className={`venue-card__status ${openStatus.isOpen
                  ? "venue-card__status--open"
                  : "venue-card__status--closed"
                  }`}
              >
                {openStatus.isOpen
                  ? `Open · Closes ${openStatus.closeTime}`
                  : "Closed"}
              </span>
            )}
          </div>
        </div>

        {/* ── 3-dot menu ── */}
        <div className="venue-card__menu-wrapper" ref={menuRef}>
          <button
            className="venue-card__more-btn"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            aria-label="More options"
          >
            ⋮
          </button>

          {menuOpen && (
            <div
              className="venue-card__dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="venue-card__dropdown-item" onClick={handleShare}>
                <span className="venue-card__dropdown-icon"><ShareIcon /></span>
                Share place
              </button>
              <button className="venue-card__dropdown-item" onClick={handleCall}>
                <span className="venue-card__dropdown-icon"><PhoneIcon /></span>
                Copy number
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Photo Grid ── */}
      {visiblePhotos.length > 0 && (
        <div className="venue-card__photos">
          {visiblePhotos.map((photo, index) => (
            <div
              key={index}
              className="venue-card__photo-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photo.thumbnail}
                alt={`Venue photo ${index + 1}`}
                className="venue-card__photo"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Reviews ── */}
      {placeData?.reviews?.length > 0 && (
        <div className="venue-card__reviews">
          {placeData.reviews.slice(0, 2).map((review, index) => (
            <div
              key={index}
              className="venue-card__review-item"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Avatar */}
              <div className="venue-card__review-avatar">
                {review.profile_photo_url ? (
                  <img
                    src={review.profile_photo_url}
                    alt={review.author_name}
                    className="venue-card__avatar-img"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="venue-card__avatar-fallback"
                  style={{
                    display: review.profile_photo_url ? "none" : "flex",
                  }}
                >
                  {review.author_name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              </div>

              {/* Quote */}
              <div className="venue-card__review-content">
                <p className={`venue-card__review-text ${expandedReviews.has(index) ? "venue-card__review-text--expanded" : ""}`}>
                  {review.text}
                  {expandedReviews.has(index) && (
                    <span
                      className="venue-card__review-hide-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newSet = new Set(expandedReviews);
                        newSet.delete(index);
                        setExpandedReviews(newSet);
                      }}
                    >
                      {" "}Hide
                    </span>
                  )}
                </p>
                {!expandedReviews.has(index) && review.text?.length > 100 && (
                  <span
                    className="venue-card__review-more-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newSet = new Set(expandedReviews);
                      newSet.add(index);
                      setExpandedReviews(newSet);
                    }}
                  >
                    ... More
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Travel Info Pill ── */}
      {locationInfo && (
        <div className="venue-card__travel">
          <div className="venue-card__travel-person">
            <span className="venue-card__travel-label">Person A</span>
            <span className="venue-card__travel-value">
              {travel_time_from_loc1_min ?? "—"}m
              <span className="venue-card__travel-pipe"> | </span>
              {travel_distance_from_loc1_km ?? "—"}km
            </span>
          </div>

          <div className="venue-card__travel-separator" />

          <div className="venue-card__travel-person">
            <span className="venue-card__travel-label">Person B</span>
            <span className="venue-card__travel-value">
              {travel_time_from_loc2_min ?? "—"}m
              <span className="venue-card__travel-pipe"> | </span>
              {travel_distance_from_loc2_km ?? "—"}km
            </span>
          </div>
        </div>
      )}

      {/* ── Action Buttons ── */}
      <div className="venue-card__actions">
        <button
          className="venue-card__btn venue-card__btn--primary"
          onClick={handleDirections}
        >
          <span className="venue-card__btn-icon">
            <DirectionIcon />
          </span>
          Directions
        </button>

        <button
          className="venue-card__btn venue-card__btn--outline"
          onClick={handleBookCab}
        >
          <span className="venue-card__btn-icon">
            <CabIcon />
          </span>
          Book Cab
        </button>

        <button
          className="venue-card__btn venue-card__btn--outline"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="venue-card__btn-icon">
            <ForkIcon />
          </span>
          Reserve
        </button>

        <button
          className="venue-card__btn venue-card__btn--outline"
          onClick={handleAddToCalendar}
        >
          <span className="venue-card__btn-icon">
            <CalendarIcon />
          </span>
          Add to cal
        </button>
      </div>

      {/* ── Toast notification ── */}
      {toast && (
        <div className={`venue-card__toast ${toast.type === "error" ? "venue-card__toast--error" : ""}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default VenueCard;
