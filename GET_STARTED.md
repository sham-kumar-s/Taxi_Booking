# 🚕 Get Started - PERN Taxi Booking Platform

Welcome! This guide will get you up and running in minutes.

## 📋 What You Need

- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- A code editor (VS Code recommended)
- Terminal/Command Line

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd frontend
npm install
```

### Step 2: Setup Database

```bash
# Make sure PostgreSQL is running
# Create database
createdb taxi_booking

# Update backend/.env with your credentials
# Default: DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taxi_booking
```

### Step 3: Initialize Database

```bash
cd backend
npm run db:migrate
npm run db:seed
```

### Step 4: Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 5: Open Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🎯 First Steps

### Try the Customer Flow

1. Go to http://localhost:3000
2. Click "Sign Up" and create an account
3. Login with your credentials
4. Click "Book Your Ride"
5. Click "Use Demo Locations" button
6. Click "Get Fare Estimates"
7. Select a vehicle
8. Click "Confirm Booking"
9. View your booking in "My Bookings"

### Try the Admin Panel

1. Logout from customer account
2. Login with admin credentials:
   - Email: `admin@taxibooking.com`
   - Password: `Admin@123`
3. Explore the dashboard
4. Go to "Manage Vehicles"
5. Try adding a new vehicle
6. Go to "Manage Bookings"
7. Update a booking status

## 📚 Documentation

- **QUICKSTART.md** - Detailed setup guide
- **README.md** - Complete project overview
- **API_DOCUMENTATION.md** - All API endpoints
- **DEPLOYMENT.md** - Deploy to production
- **DEMO_SCRIPT.md** - Record demo video
- **TESTING.md** - Testing checklist

## 🛠️ Development Commands

```bash
# Start both servers
./dev-commands.sh start

# Reset database
./dev-commands.sh db-reset

# Open Prisma Studio (database GUI)
./dev-commands.sh db-studio

# Clean install
./dev-commands.sh clean
```

## 🎨 Project Structure

```
taxi-booking/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   └── prisma/
│       └── schema.prisma
│
└── frontend/         # Next.js App
    └── src/
        └── app/
            ├── page.tsx
            ├── login/
            ├── register/
            ├── booking/
            ├── bookings/
            └── admin/
```

## 🔑 Default Credentials

### Admin
- Email: `admin@taxibooking.com`
- Password: `Admin@123`

### Test Customer
- Email: `customer@test.com`
- Password: `Customer@123`

## ❓ Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
# macOS:
brew services start postgresql

# Linux:
sudo systemctl start postgresql

# Windows:
# Start PostgreSQL from Services
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install
```

## 🎥 Demo Video

Follow **DEMO_SCRIPT.md** to record your demo video showing:
1. Customer booking flow
2. Admin panel features
3. Technical highlights

## 🚀 Deploy to Production

Follow **DEPLOYMENT.md** for:
- Railway/Render (Backend)
- Vercel/Netlify (Frontend)
- Database hosting options

## 💡 Key Features

### Customer
- Register and login
- Get fare estimates
- Book rides
- View booking history

### Admin
- Dashboard with stats
- Manage vehicles
- Manage bookings
- Update statuses

### Technical
- TypeScript full-stack
- JWT authentication
- Prisma ORM
- Rate limiting
- Input validation
- Error handling

## 📞 Need Help?

1. Check the documentation files
2. Review error messages in terminal
3. Check browser console (F12)
4. Verify environment variables
5. Ensure database is running

## 🎉 You're Ready!

The platform is fully functional and ready for:
- ✅ Development
- ✅ Testing
- ✅ Demo recording
- ✅ Production deployment

Happy coding! 🚕
