import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@taxibooking.com' },
    update: {},
    create: {
      email: 'admin@taxibooking.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      phone: '+1234567890',
      role: 'ADMIN'
    }
  });
  console.log('✓ Admin user created');

  // Create test customer
  const customerPassword = await bcrypt.hash('Customer@123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      email: 'customer@test.com',
      passwordHash: customerPassword,
      name: 'Test Customer',
      phone: '+1234567891',
      role: 'CUSTOMER'
    }
  });
  console.log('✓ Test customer created');

  // Create vehicles
  const vehicles = [
    {
      type: 'Economy',
      model: 'Toyota Corolla',
      licensePlate: 'ABC-1234',
      capacity: 4,
      pricePerKm: 2.5,
      baseFare: 50,
      status: 'AVAILABLE' as const,
      imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'
    },
    {
      type: 'Sedan',
      model: 'Honda Accord',
      licensePlate: 'XYZ-5678',
      capacity: 4,
      pricePerKm: 3.0,
      baseFare: 60,
      status: 'AVAILABLE' as const,
      imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400'
    },
    {
      type: 'SUV',
      model: 'Toyota RAV4',
      licensePlate: 'DEF-9012',
      capacity: 6,
      pricePerKm: 4.0,
      baseFare: 80,
      status: 'AVAILABLE' as const,
      imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400'
    },
    {
      type: 'Luxury',
      model: 'Mercedes S-Class',
      licensePlate: 'LUX-3456',
      capacity: 4,
      pricePerKm: 6.0,
      baseFare: 120,
      status: 'AVAILABLE' as const,
      imageUrl: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=400'
    },
    {
      type: 'Van',
      model: 'Toyota Hiace',
      licensePlate: 'VAN-7890',
      capacity: 8,
      pricePerKm: 5.0,
      baseFare: 100,
      status: 'AVAILABLE' as const,
      imageUrl: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=400'
    }
  ];

  for (const vehicleData of vehicles) {
    await prisma.vehicle.upsert({
      where: { licensePlate: vehicleData.licensePlate },
      update: {},
      create: vehicleData
    });
  }
  console.log('✓ Vehicles created');

  console.log('\n✅ Database seeded successfully!');
  console.log('\nDefault credentials:');
  console.log('Admin: admin@taxibooking.com / Admin@123');
  console.log('Customer: customer@test.com / Customer@123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
