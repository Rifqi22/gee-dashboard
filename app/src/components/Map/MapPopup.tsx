import { useMapEvent, Popup } from "react-leaflet";
import { useState, useRef, useEffect } from "react";

interface Props {
  startDate: string;
  endDate: string;
  handleClickLocation: (lat: number, lng: number) => void;
}

const MapPopup: React.FC<Props> = ({
  startDate,
  endDate,
  handleClickLocation,
}) => {
  const [popupData, setPopupData] = useState<{
    lat: number;
    lng: number;
    lst_value: number | null;
    ndvi_value: number | null;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Keep reference to current AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  useMapEvent("click", async (e) => {
    const { lat, lng } = e.latlng;
    handleClickLocation(lat, lng);

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Show popup immediately
    setPopupData({ lat, lng, lst_value: null, ndvi_value: null });
    setIsLoading(true);

    try {
      const req = await fetch(
        `/api/pixel_value?lat=${lat}&lng=${lng}&start_date=${startDate}&end_date=${endDate}`,
        { signal: controller.signal }
      );

      const res = await req.json();
      setPopupData({
        lat,
        lng,
        lst_value: res.lst_value,
        ndvi_value: res.ndvi_value,
      });
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "name" in err &&
        (err as { name: string }).name === "AbortError"
      ) {
        // Request was aborted, ignore
        return;
      }
      console.error("Failed to fetch pixel value:", err);
      setPopupData({
        lat,
        lng,
        lst_value: NaN,
        ndvi_value: NaN,
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return popupData ? (
    <Popup
      position={[popupData.lat, popupData.lng]}
      eventHandlers={{
        popupclose: () => setPopupData(null),
      }}
    >
      <div>
        <strong>LST Value:</strong>{" "}
        {isLoading
          ? "Loading..."
          : popupData.lst_value === null
          ? "Loading..."
          : isNaN(popupData.lst_value)
          ? "Error"
          : popupData.lst_value.toFixed(2) + " °C"}
      </div>
      <div>
        <strong>NDVI Value:</strong>{" "}
        {isLoading
          ? "Loading..."
          : popupData.ndvi_value === null
          ? "Loading..."
          : isNaN(popupData.ndvi_value)
          ? "Error"
          : popupData.ndvi_value.toFixed(2)}
      </div>
    </Popup>
  ) : null;
};

export default MapPopup;
