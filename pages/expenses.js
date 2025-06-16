import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '../utils/axios';
import Layout from '../components/Layout/Layout';
import ExpenseForm from '../components/forms/expenseform';
import TransactionItem from '../components/UI/TransactionItem';
import { useAuth } from '../context/AuthContext';

export default function Expenses() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (user) {
      fetchExpenses();
    }
  }, [user, authLoading, router]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('/api/expense');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      await axios.post('/api/expense', data);
      fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/expense/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Manage your expenses</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ExpenseForm onSubmit={handleSubmit} />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Expenses</h2>
                <div className="space-y-4">
                  {expenses.map((expense) => (
                    <TransactionItem
                      key={expense._id}
                      transaction={expense}
                      type="expense"
                      onDelete={() => handleDelete(expense._id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 