import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import SegmentedControl from './SegmentedControl';
import SearchRadiusSlider from './SearchRadiusSlider';
import TimeDifferenceSlider from './TimeDifferenceSlider';

const VenueResultsSidebar = ({ 
  venues, 
  isOpen, 
  onToggle, 
  onVenueHover, 
  onVenueClick,
  selectedVenueId,
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
  hoveredVenueId,
  itemsPerPage,
  loading,
  // Filter controls
  searchMode,
  onSearchModeChange,
  searchRadius,
  onSearchRadiusChange,
  timeDifferenceMargin,
  onTimeDifferenceMarginChange
}) => {
  const listContainerRef = useRef(null);

  // Scroll list to top when page changes
  useEffect(() => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  return (
    <>
      {/* Sidebar */}
      <div
        className="venue-results-sidebar"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '30vw',
          minWidth: '350px',
          maxWidth: '500px',
          background: 'white',
          borderRight: '1px solid #e2e8f0',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 12px rgba(0,0,0,0.08)',
          isolation: 'isolate'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--gradient-primary)',
          color: 'white',
          position: 'relative',
          boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)',
          zIndex: 10
        }}>
          {/* Close Button */}
          <button
            onClick={onToggle}
            style={{
              position: 'absolute',
              top: '14px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              zIndex: 10,
              fontSize: '18px',
              color: 'white',
              lineHeight: 1
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            aria-label="Close sidebar"
            title="Close"
          >
            ×
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'baseline',
            gap: '10px',
            paddingRight: '40px' 
          }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Suggested Venues
            </h3>
            <span style={{ 
              fontSize: '11px',
              fontWeight: 700,
              opacity: 0.9,
              background: 'rgba(255,255,255,0.15)',
              padding: '2px 8px',
              borderRadius: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {totalResults}
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc'
        }}>
          <SegmentedControl
            options={[
              { value: 'time', label: 'Time', icon: '⏱️' },
              { value: 'distance', label: 'Distance', icon: '📏' }
            ]}
            selected={searchMode}
            onChange={onSearchModeChange}
          />
          
          <div style={{ marginTop: '12px' }}>
            {searchMode === 'time' ? (
              <TimeDifferenceSlider
                value={timeDifferenceMargin}
                onChange={onTimeDifferenceMarginChange}
                min={0}
                max={30}
              />
            ) : (
              <SearchRadiusSlider
                value={searchRadius}
                onChange={onSearchRadiusChange}
                min={1}
                max={50}
              />
            )}
          </div>
        </div>

        {/* Venue List */}
        <div 
          ref={listContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 20px'
          }}
        >
          {loading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              color: '#64748b'
            }}>
              <div style={{
                position: 'relative',
                width: '64px',
                height: '64px',
                marginBottom: '20px'
              }}>
                <div style={{
                  position: 'absolute', width: '100%', height: '100%',
                  border: '3px solid #f1f5f9', borderRadius: '50%'
                }} />
                <div style={{
                  position: 'absolute', width: '100%', height: '100%',
                  border: '3px solid transparent', borderTopColor: '#6366f1',
                  borderRadius: '50%', animation: 'spin 0.8s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite'
                }} />
                <div style={{
                  position: 'absolute', top: '15%', left: '15%', width: '70%', height: '70%',
                  border: '3px solid transparent', borderTopColor: '#8b5cf6',
                  borderRadius: '50%', animation: 'spin 1.2s cubic-bezier(0.5, 0.1, 0.4, 0.9) reverse infinite'
                }} />
              </div>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>Optimizing Results</p>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Finding the perfect midway point...</p>
              <style>{
                `@keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }`
              }</style>
            </div>
          ) : venues.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#64748b'
            }}>
              <p>No venues found</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Try adjusting your search filters
              </p>
            </div>
          ) : (
            venues.map((venue, index) => {
              const globalIndex = index + (currentPage - 1) * itemsPerPage;
              return (
                <VenueCard
                  key={venue.place_id}
                  venue={venue}
                  index={globalIndex}
                isSelected={selectedVenueId === venue.place_id}
                isHovered={hoveredVenueId === venue.place_id}
                onHover={() => onVenueHover(venue.place_id)}
                onLeave={() => onVenueHover(null)}
                onClick={() => onVenueClick(venue.place_id)}
                />
              );
            })
          )}

          {/* Pagination - Scrollable */}
          {totalPages > 1 && (
            <div style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  background: currentPage === 1 ? '#f1f5f9' : 'white',
                  color: currentPage === 1 ? '#94a3b8' : '#4F46E5',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: currentPage === 1 ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  background: currentPage === totalPages ? '#f1f5f9' : 'white',
                  color: currentPage === totalPages ? '#94a3b8' : '#4F46E5',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: currentPage === totalPages ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>


      </div>
    </>
  );
};

