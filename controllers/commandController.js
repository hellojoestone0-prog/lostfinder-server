import Device from '../models/Device.js';
import { sendCommand } from '../services/fcm.js';

export const sendDeviceCommand = async (req, res, command) => {
  try {
    const { deviceId } = req.params;
    const device = await Device.findOne({
      deviceId,
      userId: req.user._id
    });
    if (!device) {
      return res.status(404).json({ error: 'Device not found.' });
    }
    if (!device.fcmToken) {
      return res.status(409).json({ error: 'Device has no FCM token. Open app on target device to refresh push registration.' });
    }
    const result = await sendCommand(device.fcmToken, command);
    res.json({ success: true, messageId: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
