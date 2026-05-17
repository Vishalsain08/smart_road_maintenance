import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "../../utils/leafletMarkerConfig.js";
import { formatComplaintCategory } from "../../utils/complaintConstants.js";
import StatusBadge from "./StatusBadge.jsx";

function ReadOnlyMap({ complaint, heightClass = "h-80" }) {
  if (
    !Number.isFinite(complaint?.location?.lat) ||
    !Number.isFinite(complaint?.location?.lng)
  ) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
        Location is not available for this complaint.
      </div>
    );
  }

  const position = [complaint.location.lat, complaint.location.lng];

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        dragging
        className={`${heightClass} w-full`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="min-w-44 space-y-2">
              <p className="font-semibold text-slate-950">{complaint.title}</p>
              <p className="text-sm text-slate-600">
                {formatComplaintCategory(complaint.category)}
              </p>
              <StatusBadge status={complaint.status} />
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default ReadOnlyMap;
