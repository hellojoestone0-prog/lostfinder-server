import mongoose from 'mongoose';

const beaconRegistrationSchema = new mongoose.Schema({
  beaconId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
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
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

beaconRegistrationSchema.index({ validUntil: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('BeaconRegistration', beaconRegistrationSchema);
