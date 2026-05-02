import React, { useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { InfoWindow } from "@react-google-maps/api";
import { customMapStyle } from "./mapStyles";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const libraries = ["places"];

function RestaurantLocator() {
  const [center, setCenter] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [hoveredPlace, setHoveredPlace] = useState(null);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLocation);
        },
        (error) => {
          console.error("Error getting user location:", error);
          const defaultLocation = { lat: 12.9716, lng: 77.5946 };
          setCenter(defaultLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      const defaultLocation = { lat: 12.9716, lng: 77.5946 };
      setCenter(defaultLocation);
    }
  }, []);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const searchRestaurants = useCallback(async () => {
    if (!mapRef.current || !window.google || !center) {
      return;
    }

    const service = new window.google.maps.places.PlacesService(mapRef.current);

    const request = {
      location: center,
      radius: 5000,
      type: ["restaurant"],
      keyword: "restaurant",
    };

    try {
      service.nearbySearch(request, (results, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          results
        ) {
          setRestaurants(results);
        } else {
          setRestaurants([]);
        }
      });
    } catch (error) {
      console.error("Error creating PlacesService or request:", error);
      return;
    }
  }, [center]);

  useEffect(() => {
    setTimeout(() => {
      if (isLoaded && center && mapRef.current) {
        searchRestaurants();
      }
    }, 1000);
  }, [isLoaded, center, searchRestaurants]);

  if (loadError) {
    return (
      <div className="p-5 text-center text-red-500 text-xl">
        Error loading Google Maps API: {loadError.message}
      </div>
    );
  }
  
  if (!isLoaded || !center) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-surface font-body text-on-surface flex h-screen overflow-hidden">
      {/* TopNavBar */}
      <header className="bg-slate-50/80 backdrop-blur-xl font-headline antialiased shadow-sm fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-6">
          <span className="text-2xl font-black tracking-tighter text-blue-600">Midway</span>
          <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full w-96 gap-2">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none" placeholder="Search for venues..." type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-slate-200/50 transition-colors">
            <span className="material-symbols-outlined text-on-surface">notifications</span>
          </button>
          <button className="p-2 rounded-full hover:bg-slate-200/50 transition-colors">
            <span className="material-symbols-outlined text-on-surface">settings</span>
          </button>
          <img alt="User profile" className="w-10 h-10 rounded-full border-2 border-primary-container object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"/>
        </div>
      </header>

      {/* Sidebar & Content */}
      <main className="flex w-full pt-16 h-full">
        {/* SideNavBar (Left Sidebar) */}
        <aside className="bg-slate-50 h-full w-[440px] flex flex-col p-6 space-y-6 overflow-y-auto hide-scrollbar z-40 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-headline font-extrabold text-2xl text-on-surface">Suggested Venues <span className="text-on-surface-variant font-normal text-lg ml-1">{restaurants.length}</span></h1>
              <p className="text-sm text-on-surface-variant mt-1">Curated for your route</p>
            </div>
            <button className="p-1 hover:bg-surface-variant rounded-md transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 block">Optimize for</label>
              <div className="flex bg-surface-container-low p-1 rounded-full w-fit">
                <button className="px-6 py-2 rounded-full bg-white shadow-sm text-sm font-semibold text-primary">Time</button>
                <button className="px-6 py-2 rounded-full text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors">Distance</button>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">TIME MARGIN</label>
                <span className="text-sm font-bold text-primary">10 min</span>
              </div>
              <div className="relative w-full h-1.5 bg-surface-container rounded-full mt-4">
                <div className="absolute h-full bg-primary rounded-full" style={{width: "33%"}}></div>
                <div className="absolute top-1/2 -translate-y-1/2 left-[33%] w-5 h-5 bg-white border-2 border-primary rounded-full shadow-md cursor-pointer"></div>
                <div className="flex justify-between mt-3 text-[10px] font-bold text-on-surface-variant">
                  <span>0m</span>
                  <span>30m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Venue Cards List */}
          <div className="space-y-8 pb-32">
            {restaurants.length === 0 ? (
               <div className="text-center text-on-surface-variant py-10">Searching for restaurants...</div>
            ) : restaurants.slice(0, 5).map((restaurant, idx) => (
              <div key={restaurant.place_id || idx} className="group bg-surface-container-lowest rounded-lg p-5 shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-headline font-bold text-lg leading-tight">{restaurant.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-sm font-bold text-on-surface">{restaurant.rating || "N/A"}</span>
                      <div className="flex">
                        <span className="material-symbols-outlined text-orange-400 text-xs" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      </div>
                      <span className="text-xs text-on-surface-variant">({restaurant.user_ratings_total || 0} reviews)</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
                </div>
                
                {/* Images Grid - Using placeholder Unsplash images as Places API photos require additional requests */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <img alt="Venue interior" className="w-full aspect-square object-cover rounded-md" src={`https://images.unsplash.com/photo-[restaurant_interior]?q=80&w=400&auto=format&fit=crop&sig=${idx}1`}/>
                  <img alt="Food plate" className="w-full aspect-square object-cover rounded-md" src={`https://images.unsplash.com/photo-[food]?q=80&w=400&auto=format&fit=crop&sig=${idx}2`}/>
                  <img alt="Restaurant bar" className="w-full aspect-square object-cover rounded-md" src={`https://images.unsplash.com/photo-[bar]?q=80&w=400&auto=format&fit=crop&sig=${idx}3`}/>
                  <div className="relative w-full aspect-square rounded-md overflow-hidden">
                    <img alt="Kitchen" className="w-full h-full object-cover" src={`https://images.unsplash.com/photo-[kitchen]?q=80&w=400&auto=format&fit=crop&sig=${idx}4`}/>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">+12</div>
                  </div>
                </div>

                {/* Review Snippets */}
                <div className="space-y-3 mb-5">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold">R</div>
                    <p className="text-xs text-on-surface-variant italic leading-relaxed">"Great place and the service was surprisingly quick."</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:opacity-90 transition-opacity">
                    <span className="material-symbols-outlined text-lg">directions</span>
                    Directions
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2.5 rounded-full border border-outline-variant/30 text-on-surface text-xs font-bold hover:bg-surface-variant transition-colors">
                    <span className="material-symbols-outlined text-lg">local_taxi</span>
                    Book Cab
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2.5 rounded-full border border-outline-variant/30 text-on-surface text-xs font-bold hover:bg-surface-variant transition-colors">
                    <span className="material-symbols-outlined text-lg">restaurant</span>
                    Reserve
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2.5 rounded-full border border-outline-variant/30 text-on-surface text-xs font-bold hover:bg-surface-variant transition-colors">
                    <span className="material-symbols-outlined text-lg">calendar_month</span>
                    Add to cal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Map Area */}
        <section className="flex-1 relative h-full bg-slate-200">
          <div className="absolute inset-0 z-0">
             <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={13}
                onLoad={onMapLoad}
                onUnmount={onMapUnmount}
                options={{
                  styles: customMapStyle,
                  disableDefaultUI: true, // Hides all default controls to match design
                }}
              >
                {restaurants.map((restaurant) => (
                  <Marker
                    key={restaurant.place_id}
                    position={{
                      lat: restaurant.geometry?.location?.lat() || restaurant.lat,
                      lng: restaurant.geometry?.location?.lng() || restaurant.lng,
                    }}
                    title={restaurant.name}
                    onMouseOver={() => setHoveredPlace(restaurant)}
                    onMouseOut={() => setHoveredPlace(null)}
                  />
                ))}

                {hoveredPlace && (
                  <InfoWindow
                    position={{ 
                      lat: hoveredPlace.geometry?.location?.lat() || hoveredPlace.lat, 
                      lng: hoveredPlace.geometry?.location?.lng() || hoveredPlace.lng 
                    }}
                    onCloseClick={() => setHoveredPlace(null)}
                  >
                    <div className="min-w-[150px] p-1 font-body text-black">
                      <strong className="block text-sm mb-1">{hoveredPlace.name}</strong>
                      <p className="text-xs text-gray-600 mb-1">{hoveredPlace.vicinity}</p>
                    </div>
                  </InfoWindow>
                )}

                {center && (
                  <Marker
                    position={center}
                    title="Your Location"
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                      scaledSize: new window.google.maps.Size(32, 32),
                    }}
                  />
                )}
              </GoogleMap>
          </div>

          {/* Map Controls - Top Left */}
          <div className="absolute top-6 left-6 flex bg-white/90 backdrop-blur shadow-lg rounded-xl overflow-hidden p-1 z-10">
            <button className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-lg">Map</button>
            <button className="px-5 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface">Satellite</button>
          </div>

          {/* Expand Icon - Top Right */}
          <button className="absolute top-6 right-6 p-2.5 bg-white/90 backdrop-blur shadow-lg rounded-xl z-10 hover:bg-white transition-colors">
            <span className="material-symbols-outlined text-on-surface">fullscreen</span>
          </button>

          {/* Zoom Controls - Bottom Right */}
          <div className="absolute bottom-10 right-6 flex flex-col gap-3 z-10">
            <div className="flex flex-col bg-white/90 backdrop-blur shadow-lg rounded-xl overflow-hidden">
              <button className="p-3 border-b border-surface-variant hover:bg-surface-variant transition-colors" onClick={() => mapRef.current?.setZoom((mapRef.current?.getZoom() || 13) + 1)}>
                <span className="material-symbols-outlined text-on-surface">add</span>
              </button>
              <button className="p-3 hover:bg-surface-variant transition-colors" onClick={() => mapRef.current?.setZoom((mapRef.current?.getZoom() || 13) - 1)}>
                <span className="material-symbols-outlined text-on-surface">remove</span>
              </button>
            </div>
            <button className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-xl hover:bg-surface-variant transition-colors" onClick={() => mapRef.current?.panTo(center)}>
              <span className="material-symbols-outlined text-on-surface">my_location</span>
            </button>
          </div>
        </section>
      </main>

      {/* BottomNavBar (Shared Component Logic - Suppressed on Desktop) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 md:hidden bg-white/90 backdrop-blur-2xl shadow-[0_-12px_40px_rgba(44,47,49,0.06)] rounded-t-[2rem]">
        <button className="flex flex-col items-center justify-center text-slate-400">
          <span className="material-symbols-outlined">map</span>
          <span className="font-headline text-[10px] font-semibold">Map</span>
        </button>
        <button className="flex flex-col items-center justify-center bg-blue-50 text-blue-600 rounded-full py-2 px-6">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>storefront</span>
          <span className="font-headline text-[10px] font-semibold">Venues</span>
        </button>
        <button className="flex flex-col items-center justify-center text-slate-400">
          <span className="material-symbols-outlined">directions_car</span>
          <span className="font-headline text-[10px] font-semibold">Routes</span>
        </button>
        <button className="flex flex-col items-center justify-center text-slate-400">
          <span className="material-symbols-outlined">person</span>
          <span className="font-headline text-[10px] font-semibold">Profile</span>
        </button>
      </nav>
    </div>
  );
}

export default RestaurantLocator;
