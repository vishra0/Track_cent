import dbConnect from '../../../lib/mongodb';
import Income from '../../../models/Income';
import { authenticate } from '../../../middleware/auth';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    return authenticate(req, res, async () => {
      try {
        const incomes = await Income.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(incomes);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch incomes' });
      }
    });
  }

  if (req.method === 'POST') {
    return authenticate(req, res, async () => {
      try {
        const { source, amount, date, description } = req.body;
        
        if (!source || !amount || !date) {
          return res.status(400).json({ error: 'Source, amount, and date are required' });
        }

        const income = await Income.create({
          userId: req.user._id,
          source,
          amount: Number(amount),
          date: new Date(date),
          description,
        });

        res.status(201).json(income);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create income' });
      }
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
}