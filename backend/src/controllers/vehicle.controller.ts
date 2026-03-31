import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export class VehicleController {
  static async getAvailableVehicles(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const vehicles = await prisma.vehicle.findMany({
        where: {
          status: 'AVAILABLE'
        },
        orderBy: {
          pricePerKm: 'asc'
        }
      });

      res.json({
        success: true,
        data: vehicles
      });
    } catch (error) {
      next(error);
    }
  }

  static async getVehicleById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const vehicle = await prisma.vehicle.findUnique({
        where: { id }
      });

      if (!vehicle) {
        throw new NotFoundError('Vehicle not found');
      }

      res.json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      next(error);
    }
  }
}
