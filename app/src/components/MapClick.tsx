import { useMapEvent, Popup } from "react-leaflet";
import { useState, useRef, useEffect } from "react";

interface Props {
  date: string;
}

const MapPopup: React.FC<Props> = ({ date }) => {
  const [popupData, setPopupData] = useState<{
    lat: number;
    lng: number;
    value: number | null;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Keep reference to current AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  const map = useMapEvent("click", async (e) => {
    const { lat, lng } = e.latlng;

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Show popup immediately
    setPopupData({ lat, lng, value: null });
    setIsLoading(true);

    try {
      const req = await fetch(
        `http://127.0.0.1:8000/pixel_value?lat=${lat}&lng=${lng}&date=${date}`,
        { signal: controller.signal }
      );

      const res = await req.json();
      setPopupData({
        lat,
        lng,
        value: res.value,
      });
    } catch (err: any) {
      if (err.name === "AbortError") {
        // Request was aborted, ignore
        return;
      }
      console.error("Failed to fetch pixel value:", err);
      setPopupData({
        lat,
        lng,
        value: NaN,
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
      onClose={() => setPopupData(null)}
    >
      <div>
        <strong>Pixel Value:</strong>{" "}
        {isLoading
          ? "Loading..."
          : popupData.value === null
          ? "Loading..."
          : isNaN(popupData.value)
          ? "Error"
          : popupData.value.toFixed(2) + " °C"}
      </div>
    </Popup>
  ) : null;
};

export default MapPopup;