const VenueCard = ({ venue, index, isSelected, isHovered, onHover, onLeave, onClick }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const carouselRef = useRef(null);
  const cardRef = useRef(null);
  const isInternalScroll = useRef(false);
  const isMouseOverCard = useRef(false);

  // Scroll into view when hovered from map
  useEffect(() => {
    // Only scroll into view if the hover was NOT triggered by the mouse actually being over the card
    // This prevents annoying jumps when the user is hovering results in the sidebar itself
    if (isHovered && cardRef.current && !isMouseOverCard.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isHovered]);

  const handleMouseEnter = () => {
    isMouseOverCard.current = true;
    onHover();
  };

  const handleMouseLeave = () => {
    isMouseOverCard.current = false;
    onLeave();
  };

  const getVenueIcon = (types) => {
    if (!types) return '📍';
    if (types.includes('restaurant')) return '🍽️';
    if (types.includes('cafe') || types.includes('coffee')) return '☕';
    if (types.includes('bar') || types.includes('night_club')) return '🍷';
    if (types.includes('gym') || types.includes('fitness')) return '💪';
    if (types.includes('park')) return '🌳';
    return '📍';
  };

  const hasPhotos = venue.photo_references && venue.photo_references.length > 0;
  
  const getPhotoUrl = (ref) => 
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;

  // Synchronize scroll position when index changes externally (thumbnails/arrows)
  useEffect(() => {
    if (carouselRef.current && isInternalScroll.current) {
      isInternalScroll.current = false;
      return;
    }
    if (carouselRef.current) {
      const scrollAmount = currentPhotoIndex * carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  }, [currentPhotoIndex]);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const index = Math.round(carouselRef.current.scrollLeft / carouselRef.current.offsetWidth);
    if (index !== currentPhotoIndex) {
      isInternalScroll.current = true;
      setCurrentPhotoIndex(index);
    }
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % venue.photo_references.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + venue.photo_references.length) % venue.photo_references.length);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        background: isSelected || isHovered ? '#ffffff' : '#ffffff',
        border: isSelected ? '2px solid #6366f1' : isHovered ? '2px solid #8b5cf6' : '1px solid #f1f5f9',
        borderRadius: '20px',
        marginBottom: '20px',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isSelected ? '0 12px 25px -5px rgba(99, 102, 241, 0.25)' : isHovered ? '0 8px 20px -5px rgba(139, 92, 246, 0.15)' : '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
        overflow: 'hidden'
      }}
      className="venue-card-sidebar group"
    >
      {/* Photo Carousel Area */}
      <div style={{ position: 'relative', height: '140px', background: '#f1f5f9' }}>
        {hasPhotos ? (
          <>
            <div 
              ref={carouselRef}
              onScroll={handleScroll}
              className="hide-scrollbar"
              style={{
                display: 'flex',
                overflowX: 'auto',
                width: '100%',
                height: '100%',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {venue.photo_references.map((ref, i) => (
                <img 
                  key={i}
                  src={getPhotoUrl(ref)} 
                  alt={`${venue.name} photo ${i}`}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    flexShrink: 0,
                    scrollSnapAlign: 'start'
                  }}
                />
              ))}
            </div>
            
            {venue.photo_references.length > 1 && (
              <>
                <button 
                  onClick={prevPhoto}
                  className="nav-arrow"
                  style={{ left: '10px' }}
                >
                  <ChevronLeft />
                </button>
                <button 
                  onClick={nextPhoto}
                  className="nav-arrow"
                  style={{ right: '10px' }}
                >
                  <ChevronRight />
                </button>
                {/* Dots indicator */}
                <div style={{
                  position: 'absolute', bottom: '10px', left: '0', right: '0',
                  display: 'flex', justifyContent: 'center', gap: '5px', zIndex: 2,
                  pointerEvents: 'none'
                }}>
                  {venue.photo_references.slice(0, 5).map((_, i) => (
                    <div key={i} style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: i === currentPhotoIndex ? 'white' : 'rgba(255,255,255,0.4)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease'
                    }} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
            {getVenueIcon(venue.types)}
          </div>
        )}
        {/* Label Overlay - Sleek Badge */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          color: 'white', width: '28px', height: '28px',
          borderRadius: '8px', fontSize: '14px', fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255,255,255,0.2)',
          zIndex: 3,
          fontFamily: "'Outfit', sans-serif"
        }}>
          {String.fromCharCode(65 + index)}
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <h4 style={{
          margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700, color: '#1e293b',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>
          {venue.name}
        </h4>

        {/* Rating */}
        {venue.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', color: '#fbbf24' }}>
              {'★'.repeat(Math.round(venue.rating))}
              <span style={{ color: '#e2e8f0' }}>{'★'.repeat(5 - Math.round(venue.rating))}</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>{venue.rating}</span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>({venue.user_ratings_total})</span>
          </div>
        )}

        {/* Horizontal Photo Thumbnails */}
        {hasPhotos && venue.photo_references.length > 1 && (
          <div 
            className="hide-scrollbar"
            style={{ 
              display: 'flex', gap: '8px', overflowX: 'auto', 
              marginBottom: '16px', paddingBottom: '4px'
            }}
          >
            {venue.photo_references.map((ref, i) => (
              <img 
                key={i}
                src={getPhotoUrl(ref)} 
                alt={`${venue.name} thumbnail ${i}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPhotoIndex(i);
                }}
                style={{ 
                  width: '56px', height: '56px', objectFit: 'cover', 
                  borderRadius: '10px', flexShrink: 0,
                  border: i === currentPhotoIndex ? '2px solid #4F46E5' : '2px solid transparent',
                  opacity: i === currentPhotoIndex ? 1 : 0.7,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              />
            ))}
          </div>
        )}

        {/* Recent Reviews - Horizontally Scrollable */}
        {venue.reviews && venue.reviews.length > 0 && (
          <div 
            className="hide-scrollbar"
            style={{ 
              display: 'flex', gap: '8px', overflowX: 'auto', 
              marginBottom: '12px', paddingBottom: '4px',
              scrollSnapType: 'x mandatory'
            }}
          >
            {venue.reviews.map((review, idx) => (
              <div 
                key={idx}
                style={{ 
                  flexShrink: 0, width: '220px', padding: '10px 12px', 
                  background: '#f8fafc', borderRadius: '12px', 
                  border: '1px solid #f1f5f9', scrollSnapAlign: 'start'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <img 
                    src={review.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author_name)}&background=667eea&color=fff`} 
                    alt={review.author_name}
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author_name)}&background=667eea&color=fff`;
                    }}
                    style={{ width: '18px', height: '18px', borderRadius: '50%' }}
                  />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {review.author_name}
                  </span>
                  <span style={{ fontSize: '10px', color: '#fbbf24', marginLeft: 'auto' }}>
                    ★ {review.rating}
                  </span>
                </div>
                <p style={{ 
                  margin: 0, fontSize: '11px', color: '#64748b', fontStyle: 'italic',
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                  overflow: 'hidden', lineHeight: '1.4'
                }}>
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Travel Times Grid */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', 
          padding: '16px 0', borderTop: '1px solid #f1f5f9'
        }}>
          {/* Person 1 */}
          <div style={{ borderRight: '1px solid #f1f5f9', paddingRight: '8px' }}>
            <div style={{ 
              display: 'inline-block', padding: '2px 8px', borderRadius: '6px',
              background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1',
              fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px',
              letterSpacing: '0.05em'
            }}>
              Person 1
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>
                <span style={{ fontSize: '16px' }}>🕒</span>
                <span>{venue.travel_time_from_loc1_min || 0}m</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                <span style={{ color: '#94a3b8' }}>�️</span>
                <span>{Number(venue.travel_distance_from_loc1_km || 0).toFixed(1)} km</span>
              </div>
            </div>
          </div>

          {/* Person 2 */}
          <div style={{ paddingLeft: '4px' }}>
            <div style={{ 
              display: 'inline-block', padding: '2px 8px', borderRadius: '6px',
              background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6',
              fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px',
              letterSpacing: '0.05em'
            }}>
              Person 2
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>
                <span style={{ fontSize: '16px' }}>🕒</span>
                <span>{venue.travel_time_from_loc2_min || 0}m</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                <span style={{ color: '#94a3b8' }}>�️</span>
                <span>{Number(venue.travel_distance_from_loc2_km || 0).toFixed(1)} km</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueResultsSidebar;
