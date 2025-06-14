import dbConnect from '../../../lib/mongodb';
import Expense from '../../../models/Expense';
import { authenticate } from '../../../middleware/auth';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === 'DELETE') {
    return authenticate(req, res, async () => {
      try {
        const expense = await Expense.findOneAndDelete({ 
          _id: id, 
          userId: req.user._id 
        });
        
        if (!expense) {
          return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({ message: 'Expense deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete expense' });
      }
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
}