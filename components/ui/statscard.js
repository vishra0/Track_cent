export default function StatsCard({ title, value, icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-success-50 text-success-600',
    danger: 'bg-danger-50 text-danger-600',
  };

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-md border border-gray-100 max-w-sm w-full mx-auto">
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-md ${colorClasses[color]}`}>
              {icon}
            </div>
            <h3 className="text-base font-medium text-gray-500">{title}</h3>
          </div>
          <p className="text-xl font-semibold text-gray-900">${value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
