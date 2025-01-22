import express from 'express';
import { vehicleController } from '../controllers/vehicleController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(auth);

router.get('/', vehicleController.getVehicles);
router.post('/', vehicleController.createVehicle);
router.get('/:id', vehicleController.getVehicle);
router.delete('/:id', vehicleController.deleteVehicle);
router.patch('/:id/status', vehicleController.updateVehicleStatus);

export default router; 