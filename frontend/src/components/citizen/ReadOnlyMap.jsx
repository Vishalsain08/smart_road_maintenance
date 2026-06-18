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
      <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#1E293B] p-6 text-sm text-[#94A3B8]">
        Location is not available for this complaint.
      </div>
    );
  }

  const position = [complaint.location.lat, complaint.location.lng];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1E293B] shadow-sm">
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
              {complaint.location?.address && (
                <p className="text-sm text-slate-600">
                  {complaint.location.address}
                </p>
              )}
              <StatusBadge status={complaint.status} />
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default ReadOnlyMap;
