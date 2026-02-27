import express from 'express';
import * as sightingController from '../controllers/sightingController.js';
import { protect } from '../middleware/auth.js';
import { validateDeviceIdParam } from '../middleware/validateDeviceId.js';

const router = express.Router();

router.post('/', sightingController.reportSighting);
router.get('/:deviceId/offline', protect, validateDeviceIdParam, sightingController.getOfflineSighting);
router.get('/:deviceId/offline/history', protect, validateDeviceIdParam, sightingController.getOfflineHistory);

export default router;
