import React from 'react';

const MapControls = ({ 
  isSatellite, 
  is3D, 
  onToggleMapType, 
  onFullscreen, 
  onZoomIn, 
  onZoomOut, 
  onToggle3D 
}) => {
  return (
    <>
      {/* Map Type Toggle - Positioned on Left */}
      <div className="map-controls-left">
        <div className="map-type-toggle">
          <button 
            className={`map-type-button ${!isSatellite ? 'active' : ''}`}
            onClick={() => isSatellite && onToggleMapType()}
          >
            Map
          </button>
          <button 
            className={`map-type-button ${isSatellite ? 'active' : ''}`}
            onClick={() => !isSatellite && onToggleMapType()}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Main Controls Group - Positioned on Right */}
      <div className="map-controls-right">
        <div className="map-control-group shadow-xl">
          <button 
            className="map-control-button" 
            onClick={onFullscreen}
            title="Fullscreen"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>fullscreen</span>
          </button>
          
          <div className="h-px bg-slate-200 mx-2" />
          
          <button 
            className="map-control-button" 
            onClick={onZoomIn}
            title="Zoom In"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
          </button>
          <button 
            className="map-control-button" 
            onClick={onZoomOut}
            title="Zoom Out"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>remove</span>
          </button>
          
          <div className="h-px bg-slate-200 mx-2" />

          <button 
            className={`map-control-button ${is3D ? 'active' : ''}`}
            onClick={onToggle3D}
            title="Toggle 3D"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>3d_rotation</span>
          </button>
          
          <button 
            className="map-control-button" 
            title="Reset Orientation"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>explore</span>
          </button>
        </div>
      </div>
    </>
  );
};
export default MapControls;
