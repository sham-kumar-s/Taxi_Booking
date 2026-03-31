import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';

const router = Router();

router.get('/', VehicleController.getAvailableVehicles);
router.get('/:id', VehicleController.getVehicleById);

export default router;
