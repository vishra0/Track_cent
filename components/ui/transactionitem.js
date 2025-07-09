import { TrashIcon } from '@heroicons/react/24/outline';

export default function TransactionItem({ transaction, onDelete, type }) {
  const isIncome = type === 'income';
  
  return (
    <div className="group flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded transition-all">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-900 truncate">
            {isIncome ? transaction.source : transaction.category}
          </span>
          <span className={`text-xs font-semibold ml-2 ${isIncome ? 'text-green-600' : 'text-red-600'}`}> 
            {isIncome ? '+' : '-'}${transaction.amount.toLocaleString()}
          </span>
        </div>
        <div className="mt-0.5 flex items-center text-[10px] text-gray-400">
          <time dateTime={transaction.date}>
            {new Date(transaction.date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric'
            })}
          </time>
          {transaction.description && <span className="mx-1">•</span>}
          {transaction.description && <span className="truncate">{transaction.description}</span>}
        </div>
      </div>
      <button
        onClick={() => onDelete(transaction._id)}
        className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-gray-400 hover:text-red-600 transition rounded-full hover:bg-gray-100"
        title="Delete"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
