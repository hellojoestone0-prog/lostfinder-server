import BeaconRegistration from '../models/BeaconRegistration.js';
import BeaconReport from '../models/BeaconReport.js';
import Device from '../models/Device.js';
import { encrypt } from '../utils/encrypt.js';

export const reportSighting = async (req, res) => {
  try {
    const { beaconId, latitude, longitude, timestamp, encryptedMeta } = req.body;
    if (!beaconId || latitude == null || longitude == null) {
      return res.status(400).json({ error: 'beaconId, latitude, longitude required.' });
    }
    const ts = timestamp ? new Date(timestamp) : new Date();
    const reg = await BeaconRegistration.findOne({
      beaconId,
      validFrom: { $lte: ts },
      validUntil: { $gt: ts }
    });
    if (!reg) {
      return res.status(202).json({ received: true });
    }
    await BeaconReport.create({
      beaconId,
      latitude,
      longitude,
      timestamp: ts,
      encryptedMeta: encryptedMeta || encrypt({ deviceId: reg.deviceId, reportedAt: new Date() })
    });
    res.status(201).json({ received: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOfflineSighting = async (req, res) => {
  try {
    const device = await Device.findOne({ deviceId: req.params.deviceId, userId: req.user._id });
    if (!device) {
      return res.status(404).json({ error: 'Device not found.' });
    }
    const regs = await BeaconRegistration.find({ deviceId: req.params.deviceId })
      .distinct('beaconId');
    if (regs.length === 0) {
      return res.status(404).json({ error: 'No offline sightings yet.' });
    }
    const report = await BeaconReport.findOne({ beaconId: { $in: regs } })
      .sort({ timestamp: -1 })
      .lean();
    if (!report) {
      return res.status(404).json({ error: 'No offline sightings yet.' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOfflineHistory = async (req, res) => {
  try {
    const device = await Device.findOne({ deviceId: req.params.deviceId, userId: req.user._id });
    if (!device) {
      return res.status(404).json({ error: 'Device not found.' });
    }
    const regs = await BeaconRegistration.find({ deviceId: req.params.deviceId })
      .distinct('beaconId');
    if (regs.length === 0) {
      return res.json([]);
    }
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const reports = await BeaconReport.find({ beaconId: { $in: regs } })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
