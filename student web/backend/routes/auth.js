const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role }, 
    process.env.JWT_SECRET || 'your-secret-key', 
    { expiresIn: '24h' }
  )
}

// @route   POST /api/auth/login
// @desc    Login user (student, parent, or admin)
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body

    console.log('=== LOGIN ATTEMPT ===')
    console.log('Email:', email)
    console.log('Role:', role)
    console.log('Password provided:', !!password)

    // Validate input
    if (!email || !password || !role) {
      console.log('❌ Validation failed: Missing fields')
      return res.status(400).json({ message: 'Please provide email, password, and role' })
    }

    // Find user by email and role
    console.log('Searching for user with email:', email, 'and role:', role)
    const user = await User.findOne({ email, role }).populate('linkedStudentId')

    if (!user) {
      console.log('❌ User not found')
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    console.log('✅ User found:', user.name)

    // Verify password
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      console.log('❌ Invalid password')
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    console.log('✅ Password valid')

    // Generate token
    const token = generateToken(user._id, user.role)

    console.log('✅ Token generated')

    // Send response
    const response = {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        linkedStudentId: user.linkedStudentId?._id || user.linkedStudentId,
      },
    }

    console.log('✅ Login successful for:', user.email)
    console.log('Response:', JSON.stringify(response, null, 2))

    res.json(response)
  } catch (error) {
    console.error('=== LOGIN ERROR ===')
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
    res.status(500).json({ message: 'Server error during login', error: error.message })
  }
})

// @route   POST /api/auth/register
// @desc    Register new user (for admin to create accounts)
// @access  Protected (Admin only)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, linkedStudentId } = req.body

    console.log('=== REGISTER ATTEMPT ===')
    console.log('Name:', name)
    console.log('Email:', email)
    console.log('Role:', role)

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' })
    }

    // Validate linkedStudentId for student and parent roles
    if ((role === 'student' || role === 'parent') && !linkedStudentId) {
      return res.status(400).json({ message: 'linkedStudentId is required for student and parent roles' })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      linkedStudentId: linkedStudentId || null,
    })

    await user.save()

    console.log('✅ User created:', user.email)

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        linkedStudentId: user.linkedStudentId,
      },
    })
  } catch (error) {
    console.error('=== REGISTRATION ERROR ===')
    console.error('Error:', error.message)
    res.status(500).json({ message: 'Server error during registration', error: error.message })
  }
})

module.exports = router
