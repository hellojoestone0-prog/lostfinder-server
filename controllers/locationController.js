import LocationLog from '../models/LocationLog.js';
import Device from '../models/Device.js';
import { encrypt } from '../utils/encrypt.js';

const isValidCoord = (n) => typeof n === 'number' && !Number.isNaN(n);
const validLat = (n) => isValidCoord(n) && n >= -90 && n <= 90;
const validLng = (n) => isValidCoord(n) && n >= -180 && n <= 180;

export const reportLocation = async (req, res) => {
  try {
    const { deviceId, latitude, longitude, accuracy, batteryLevel } = req.body;
    if (!deviceId || latitude == null || longitude == null) {
      return res.status(400).json({ error: 'deviceId, latitude, longitude required.' });
    }
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!validLat(lat) || !validLng(lng)) {
      return res.status(400).json({ error: 'Invalid coordinates. Lat -90 to 90, lng -180 to 180.' });
    }
    const device = await Device.findOne({
      deviceId,
      userId: req.user._id
    });
    if (!device) {
      return res.status(404).json({ error: 'Device not found.' });
    }
    const payload = { latitude: lat, longitude: lng, accuracy: accuracy ?? null, batteryLevel: batteryLevel ?? null, timestamp: new Date() };
    const encryptedPayload = encrypt(payload);
    const log = await LocationLog.create({
      deviceId,
      userId: req.user._id,
      latitude: lat,
      longitude: lng,
      accuracy,
      batteryLevel: batteryLevel ?? null,
      encryptedPayload
    });
    device.lastKnownLocation = { latitude: lat, longitude: lng, accuracy, timestamp: new Date() };
    device.lastOnline = new Date();
    await device.save();
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLocationHistory = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const logs = await LocationLog.find({
      deviceId,
      userId: req.user._id
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLatestLocation = async (req, res) => {
  try {
    const log = await LocationLog.findOne({
      deviceId: req.params.deviceId,
      userId: req.user._id
    })
      .sort({ timestamp: -1 })
      .select('latitude longitude accuracy timestamp')
      .lean();
    if (!log) {
      return res.status(404).json({ error: 'No location data found.' });
    }
    const lat = Number(log.latitude);
    const lng = Number(log.longitude);
    if (Number.isNaN(lat) || Number.isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(500).json({ error: 'Invalid location data.' });
    }
    res.json({
      latitude: lat,
      longitude: lng,
      accuracy: log.accuracy ?? null,
      timestamp: log.timestamp
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
