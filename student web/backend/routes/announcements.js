const express = require('express')
const router = express.Router()
const Announcement = require('../models/Announcement')
const auth = require('../middleware/auth')

// @route   GET /api/announcements
// @desc    Get all announcements
// @access  Protected
router.get('/', auth, async (req, res) => {
  try {
    const { limit } = req.query
    
    let query = Announcement.find().sort({ createdAt: -1 })
    
    if (limit) {
      query = query.limit(parseInt(limit))
    }
    
    const announcements = await query
    res.json(announcements)
  } catch (error) {
    console.error('Error fetching announcements:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/announcements/:id
// @desc    Get announcement by ID
// @access  Protected
router.get('/:id', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' })
    }

    res.json(announcement)
  } catch (error) {
    console.error('Error fetching announcement:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/announcements
// @desc    Create new announcement
// @access  Protected (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, message } = req.body

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' })
    }

    const announcement = new Announcement({
      title,
      message,
    })

    await announcement.save()
    res.status(201).json(announcement)
  } catch (error) {
    console.error('Error creating announcement:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   PUT /api/announcements/:id
// @desc    Update announcement
// @access  Protected (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' })
    }

    res.json(announcement)
  } catch (error) {
    console.error('Error updating announcement:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement
// @access  Protected (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id)

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' })
    }

    res.json({ message: 'Announcement deleted successfully' })
  } catch (error) {
    console.error('Error deleting announcement:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
