import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', AdminController.getDashboardStats);

// Vehicle management
router.get('/vehicles', AdminController.getAllVehicles);
router.post('/vehicles', AdminController.createVehicle);
router.put('/vehicles/:id', AdminController.updateVehicle);
router.delete('/vehicles/:id', AdminController.deleteVehicle);

// Booking management
router.get('/bookings', AdminController.getAllBookings);
router.patch('/bookings/:id/status', AdminController.updateBookingStatus);

export default router;
