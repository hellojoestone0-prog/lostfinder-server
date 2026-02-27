import mongoose from 'mongoose';

const beaconReportSchema = new mongoose.Schema({
  beaconId: {
    type: String,
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
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  encryptedMeta: {
    type: String
  }
});

beaconReportSchema.index({ beaconId: 1, timestamp: -1 });

export default mongoose.model('BeaconReport', beaconReportSchema);
