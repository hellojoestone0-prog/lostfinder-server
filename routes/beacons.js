import express from 'express';
import * as beaconController from '../controllers/beaconController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/register', beaconController.registerBeaconIds);
router.post('/', beaconController.upsertBeacon);
router.get('/', beaconController.getBeacons);

export default router;
