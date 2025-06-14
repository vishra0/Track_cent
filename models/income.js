import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  source: {
    type: String,
    required: true,
    enum: ['Salary', 'Freelance', 'E-commerce', 'Interest from Savings', 'Other'],
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Income || mongoose.model('Income', IncomeSchema);

// ================================