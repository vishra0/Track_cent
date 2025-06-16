import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '../utils/axios';
import Layout from '../components/Layout/Layout';
import IncomeForm from '../components/forms/incomeform';
import TransactionItem from '../components/UI/TransactionItem';
import { useAuth } from '../context/AuthContext';

export default function Income() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (user) {
      fetchIncomes();
    }
  }, [user, authLoading, router]);

  const fetchIncomes = async () => {
    try {
      const response = await axios.get('/api/income');
      setIncomes(response.data);
    } catch (error) {
      console.error('Error fetching incomes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      await axios.post('/api/income', data);
      fetchIncomes();
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/income/${id}`);
      fetchIncomes();
    } catch (error) {
      console.error('Error deleting income:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Income</h1>
          <p className="text-gray-600">Manage your income sources</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <IncomeForm onSubmit={handleSubmit} />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Income</h2>
                <div className="space-y-4">
                  {incomes.map((income) => (
                    <TransactionItem
                      key={income._id}
                      transaction={income}
                      type="income"
                      onDelete={() => handleDelete(income._id)}
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