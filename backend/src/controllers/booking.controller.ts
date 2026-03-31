import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { FareService } from '../services/fareService';
import { BadRequestError, NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

const estimateSchema = z.object({
  pickupLat: z.number().min(-90).max(90),
  pickupLng: z.number().min(-180).max(180),
  dropoffLat: z.number().min(-90).max(90),
  dropoffLng: z.number().min(-180).max(180)
});

const createBookingSchema = z.object({
  vehicleId: z.string().uuid(),
  pickupLocation: z.string().min(3),
  pickupLat: z.number(),
  pickupLng: z.number(),
  dropoffLocation: z.string().min(3),
  dropoffLat: z.number(),
  dropoffLng: z.number()
});

export class BookingController {
  static async getFareEstimate(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = estimateSchema.parse(req.body);

      // Calculate distance
      const distance = FareService.calculateDistance(
        data.pickupLat,
        data.pickupLng,
        data.dropoffLat,
        data.dropoffLng
      );

      if (distance < 0.5) {
        throw new BadRequestError('Distance too short for booking');
      }

      // Get all available vehicles
      const vehicles = await prisma.vehicle.findMany({
        where: { status: 'AVAILABLE' }
      });

      // Calculate fare for each vehicle
      const estimates = vehicles.map(vehicle => ({
        vehicleId: vehicle.id,
        vehicleType: vehicle.type,
        model: vehicle.model,
        capacity: vehicle.capacity,
        distance,
        fare: FareService.calculateFare({
          distance,
          pricePerKm: vehicle.pricePerKm,
          baseFare: vehicle.baseFare
        }),
        imageUrl: vehicle.imageUrl
      }));

      res.json({
        success: true,
        data: {
          distance,
          estimates
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async createBooking(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = createBookingSchema.parse(req.body);
      const userId = req.user!.userId;

      // Verify vehicle exists and is available
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: data.vehicleId }
      });

      if (!vehicle) {
        throw new NotFoundError('Vehicle not found');
      }

      if (vehicle.status !== 'AVAILABLE') {
        throw new BadRequestError('Vehicle is not available');
      }

      // Calculate distance and fare
      const distance = FareService.calculateDistance(
        data.pickupLat,
        data.pickupLng,
        data.dropoffLat,
        data.dropoffLng
      );

      const fare = FareService.calculateFare({
        distance,
        pricePerKm: vehicle.pricePerKm,
        baseFare: vehicle.baseFare
      });

      // Create booking
      const booking = await prisma.booking.create({
        data: {
          userId,
          vehicleId: data.vehicleId,
          pickupLocation: data.pickupLocation,
          pickupLat: data.pickupLat,
          pickupLng: data.pickupLng,
          dropoffLocation: data.dropoffLocation,
          dropoffLat: data.dropoffLat,
          dropoffLng: data.dropoffLng,
          distance,
          fare,
          status: 'CONFIRMED'
        },
        include: {
          vehicle: {
            select: {
              type: true,
              model: true,
              licensePlate: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        data: booking,
        message: `Booking confirmed! Reference: ${booking.bookingRef}`
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyBookings(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.userId;

      const bookings = await prisma.booking.findMany({
        where: { userId },
        include: {
          vehicle: {
            select: {
              type: true,
              model: true,
              licensePlate: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json({
        success: true,
        data: bookings
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBookingByRef(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { ref } = req.params;
      const userId = req.user!.userId;

      const booking = await prisma.booking.findFirst({
        where: {
          bookingRef: ref,
          userId
        },
        include: {
          vehicle: true
        }
      });

      if (!booking) {
        throw new NotFoundError('Booking not found');
      }

      res.json({
        success: true,
        data: booking
      });
    } catch (error) {
      next(error);
    }
  }
}
