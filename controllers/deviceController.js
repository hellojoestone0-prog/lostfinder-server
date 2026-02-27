import Device from '../models/Device.js';

function formatDeviceResponse(device) {
  const onlineWindowMinutes = Number(process.env.ONLINE_WINDOW_MINUTES || 15);
  const onlineCutoff = new Date(Date.now() - onlineWindowMinutes * 60 * 1000);
  return {
    _id: device._id,
    deviceId: device.deviceId,
    name: device.deviceName,
    model: device.model,
    isOnline: device.lastOnline > onlineCutoff,
    lastSeen: device.lastOnline,
    lastKnownLocation: device.lastKnownLocation,
    isLostMode: device.isLostMode
  };
}

export const registerDevice = async (req, res) => {
  try {
    const { deviceId, name, model, fcmToken, devicePublicKey } = req.body;
    if (!deviceId) {
      return res.status(400).json({ error: 'deviceId is required.' });
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
        ...(fcmToken ? { fcmToken } : {}),
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
    const update = {
      lastOnline: new Date()
    };
    if (req.body?.fcmToken) update.fcmToken = req.body.fcmToken;
    if (req.body?.lastKnownLocation) update.lastKnownLocation = req.body.lastKnownLocation;
    const device = await Device.findOneAndUpdate(
      { deviceId: req.params.deviceId, userId: req.user._id },
      {
        $set: update,
        $setOnInsert: {
          userId: req.user._id,
          deviceId: req.params.deviceId,
          deviceName: 'My Phone'
        }
      },
      { upsert: true, new: true }
    );
    res.json(formatDeviceResponse(device));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
