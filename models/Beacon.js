import mongoose from 'mongoose';

const beaconSchema = new mongoose.Schema({
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
  beaconId: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

beaconSchema.index({ userId: 1, beaconId: 1 }, { unique: true });

export default mongoose.model('Beacon', beaconSchema);
