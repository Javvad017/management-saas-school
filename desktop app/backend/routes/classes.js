import express from 'express';
import Class from '../models/Class.js';

const router = express.Router();

// Get all classes with populated teacher
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('teacherId', 'name subject')
      .sort({ createdAt: -1 });
    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new class
router.post('/', async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    const populatedClass = await Class.findById(newClass._id)
      .populate('teacherId', 'name subject');
    res.status(201).json(populatedClass);
  } catch (error) {
    console.error('Add class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete class
router.delete('/:id', async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
