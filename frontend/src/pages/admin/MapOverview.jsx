import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import AdminComplaintDetails from "../../components/admin/AdminComplaintDetails.jsx";
import StatusBadge from "../../components/citizen/StatusBadge.jsx";
import "../../utils/leafletMarkerConfig.js";
import api from "../../services/api.js";
import { formatComplaintCategory } from "../../utils/complaintConstants.js";

const defaultCenter = [22.9734, 78.6569];

function MapOverview() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get("/admin/complaints");
        setComplaints(Array.isArray(data) ? data : data.complaints || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load map data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const mappedComplaints = useMemo(
    () =>
      complaints.filter(
        (complaint) =>
          Number.isFinite(complaint.location?.lat) &&
          Number.isFinite(complaint.location?.lng),
      ),
    [complaints],
  );

  const firstLocation = mappedComplaints[0]?.location;

  return (
    <main className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-[#F97316]">
              Complaint map
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Citywide road reports
            </h1>
            <p className="mt-2 text-sm text-[#94A3B8]">
              All complaints with saved locations are shown directly on the map.
            </p>
          </div>
          <span className="w-fit rounded-2xl border border-[#F97316]/20 bg-[#F97316]/10 px-4 py-2 text-sm font-semibold text-[#FDBA74]">
            {mappedComplaints.length} mapped
          </span>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-6 text-sm text-[#94A3B8]">
            Loading map...
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1E293B] p-2 shadow-2xl shadow-slate-950/30">
            <MapContainer
              center={
                firstLocation
                  ? [firstLocation.lat, firstLocation.lng]
                  : defaultCenter
              }
              zoom={firstLocation ? 12 : 5}
              scrollWheelZoom
              className="h-[calc(100vh-13rem)] min-h-[30rem] w-full rounded-xl"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {mappedComplaints.map((complaint) => (
                <Marker
                  key={complaint._id}
                  position={[complaint.location.lat, complaint.location.lng]}
                >
                  <Popup className="roadfix-popup">
                    <div className="min-w-56 space-y-3 rounded-xl bg-[#0F172A] text-[#F8FAFC]">
                      <div>
                        <p className="line-clamp-2 text-base font-semibold">
                          {complaint.title || "Untitled complaint"}
                        </p>
                        <p className="mt-1 text-sm text-[#94A3B8]">
                          {formatComplaintCategory(complaint.category)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <StatusBadge status={complaint.status} />
                        <button
                          type="button"
                          className="rounded-xl bg-[#F97316] px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-500"
                          onClick={() => setSelectedComplaint(complaint)}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {!isLoading && mappedComplaints.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#1E293B] p-8 text-center text-sm text-[#94A3B8]">
            No complaint locations are available yet.
          </div>
        )}

        {selectedComplaint && (
          <AdminComplaintDetails
            complaint={selectedComplaint}
            onClose={() => setSelectedComplaint(null)}
          />
        )}
      </div>
    </main>
  );
}

export default MapOverview;
