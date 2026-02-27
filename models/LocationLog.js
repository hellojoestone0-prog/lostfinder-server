import mongoose from 'mongoose';

const locationLogSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number
  },
  batteryLevel: {
    type: Number
  },
  encryptedPayload: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

locationLogSchema.index({ deviceId: 1, timestamp: -1 });

export default mongoose.model('LocationLog', locationLogSchema, 'locationlogs');
