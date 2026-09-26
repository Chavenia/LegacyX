require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRouter = require('./routes/api');
const sandboxManager = require('./services/sandboxManager');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for React Dashboard UI
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser with generous payload limit for code diffs
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[LegacyX API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Mount LegacyX REST API
app.use('/api', apiRouter);

// Root Welcome & Architecture Status Route
app.get('/', (req, res) => {
  res.json({
    engine: 'LegacyX AI Modernization Sidecar',
    version: '1.0.0',
    status: 'ACTIVE',
    architecture: {
      layer1_developerExecution: 'IBM Bob 2.0 Engine (Subagents A, B, C)',
      layer2_governanceInterface: 'React Dashboard & Express REST Server',
      layer3_watsonxOrchestrate: 'Slack Block Kit Gateway & Approval System'
    },
    sandboxDir: sandboxManager.baseDir,
    endpoints: {
      scan: 'POST /api/scan',
      refactor: 'POST /api/refactor',
      diff: 'GET /api/diff/:sandboxId',
      buildTest: 'POST /api/build-test',
      deliver: 'POST /api/deliver',
      sandboxes: 'GET /api/sandboxes',
      health: 'GET /api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[LegacyX Error]', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

const server = app.listen(PORT, () => {
  console.log('=================================================================');
  console.log(`   🚀 LegacyX Backend Engine Online on http://localhost:${PORT}`);
  console.log(`   📦 Sandbox Directory: ${sandboxManager.baseDir}`);
  console.log(`   🤖 IBM Bob 2.0 Agent Mode: Ready`);
  console.log('=================================================================');
});

module.exports = { app, server };
