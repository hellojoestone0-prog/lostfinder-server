/**
 * Validates deviceId format. Rejects invalid IDs to prevent injection/spoofing.
 * Android ID: 16 hex chars. UUID: 36 chars with hyphens. Allow alphanumeric + hyphen.
 */
const DEVICE_ID_REGEX = /^[a-zA-Z0-9\-]{8,64}$/;

export const validateDeviceIdParam = (req, res, next) => {
  const deviceId = req.params.deviceId;
  if (!deviceId || typeof deviceId !== 'string') {
    return res.status(400).json({ error: 'Device ID is required.' });
  }
  const trimmed = deviceId.trim();
  if (!DEVICE_ID_REGEX.test(trimmed)) {
    return res.status(400).json({ error: 'Invalid device ID format.' });
  }
  req.params.deviceId = trimmed;
  next();
};

export const validateDeviceIdBody = (req, res, next) => {
  const deviceId = req.body?.deviceId;
  if (!deviceId || typeof deviceId !== 'string') {
    return res.status(400).json({ error: 'deviceId is required.' });
  }
  const trimmed = deviceId.trim();
  if (!DEVICE_ID_REGEX.test(trimmed)) {
    return res.status(400).json({ error: 'Invalid device ID format.' });
  }
  req.body.deviceId = trimmed;
  next();
};
