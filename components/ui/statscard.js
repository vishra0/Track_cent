export default function StatsCard({ title, value, icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white rounded shadow border p-3 flex items-center gap-2">
      <div className={`p-1 rounded ${colorClasses[color]}`}>{icon}</div>
      <div className="flex flex-col flex-1">
        <span className="text-xs text-gray-500 font-medium">{title}</span>
        <span className="text-base font-semibold text-gray-900">${value.toLocaleString()}</span>
      </div>
    </div>
  );
}
