const toneStyles = {
  emerald: "bg-emerald-50 text-emerald-800 ring-emerald-100",
  blue: "bg-blue-50 text-blue-800 ring-blue-100",
  green: "bg-green-50 text-green-800 ring-green-100",
};

function EngineerDashboardCard({ label, value, helper, tone = "emerald" }) {
  return (
    <div className={`rounded-lg p-5 ring-1 ${toneStyles[tone] || toneStyles.emerald}`}>
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      {helper && <p className="mt-2 text-sm opacity-80">{helper}</p>}
    </div>
  );
}

export default EngineerDashboardCard;
