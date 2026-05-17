import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "../../utils/leafletMarkerConfig.js";

const defaultCenter = [22.9734, 78.6569];
const defaultZoom = 5;
const selectedZoom = 15;

function MapClickHandler({ onSelectLocation }) {
  useMapEvents({
    click(event) {
      onSelectLocation({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
}

function MapViewUpdater({ position }) {
  const map = useMap();
  const lat = position?.lat;
  const lng = position?.lng;

  useEffect(() => {
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      const nextPosition = [lat, lng];

      map.invalidateSize();
      map.setView(nextPosition, selectedZoom, {
        animate: true,
      });
    }
  }, [lat, lng, map]);

  return null;
}

const getLocationErrorMessage = (error) => {
  if (error.code === error.PERMISSION_DENIED) {
    return "Location permission was denied. Please allow location access in your browser settings.";
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return "Current location is unavailable. Please check GPS or network location services.";
  }

  if (error.code === error.TIMEOUT) {
    return "Location request timed out. Please try again or click the map manually.";
  }

  return "Unable to access your current location.";
};

const getCurrentPosition = (options) =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });

function LocationPicker({ value, onChange }) {
  const [isLocating, setIsLocating] = useState(false);

  const handleUseCurrentLocation = async () => {
    if (!window.isSecureContext) {
      toast.error(
        "Current location needs HTTPS or localhost. Open the app on localhost to use it.",
      );
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    setIsLocating(true);

    try {
      let position;

      try {
        position = await getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        });
      } catch (error) {
        if (error.code !== error.TIMEOUT) {
          throw error;
        }

        position = await getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 12000,
          maximumAge: 60000,
        });
      }

      onChange({
        lat: Number(position.coords.latitude),
        lng: Number(position.coords.longitude),
      });
      toast.success("Current location selected");
    } catch (error) {
      toast.error(getLocationErrorMessage(error));
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    if (!navigator.permissions?.query) {
      return;
    }

    navigator.permissions
      .query({ name: "geolocation" })
      .then((permission) => {
        if (permission.state === "denied") {
          toast.error(
            "Location permission is blocked. Enable it from browser site settings.",
          );
        }
      })
      .catch(() => {});
  }, []);

  const mapCenter = value ? [value.lat, value.lng] : defaultCenter;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-sm font-semibold text-slate-950">
            Complaint Location
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Click the map or use your current location.
          </p>
        </div>
        <button
          type="button"
          disabled={isLocating}
          className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
          onClick={handleUseCurrentLocation}
        >
          {isLocating ? "Locating..." : "Use Current Location"}
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
        <MapContainer
          center={mapCenter}
          zoom={value ? selectedZoom : defaultZoom}
          scrollWheelZoom
          className="h-[22rem] w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onSelectLocation={onChange} />
          <MapViewUpdater position={value} />
          {value && <Marker position={[value.lat, value.lng]} />}
        </MapContainer>
      </div>

      <div className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
        {value ? (
          <span>
            Latitude: {value.lat.toFixed(6)} | Longitude:{" "}
            {value.lng.toFixed(6)}
          </span>
        ) : (
          <span>No location selected yet.</span>
        )}
      </div>
    </div>
  );
}

export default LocationPicker;
