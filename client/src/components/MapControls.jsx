import React from 'react';
import { Layers, Maximize2, ZoomIn, ZoomOut, Box, Compass } from 'lucide-react';

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
    <div className="map-controls-container">
      {/* Map Type Toggle */}
      <div className="map-type-toggle mb-2">
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

      {/* Main Controls Group */}
      <div className="map-control-group shadow-xl">
        <button 
          className="map-control-button" 
          onClick={onFullscreen}
          title="Fullscreen"
        >
          <Maximize2 size={20} />
        </button>
        
        <div className="h-px bg-slate-200 mx-2" />
        
        <button 
          className="map-control-button" 
          onClick={onZoomIn}
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        <button 
          className="map-control-button" 
          onClick={onZoomOut}
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        
        <div className="h-px bg-slate-200 mx-2" />

        <button 
          className={`map-control-button ${is3D ? 'active' : ''}`}
          onClick={onToggle3D}
          title="Toggle 3D"
        >
          <Box size={20} />
        </button>
        
        <button 
          className="map-control-button" 
          title="Reset Orientation"
        >
          <Compass size={20} />
        </button>
      </div>
    </div>
  );
};

export default MapControls;
