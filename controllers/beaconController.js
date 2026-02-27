import Beacon from '../models/Beacon.js';
import BeaconRegistration from '../models/BeaconRegistration.js';
import Device from '../models/Device.js';

export const registerBeaconIds = async (req, res) => {
  try {
    const { deviceId, beaconIds } = req.body;
    if (!deviceId || !Array.isArray(beaconIds) || beaconIds.length === 0) {
      return res.status(400).json({ error: 'deviceId and beaconIds array required.' });
    }
    const device = await Device.findOne({ deviceId, userId: req.user._id });
    if (!device) {
      return res.status(404).json({ error: 'Device not found.' });
    }
    const bulk = beaconIds.map(({ id, validFrom, validUntil }) => ({
      updateOne: {
        filter: { beaconId: id },
        update: {
          beaconId: id,
          deviceId,
          userId: req.user._id,
          validFrom: new Date(validFrom),
          validUntil: new Date(validUntil)
        },
        upsert: true
      }
    }));
    await BeaconRegistration.bulkWrite(bulk);
    res.json({ registered: beaconIds.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const upsertBeacon = async (req, res) => {
  try {
    const { deviceId, beaconId, name } = req.body;
    if (!deviceId || !beaconId) {
      return res.status(400).json({ error: 'deviceId and beaconId are required.' });
    }
    const beacon = await Beacon.findOneAndUpdate(
      { userId: req.user._id, beaconId },
      { deviceId, name, lastSeen: new Date() },
      { upsert: true, new: true }
    );
    res.status(201).json(beacon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBeacons = async (req, res) => {
  try {
    const beacons = await Beacon.find({ userId: req.user._id });
    res.json(beacons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
