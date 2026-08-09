import { useEffect, useState } from "react";

/**
 * Custom hook to fetch and manage Google Places data.
 * Separates data-fetching logic from the UI component.
 */
export const useVenueData = (placeId) => {
  const [placeData, setPlaceData] = useState(null);
  const [photoUris, setPhotoUris] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!placeId) return;

    let cancelled = false;

    const fetchDetails = () => {
      if (!window.google) {
        setTimeout(fetchDetails, 150);
        return;
      }

      setIsLoading(true);
      setError(null);

      const tempDiv = document.createElement("div");
      const service = new window.google.maps.places.PlacesService(tempDiv);

      service.getDetails(
        {
          placeId,
          fields: [
            "name",
            "rating",
            "user_ratings_total",
            "price_level",
            "types",
            "opening_hours",
            "photos",
            "reviews",
            "formatted_phone_number",
            "geometry",
          ],
        },
        (place, status) => {
          if (cancelled) return;

          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setPlaceData(place);
            if (place?.photos) {
              const photoData = place.photos.slice(0, 10).map((photo) => ({
                thumbnail: photo.getUrl({ maxHeight: 200, maxWidth: 200 }),
                fullSize: photo.getUrl({ maxHeight: 600, maxWidth: 800 }),
              }));
              setPhotoUris(photoData);
            }
          } else {
            setError("Failed to load place details.");
          }
          setIsLoading(false);
        }
      );
    };

    fetchDetails();

    // Cleanup: ignore stale responses if placeId changes
    return () => {
      cancelled = true;
    };
  }, [placeId]);

  const getOpenStatus = (openingHours) => {
    if (!openingHours) return null;
    const isOpen = openingHours.isOpen?.();
    if (isOpen === undefined) return null;

    const dayOfWeek = new Date().getDay();
    const todayPeriod = openingHours.periods?.find(
      (p) => p.open.day === dayOfWeek
    );

    if (todayPeriod?.close) {
      const h = todayPeriod.close.time.substring(0, 2);
      const m = todayPeriod.close.time.substring(2);
      const closeTime = `${parseInt(h) % 12 || 12}:${m} ${parseInt(h) >= 12 ? "pm" : "am"}`;
      return { isOpen, closeTime };
    }

    return { isOpen };
  };

  return {
    placeData,
    photoUris,
    isLoading,
    error,
    openStatus: placeData?.opening_hours
      ? getOpenStatus(placeData.opening_hours)
      : null,
    totalPhotoCount: placeData?.photos?.length ?? 0,
  };
};
