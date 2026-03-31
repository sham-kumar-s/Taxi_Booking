import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { NotFoundError, BadRequestError } from '../utils/errors';

const prisma = new PrismaClient();

const createVehicleSchema = z.object({
  type: z.string().min(2),
  model: z.string().min(2),
  licensePlate: z.string().min(3),
  capacity: z.number().int().min(1).max(20),
  pricePerKm: z.number().min(0),
  baseFare: z.number().min(0),
  imageUrl: z.string().url().optional()
});

const updateVehicleSchema = createVehicleSchema.partial();

const updateBookingStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
});

export class AdminController {
  // Vehicle Management
  static async getAllVehicles(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const vehicles = await prisma.vehicle.findMany({
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        data: vehicles
      });
    } catch (error) {
      next(error);
    }
  }

  static async createVehicle(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = createVehicleSchema.parse(req.body);

      const vehicle = await prisma.vehicle.create({
        data
      });

      res.status(201).json({
        success: true,
        data: vehicle,
        message: 'Vehicle created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateVehicle(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const data = updateVehicleSchema.parse(req.body);

      const vehicle = await prisma.vehicle.update({
        where: { id },
        data
      });

      res.json({
        success: true,
        data: vehicle,
        message: 'Vehicle updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteVehicle(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      // Check if vehicle has active bookings
      const activeBookings = await prisma.booking.count({
        where: {
          vehicleId: id,
          status: {
            in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
          }
        }
      });

      if (activeBookings > 0) {
        throw new BadRequestError(
          'Cannot delete vehicle with active bookings'
        );
      }

      await prisma.vehicle.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Vehicle deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Booking Management
  static async getAllBookings(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { status } = req.query;

      const bookings = await prisma.booking.findMany({
        where: status ? { status: status as any } : undefined,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
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

  static async updateBookingStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { status } = updateBookingStatusSchema.parse(req.body);

      const booking = await prisma.booking.update({
        where: { id },
        data: { status },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          vehicle: {
            select: {
              type: true,
              model: true
            }
          }
        }
      });

      res.json({
        success: true,
        data: booking,
        message: 'Booking status updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDashboardStats(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const [
        totalBookings,
        activeBookings,
        completedBookings,
        totalRevenue,
        totalVehicles,
        availableVehicles
      ] = await Promise.all([
        prisma.booking.count(),
        prisma.booking.count({
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
            }
          }
        }),
        prisma.booking.count({
          where: { status: 'COMPLETED' }
        }),
        prisma.booking.aggregate({
          where: { status: 'COMPLETED' },
          _sum: { fare: true }
        }),
        prisma.vehicle.count(),
        prisma.vehicle.count({
          where: { status: 'AVAILABLE' }
        })
      ]);

      res.json({
        success: true,
        data: {
          totalBookings,
          activeBookings,
          completedBookings,
          totalRevenue: totalRevenue._sum.fare || 0,
          totalVehicles,
          availableVehicles
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
