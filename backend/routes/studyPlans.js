import express from 'express';
import StudyPlan from '../models/StudyPlan.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all study plans for current user
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.user.id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const plans = await StudyPlan.find(query)
      .populate('subject', 'name color')
      .sort({ date: 1, startTime: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new study plan
router.post('/', auth, async (req, res) => {
  try {
    const plan = new StudyPlan({
      ...req.body,
      user: req.user.id
    });
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a study plan
router.put('/:id', auth, async (req, res) => {
  try {
    const plan = await StudyPlan.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!plan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }
    res.json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark study plan as completed
router.patch('/:id/complete', auth, async (req, res) => {
  try {
    const plan = await StudyPlan.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { completed: true },
      { new: true }
    );
    if (!plan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }
    res.json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a study plan
router.delete('/:id', auth, async (req, res) => {
  try {
    const plan = await StudyPlan.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!plan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }
    res.json({ message: 'Study plan deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;