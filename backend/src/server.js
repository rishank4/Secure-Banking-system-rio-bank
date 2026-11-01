require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const securityMiddleware = require('./middleware/security');

const authRoutes = require('./routes/auth.routes');
const managerRoutes = require('./routes/manager.routes');
const employeeRoutes = require('./routes/employee.routes');
const customerRoutes = require('./routes/customer.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security and CORS
securityMiddleware(app);

// Request body and cookie parsers
app.use(express.json({ limit: '50kb' }));
app.use(cookieParser());

// Base Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Rio Banking Core API Gateway',
    currency: 'INR'
  });
});

// Mounted Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/manager', managerRoutes);
app.use('/api/v1/employee', employeeRoutes);
app.use('/api/v1/customer', customerRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Rio Server Error]:', err);
  res.status(500).json({
    success: false,
    error: 'Internal banking system error. Please contact Rio IT Support.'
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Rio Banking Core API Server active on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(`====================================================`);
});

