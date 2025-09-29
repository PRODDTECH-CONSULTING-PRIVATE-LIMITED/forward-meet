import React, { useEffect, useRef } from "react";

const MapComponent = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: 12,
        mapId: "DEMO_MAP_ID",
      });

      new window.google.maps.Marker({
        position: { lat: 28.6139, lng: 77.2090 },
        map,
        title: "Delhi",
      });
    }
    // if (mapRef.current && window.google?.maps?.Map) {
    //   const googleMap = new window.google.maps.Map(mapRef.current, {
    //     center: { lat: 20.5937, lng: 78.9629 },
    //     zoom: 5,
    //     mapId: "DEMO_MAP_ID",
    //   });
    //   setMap(googleMap);
    //   setDirectionsService(new window.google.maps.DirectionsService());
    //   setDirectionsRenderer(
    //     new window.google.maps.DirectionsRenderer({
    //       map: googleMap,
    //       suppressMarkers: true,
    //     })
    //   );
    // }
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ height: "100vh", width: "100%" }}
      className="w-full h-full"
    />
  );
};

export default MapComponent;
