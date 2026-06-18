import { MapContainer, TileLayer } from "react-leaflet";
import "../../utils/leafletMarkerConfig.js";
import ComplaintMarker from "./ComplaintMarker.jsx";

const defaultCenter = [22.9734, 78.6569];

function ComplaintMap({ complaints = [] }) {
  const complaintsWithLocation = complaints.filter(
    (complaint) =>
      Number.isFinite(complaint?.location?.lat) &&
      Number.isFinite(complaint?.location?.lng),
  );
  const firstLocation = complaintsWithLocation[0]?.location;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1E293B] shadow-sm">
      <MapContainer
        center={
          firstLocation ? [firstLocation.lat, firstLocation.lng] : defaultCenter
        }
        zoom={firstLocation ? 12 : 5}
        scrollWheelZoom
        className="h-[34rem] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {complaintsWithLocation.map((complaint) => (
          <ComplaintMarker key={complaint._id} complaint={complaint} />
        ))}
      </MapContainer>
    </div>
  );
}

export default ComplaintMap;
