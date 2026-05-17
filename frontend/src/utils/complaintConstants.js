export const COMPLAINT_CATEGORIES = [
  { label: "Pothole", value: "pothole" },
  { label: "Road Crack", value: "road_crack" },
  { label: "Water Leakage", value: "water_leakage" },
  { label: "Street Light Issue", value: "street_light_issue" },
];

export const COMPLAINT_STATUSES = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in-progress" },
  { label: "Resolved", value: "resolved" },
];

export const normalizeComplaintStatus = (status = "pending") =>
  String(status).trim().toLowerCase();

export const formatComplaintCategory = (category) => {
  const match = COMPLAINT_CATEGORIES.find((item) => item.value === category);

  if (match) {
    return match.label;
  }

  return category
    ? category.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "General";
};
