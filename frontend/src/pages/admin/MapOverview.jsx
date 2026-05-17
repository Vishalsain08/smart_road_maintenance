import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import AdminComplaintDetails from "../../components/admin/AdminComplaintDetails.jsx";
import ComplaintFilters from "../../components/admin/ComplaintFilters.jsx";
import StatusBadge from "../../components/citizen/StatusBadge.jsx";
import "../../utils/leafletMarkerConfig.js";
import api from "../../services/api.js";
import {
  formatComplaintCategory,
  normalizeComplaintStatus,
} from "../../utils/complaintConstants.js";

const defaultCenter = [22.9734, 78.6569];

function MapOverview() {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
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

  const filteredComplaints = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const hasLocation =
        Number.isFinite(complaint.location?.lat) &&
        Number.isFinite(complaint.location?.lng);
      const matchesSearch =
        !searchValue ||
        complaint.title?.toLowerCase().includes(searchValue) ||
        complaint.assignedEngineer?.name?.toLowerCase().includes(searchValue);
      const matchesStatus =
        statusFilter === "all" ||
        normalizeComplaintStatus(complaint.status) === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || complaint.category === categoryFilter;

      return hasLocation && matchesSearch && matchesStatus && matchesCategory;
    });
  }, [categoryFilter, complaints, searchTerm, statusFilter]);

  const firstLocation = filteredComplaints[0]?.location;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Map Overview
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          View complaint locations across the city. No heatmaps or clustering.
        </p>
      </div>

      <ComplaintFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
      />

      {isLoading ? (
        <div className="text-sm text-slate-600">Loading map...</div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <MapContainer
            center={
              firstLocation ? [firstLocation.lat, firstLocation.lng] : defaultCenter
            }
            zoom={firstLocation ? 12 : 5}
            scrollWheelZoom
            className="h-[36rem] w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredComplaints.map((complaint) => (
              <Marker
                key={complaint._id}
                position={[complaint.location.lat, complaint.location.lng]}
              >
                <Popup>
                  <div className="min-w-48 space-y-2">
                    <p className="font-semibold text-slate-950">
                      {complaint.title}
                    </p>
                    <p className="text-sm text-slate-600">
                      {formatComplaintCategory(complaint.category)}
                    </p>
                    <p className="text-sm text-slate-600">
                      Engineer:{" "}
                      {complaint.assignedEngineer?.name || "Unassigned"}
                    </p>
                    <StatusBadge status={complaint.status} />
                    <button
                      type="button"
                      className="block text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                      onClick={() => setSelectedComplaint(complaint)}
                    >
                      Open details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {selectedComplaint && (
        <AdminComplaintDetails
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
}

export default MapOverview;
