import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
//import GooglePlacesCardCompact from './GooglePlacesCardCompact';
import VenueCard from './VenueCard';
import SidebarHeader from './SidebarHeader';
import SidebarFilters from './SidebarFilters';

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
          minWidth: '370px',
          maxWidth: '550px',
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
        <SidebarHeader 
          totalResults={totalResults} 
          onToggle={onToggle} 
        />

        {/* Filter Controls */}
        <SidebarFilters
          searchMode={searchMode}
          onSearchModeChange={onSearchModeChange}
          searchRadius={searchRadius}
          onSearchRadiusChange={onSearchRadiusChange}
          timeDifferenceMargin={timeDifferenceMargin}
          onTimeDifferenceMarginChange={onTimeDifferenceMarginChange}
        />

        {/* Venue List */}
        <div 
          ref={listContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 12px'
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
              return (
                <div 
                  key={venue.place_id}
                  onMouseEnter={() => onVenueHover && onVenueHover(venue.place_id)}
                  onMouseLeave={() => onVenueHover && onVenueHover(null)}
                  className={`transition-transform duration-200 ${hoveredVenueId === venue.place_id ? 'translate-y-[-2px]' : ''} mb-2 flex justify-center`}
                >
                  <VenueCard
                    placeId={venue.place_id}
                    locationInfo={venue}
                    onClick={() => onVenueClick(venue.place_id)}
                  />
                </div>
              );
            })
          )}

          {/* Pagination - Scrollable */}
          {totalPages > 1 && !loading && (
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

export default VenueResultsSidebar;
