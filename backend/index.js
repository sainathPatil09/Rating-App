// index.js
import './tracing.mjs';                 // MUST be first
import './enhancedInstrumentation.mjs'; // Metrics
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { enhancedMetricsMiddleware } from './enhancedInstrumentation.mjs';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import ownerRoutes from './routes/ownerRoutes.js';
import accountRoutes from './routes/accountRoutes.js';

connectDB();

const app = express();
app.use(express.json());

// CORS
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Metrics middleware
app.use(enhancedMetricsMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/account', accountRoutes);

// Health check
app.get('/api/ok', (req, res) => res.send('Everything is working 🚀'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
