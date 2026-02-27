import express from 'express';
import * as deviceController from '../controllers/deviceController.js';
import { protect } from '../middleware/auth.js';
import { validateDeviceIdBody, validateDeviceIdParam } from '../middleware/validateDeviceId.js';

const router = express.Router();

router.use(protect);

router.post('/register', validateDeviceIdBody, deviceController.registerDevice);
router.get('/', deviceController.getDevices);
router.put('/:deviceId/heartbeat', validateDeviceIdParam, deviceController.heartbeat);

export default router;
