const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Routes
const siteRoutes = require('./routes/siteRoutes');
const zoningRoutes = require('./routes/zoningRoutes');
const environmentalRoutes = require('./routes/environmentalRoutes');
const feasibilityRoutes = require('./routes/feasibilityRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/sites', siteRoutes);
app.use('/api/zoning', zoningRoutes);
app.use('/api/environmental', environmentalRoutes);
app.use('/api/feasibility', feasibilityRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'SiteScout API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 