import express from 'express';
import * as commandController from '../controllers/commandController.js';
import { protect } from '../middleware/auth.js';
import { validateDeviceIdParam } from '../middleware/validateDeviceId.js';

const router = express.Router();

router.use(protect);

router.post('/:deviceId/ring', validateDeviceIdParam, (req, res) => commandController.sendDeviceCommand(req, res, 'ring'));
router.post('/:deviceId/lock', validateDeviceIdParam, (req, res) => commandController.sendDeviceCommand(req, res, 'lock'));
router.post('/:deviceId/wipe', validateDeviceIdParam, (req, res) => commandController.sendDeviceCommand(req, res, 'wipe'));

export default router;
