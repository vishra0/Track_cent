export default function StatsCard({ title, value, icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-success-50 text-success-600',
    danger: 'bg-danger-50 text-danger-600',
  };

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-1.5 rounded-md ${colorClasses[color]}`}>
              {icon}
            </div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          </div>
          <p className="text-lg font-semibold text-gray-900">${value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
