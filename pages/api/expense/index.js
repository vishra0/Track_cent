import dbConnect from '../../../lib/mongodb';
import Expense from '../../../models/Expense';
import { authenticate } from '../../../middleware/auth';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    return authenticate(req, res, async () => {
      try {
        const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(expenses);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch expenses' });
      }
    });
  }

  if (req.method === 'POST') {
    return authenticate(req, res, async () => {
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

        res.status(201).json(expense);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create expense' });
      }
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
}