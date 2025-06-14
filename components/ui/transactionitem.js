import { TrashIcon } from '@heroicons/react/24/outline';

export default function TransactionItem({ transaction, onDelete, type }) {
  const isIncome = type === 'income';
  
  return (
    <div className="group flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">
            {isIncome ? transaction.source : transaction.category}
          </h4>
          <span className={`text-sm font-semibold ${
            isIncome ? 'text-success-600' : 'text-danger-600'
          }`}>
            {isIncome ? '+' : '-'}${transaction.amount.toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          {new Date(transaction.date).toLocaleDateString()}
        </p>
        {transaction.description && (
          <p className="text-xs text-gray-400 mt-1">{transaction.description}</p>
        )}
      </div>
      <button
        onClick={() => onDelete(transaction._id)}
        className="opacity-0 group-hover:opacity-100 ml-4 p-1 text-danger-600 hover:text-danger-800 transition-opacity"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
