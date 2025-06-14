import dbConnect from '../../../lib/mongodb';
import Income from '../../../models/Income';
import { authenticate } from '../../../middleware/auth';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === 'DELETE') {
    return authenticate(req, res, async () => {
      try {
        const income = await Income.findOneAndDelete({ 
          _id: id, 
          userId: req.user._id 
        });
        
        if (!income) {
          return res.status(404).json({ error: 'Income not found' });
        }

        res.json({ message: 'Income deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete income' });
      }
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
