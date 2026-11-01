const express = require('express');
const jwt = require('jsonwebtoken');
const store = require('../data/store');
const { verifyToken, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// POST /api/v1/auth/login
router.post('/login', (req, res) => {
  const { username, role } = req.body;

  let user = null;
  if (username) {
    user = store.findUserByEmail(username);
  } else if (role) {
    // Quick demo selector by role
    user = store.users.find(u => u.role === role);
  }

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid user credentials. Please choose one of the demo banking accounts.'
    });
  }

  // Generate JWT with 1 hour expiration
  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      accountNumber: user.accountNumber || null
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.cookie('rio_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 3600000
  });

  res.json({
    success: true,
    message: `Signed in successfully as ${user.name} (${user.role.toUpperCase()})`,
    token,
    user
  });
});

// GET /api/v1/auth/me
router.get('/me', verifyToken, (req, res) => {
  const user = store.findUserById(req.user.userId);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  res.json({ success: true, user });
});

// POST /api/v1/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('rio_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;

