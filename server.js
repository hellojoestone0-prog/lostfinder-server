import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { apiLimiter } from './middleware/rateLimit.js';
import authRoutes from './routes/auth.js';
import deviceRoutes from './routes/devices.js';
import commandRoutes from './routes/commands.js';
import locationRoutes from './routes/location.js';
import beaconRoutes from './routes/beacons.js';
import sightingRoutes from './routes/sightings.js';

// Connect MongoDB (server still starts if it fails - for debugging)
let dbConnected = false;
connectDB()
  .then(() => { dbConnected = true; })
  .catch((err) => {
    console.error('MongoDB not available:', err.message);
    console.error('Start MongoDB or run: mongod');
  });

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/commands', commandRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/beacons', beaconRoutes);
app.use('/api/sightings', sightingRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok', db: dbConnected }));

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend working' });
});

app.get('/db-test', async (_, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.send('MongoDB is connected');
  } catch (err) {
    res.status(500).send('MongoDB not connected');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
