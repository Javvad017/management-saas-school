import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('=== Login Attempt ===');
    console.log('Email:', email);
    console.log('Password length:', password?.length);

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find admin
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    console.log('Admin found:', admin ? 'YES' : 'NO');
    
    if (!admin) {
      console.log('No admin found with email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Stored password hash:', admin.password?.substring(0, 20) + '...');

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('Password match:', isMatch ? 'YES' : 'NO');
    
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Login successful! Generating token...');

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Token generated successfully');
    console.log('===================');

    res.json({
      success: true,
      token,
      user: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

export default router;
