import Device from '../models/Device.js';

function formatDeviceResponse(device) {
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
  return {
    _id: device._id,
    deviceId: device.deviceId,
    name: device.deviceName,
    model: device.model,
    isOnline: device.lastOnline > fiveMinAgo,
    lastSeen: device.lastOnline,
    lastKnownLocation: device.lastKnownLocation,
    isLostMode: device.isLostMode
  };
}

export const registerDevice = async (req, res) => {
  try {
    const { deviceId, name, model, fcmToken, devicePublicKey } = req.body;
    if (!deviceId || !fcmToken) {
      return res.status(400).json({ error: 'deviceId and fcmToken are required.' });
    }
    const existing = await Device.findOne({ deviceId });
    if (existing) {
      if (!existing.userId.equals(req.user._id)) {
        return res.status(403).json({ error: 'Device already registered to another account.' });
      }
    }
    const device = await Device.findOneAndUpdate(
      { deviceId },
      {
        userId: req.user._id,
        deviceName: name || 'My Phone',
        model,
        fcmToken,
        devicePublicKey,
        lastOnline: new Date()
      },
      { upsert: true, new: true }
    );
    res.status(201).json(formatDeviceResponse(device));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDevices = async (req, res) => {
  try {
    const devices = await Device.find({ userId: req.user._id })
      .sort({ lastOnline: -1 });
    res.json(devices.map(formatDeviceResponse));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const heartbeat = async (req, res) => {
  try {
    const device = await Device.findOne({
      deviceId: req.params.deviceId,
      userId: req.user._id
    });
    if (!device) {
      return res.status(404).json({ error: 'Device not found.' });
    }
    device.lastOnline = new Date();
    if (req.body.fcmToken) device.fcmToken = req.body.fcmToken;
    if (req.body.lastKnownLocation) device.lastKnownLocation = req.body.lastKnownLocation;
    await device.save();
    res.json(formatDeviceResponse(device));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
