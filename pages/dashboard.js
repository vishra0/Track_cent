import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '../utils/axios';
import Layout from '../components/Layout/Layout';
import StatsCard from '../components/UI/StatsCard';
import TransactionItem from '../components/UI/TransactionItem';
import PieChartComponent from '../components/Charts/PieChartComponent';
import BarChartComponent from '../components/Charts/BarChartComponent';
import { useAuth } from '../context/AuthContext';
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusCircleIcon,
  MinusCircleIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (user) {
      fetchData();
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      const [incomesRes, expensesRes] = await Promise.all([
        axios.get('/api/income'),
        axios.get('/api/expense'),
      ]);
      
      setIncomes(incomesRes.data);
      setExpenses(expensesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id, type) => {
    try {
      await axios.delete(`/api/${type}/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Calculate totals
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBalance = totalIncome - totalExpenses;

  // Recent transactions (last 5)
  const allTransactions = [
    ...incomes.map(income => ({ ...income, type: 'income' })),
    ...expenses.map(expense => ({ ...expense, type: 'expense' })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Financial Overview Pie Chart Data
  const financialOverviewData = {
    labels: ['Balance', 'Expenses'],
    datasets: [
      {
        data: [totalBalance > 0 ? totalBalance : 0, totalExpenses],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  // 30-Day Expense Overview by Category
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentExpenses = expenses.filter(expense => new Date(expense.date) >= thirtyDaysAgo);
  const expensesByCategory = recentExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const expenseCategoryData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        label: 'Amount',
        data: Object.values(expensesByCategory),
        backgroundColor: '#ef4444',
        borderColor: '#dc2626',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Action Buttons */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push('/income')}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors"
            >
              <PlusCircleIcon className="h-4 w-4 mr-1.5" />
              Add Income
            </button>
            <button
              onClick={() => router.push('/expenses')}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-danger-600 bg-danger-50 rounded-md hover:bg-danger-100 transition-colors"
            >
              <MinusCircleIcon className="h-4 w-4 mr-1.5" />
              Add Expense
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Total Balance"
            value={totalBalance}
            icon={<BanknotesIcon className="h-4 w-4" />}
          />
          <StatsCard
            title="Total Income"
            value={totalIncome}
            icon={<ArrowTrendingUpIcon className="h-4 w-4" />}
          />
          <StatsCard
            title="Total Expenses"
            value={totalExpenses}
            icon={<ArrowTrendingDownIcon className="h-4 w-4" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Financial Overview</h2>
            <div className="h-64">
              <PieChartComponent data={financialOverviewData} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Expense Categories (30 Days)</h2>
            <div className="h-64">
              <BarChartComponent data={expenseCategoryData} />
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-sm font-medium text-gray-900">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {allTransactions.map((transaction) => (
              <TransactionItem
                key={`${transaction.type}-${transaction._id}`}
                transaction={transaction}
                type={transaction.type}
                onDelete={() => handleDeleteTransaction(transaction._id, transaction.type)}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// TRACK CENT - FULL STACK FINANCE MANAGEMENT APPLICATION
// This is a comprehensive Next.js application with the complete file structure
