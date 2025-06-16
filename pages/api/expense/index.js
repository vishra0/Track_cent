import dbConnect from '../../../lib/mongodb';
import Expense from '../../../models/Expense';
import { authenticate } from '../../../middleware/auth';

export default async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === 'GET') {
      const authHandler = authenticate(req, res, async () => {
        try {
          const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
          return res.status(200).json(expenses);
        } catch (error) {
          return res.status(500).json({ error: 'Failed to fetch expenses' });
        }
      });
      return authHandler();
    }

    if (req.method === 'POST') {
      const authHandler = authenticate(req, res, async () => {
        try {
          const { category, amount, date, description } = req.body;
          
          if (!category || !amount || !date) {
            return res.status(400).json({ error: 'Category, amount, and date are required' });
          }

          const expense = await Expense.create({
            userId: req.user._id,
            category,
            amount: Number(amount),
            date: new Date(date),
            description,
          });

          return res.status(201).json(expense);
        } catch (error) {
          return res.status(500).json({ error: 'Failed to create expense' });
        }
      });
      return authHandler();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}