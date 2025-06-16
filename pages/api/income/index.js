import dbConnect from '../../../lib/mongodb';
import Income from '../../../models/Income';
import { authenticate } from '../../../middleware/auth';

export default async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === 'GET') {
      const authHandler = authenticate(req, res, async () => {
        try {
          const incomes = await Income.find({ userId: req.user._id }).sort({ date: -1 });
          return res.status(200).json(incomes);
        } catch (error) {
          return res.status(500).json({ error: 'Failed to fetch incomes' });
        }
      });
      return authHandler();
    }

    if (req.method === 'POST') {
      const authHandler = authenticate(req, res, async () => {
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

          return res.status(201).json(income);
        } catch (error) {
          return res.status(500).json({ error: 'Failed to create income' });
        }
      });
      return authHandler();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}