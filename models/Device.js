import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  accuracy: { type: Number },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const deviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  deviceName: {
    type: String,
    default: 'My Phone'
  },
  devicePublicKey: {
    type: String
  },
  fcmToken: {
    type: String
  },
  model: {
    type: String
  },
  lastOnline: {
    type: Date,
    default: Date.now
  },
  lastKnownLocation: {
    type: locationSchema
  },
  isLostMode: {
    type: Boolean,
    default: false
  },
  beaconSeed: {
    type: String,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

deviceSchema.index({ userId: 1 });
deviceSchema.index({ deviceId: 1 });

export default mongoose.model('Device', deviceSchema);
