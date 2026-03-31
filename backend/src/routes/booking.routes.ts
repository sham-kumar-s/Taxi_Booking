import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All booking routes require authentication
router.use(authenticate);

router.post('/estimate', BookingController.getFareEstimate);
router.post('/', BookingController.createBooking);
router.get('/my', BookingController.getMyBookings);
router.get('/ref/:ref', BookingController.getBookingByRef);

export default router;
