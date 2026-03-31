# Quick Start Guide

Get the taxi booking platform running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Git installed

## Step 1: Clone & Setup (1 min)

```bash
# Clone the repository
git clone <your-repo-url>
cd taxi-booking

# Run automated setup
chmod +x setup.sh
./setup.sh
```

## Step 2: Configure Database (1 min)

```bash
# Edit backend/.env
cd backend
nano .env

# Update this line with your PostgreSQL credentials:
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/taxi_booking"

# Example:
DATABASE_URL="postgresql://postgres:password@localhost:5432/taxi_booking"
```

## Step 3: Initialize Database (1 min)

```bash
# Still in backend directory
npm run db:migrate
npm run db:seed
```

You should see:
```
✓ Admin user created
✓ Test customer created
✓ Vehicles created
✅ Database seeded successfully!
```

## Step 4: Start Backend (30 sec)

```bash
# In backend directory
npm run dev
```

Backend should start on http://localhost:5000

## Step 5: Start Frontend (30 sec)

Open a NEW terminal:

```bash
cd frontend
npm run dev
```

Frontend should start on http://localhost:3000

## Step 6: Test the Application (1 min)

### Customer Flow:
1. Open http://localhost:3000
2. Click "Sign Up" and create an account
3. Login and go to "Book Your Ride"
4. Click "Use Demo Locations"
5. Click "Get Fare Estimates"
6. Select a vehicle and confirm booking
7. View your booking in "My Bookings"

### Admin Flow:
1. Logout from customer account
2. Login with:
   - Email: admin@taxibooking.com
   - Password: Admin@123
3. Explore the admin dashboard
4. Manage vehicles and bookings

## Troubleshooting

### Database Connection Error
```bash
# Make sure PostgreSQL is running
# On macOS:
brew services start postgresql

# On Linux:
sudo systemctl start postgresql

# Create database if it doesn't exist
createdb taxi_booking
```

### Port Already in Use
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install
```

## Default Credentials

### Admin
- Email: admin@taxibooking.com
- Password: Admin@123

### Test Customer
- Email: customer@test.com
- Password: Customer@123

## Next Steps

- Read README.md for architecture details
- Check DEPLOYMENT.md for production deployment
- Watch DEMO_SCRIPT.md for demo video guidance
- Customize vehicles in admin panel
- Add your own features!

## Need Help?

Check the logs:
- Backend: Terminal where `npm run dev` is running
- Frontend: Browser console (F12)
- Database: `cd backend && npx prisma studio`

Happy coding! 🚕
