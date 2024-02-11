const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Move this to the top
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ msg: 'User created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Create payload for the token
    const payload = {
      user: {
        id: user.id,
      },
    };


    // Sign the access token
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '59m' });

    // Sign the refresh token
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // res.json({ accessToken, refreshToken });
    // Set tokens in HttpOnly cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 59 * 60 * 1000, // 59 minutes
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    .status(200).json({ msg: 'Login successful', isAuthenticated: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).send('Logged out successfully');
});


router.post('/token', (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Make sure you're using a library like cookie-parser
  if (!refreshToken) {
    return res.status(401).json({ msg: 'Refresh Token is required' });
  }  
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign({ user: payload.user }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({ msg: 'Token is not valid' });
  }
});

router.get('/checkAuth', auth, async (req, res) => {
  try {
    // `req.user.id` is set by your `auth` middleware after successful authentication
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from the details
    res.json({ isAuthenticated: true, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



module.exports = router;
