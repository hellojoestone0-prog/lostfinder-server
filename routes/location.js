import express from 'express';
import * as locationController from '../controllers/locationController.js';
import { protect } from '../middleware/auth.js';
import { locationReportLimiter } from '../middleware/rateLimit.js';
import { validateDeviceIdBody, validateDeviceIdParam } from '../middleware/validateDeviceId.js';

const router = express.Router();

router.post('/report', locationReportLimiter, protect, validateDeviceIdBody, locationController.reportLocation);
router.get('/:deviceId', protect, validateDeviceIdParam, locationController.getLocationHistory);
router.get('/:deviceId/latest', protect, validateDeviceIdParam, locationController.getLatestLocation);

export default router;
