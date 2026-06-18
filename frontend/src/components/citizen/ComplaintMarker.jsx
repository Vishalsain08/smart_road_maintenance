import { Link } from "react-router-dom";
import { Marker, Popup } from "react-leaflet";
import "../../utils/leafletMarkerConfig.js";
import { formatComplaintCategory } from "../../utils/complaintConstants.js";
import StatusBadge from "./StatusBadge.jsx";

function ComplaintMarker({ complaint }) {
  if (
    !Number.isFinite(complaint?.location?.lat) ||
    !Number.isFinite(complaint?.location?.lng)
  ) {
    return null;
  }

  return (
    <Marker position={[complaint.location.lat, complaint.location.lng]}>
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
          <Link
            to={`/citizen/complaints/${complaint._id}`}
            className="block text-sm font-semibold text-[#F97316] hover:text-orange-600"
          >
            View details
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}

export default ComplaintMarker;
