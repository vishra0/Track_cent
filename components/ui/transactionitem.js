import { TrashIcon } from '@heroicons/react/24/outline';

export default function TransactionItem({ transaction, onDelete, type }) {
  const isIncome = type === 'income';
  
  return (
    <div className="group flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-medium text-gray-900 truncate">
            {isIncome ? transaction.source : transaction.category}
          </h4>
          <span className={`text-base font-semibold ml-4 ${
            isIncome ? 'text-success-600' : 'text-danger-600'
          }`}>
            {isIncome ? '+' : '-'}${transaction.amount.toLocaleString()}
          </span>
        </div>
        <div className="mt-1 flex items-center text-sm text-gray-500">
          <time dateTime={transaction.date}>
            {new Date(transaction.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </time>
          {transaction.description && (
            <span className="mx-2 text-gray-300">•</span>
          )}
          {transaction.description && (
            <span className="truncate">{transaction.description}</span>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(transaction._id)}
        className="opacity-0 group-hover:opacity-100 ml-4 p-2 text-gray-400 hover:text-danger-600 transition-all duration-200 rounded-full hover:bg-gray-100"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
