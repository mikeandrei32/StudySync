import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  teacher: {
    type: String,
    trim: true
  },
  schedule: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#4f46e5'
  }
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);