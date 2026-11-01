const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'rio_super_secret_bank_key_2026';

// Verify JWT token from Authorization header or cookie
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.startsWith('Bearer '))
    ? authHeader.slice(7)
    : req.cookies?.rio_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in to Rio Banking.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: 'Session expired or invalid security token.'
    });
  }
};

// Strict RBAC Role Guard
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized.' });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access Denied: Role '${req.user.role}' is not authorized to access this banking resource. Required: ${roles.join(', ')}`
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  requireRole,
  JWT_SECRET
};

