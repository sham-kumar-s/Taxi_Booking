# 🚕 Taxi Booking Platform

A full-stack taxi booking system built with PostgreSQL, Express.js, React (Next.js), and Node.js.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [How It Works](#how-it-works)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Customer Features

- User registration and authentication
- Browse available vehicles (Economy, Sedan, SUV, Luxury, Van)
- Get fare estimates based on distance and vehicle type
- Book rides with pickup and dropoff locations
- View booking history with status tracking
- Real-time fare calculation

### Admin Features

- Secure admin dashboard
- Vehicle management (Add, Edit, Delete)
- View all bookings with filters
- Update booking status (Pending → Confirmed → In Progress → Completed)
- Platform statistics and analytics

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Authentication**: JWT (Access + Refresh Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Logging**: Winston

### Database

- **Database**: PostgreSQL
- **ORM**: Prisma

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Taxi_Booking
```

### Step 2: Database Setup

1. **Create PostgreSQL Database**

   Open pgAdmin or use command line:

   ```bash
   # Using psql command line
   psql -U postgres
   CREATE DATABASE taxi_booking;
   \q
   ```

2. **Configure Database Connection**

   Update `backend/.env` file:

   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@127.0.0.1:5432/taxi_booking
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-in-production
   JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars-change-in-production
   PORT=5001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

   **Important**: Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

   **Note**: Use `127.0.0.1` instead of `localhost` to avoid IPv6 connection issues on Windows.

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run database migrations (creates tables)
npx prisma migrate deploy

# Seed database with initial data (vehicles and admin user)
npm run db:seed

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:5001`

### Step 4: Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

Frontend will run on: `http://localhost:3000`

### Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Prisma Studio** (Database GUI): Run `npm run db:studio` in backend folder

### Default Login Credentials

**Admin Account:**

- Email: `admin@taxibooking.com`
- Password: `Admin@123`

**Test Customer Account:**

- Email: `customer@test.com`
- Password: `Customer@123`

## 🎯 How It Works

### Customer Booking Flow

1. **Registration/Login**
   - New users register with name, email, phone, and password
   - Existing users log in with email and password
   - JWT tokens are issued for authentication

2. **Browse Vehicles**
   - System displays available vehicle types
   - Each vehicle shows: type, model, capacity, base fare, and price per km

3. **Get Fare Estimate**
   - User enters pickup location (address + coordinates)
   - User enters dropoff location (address + coordinates)
   - System calculates distance using Haversine formula
   - Fare estimates shown for all vehicle types
   - Formula: `Fare = Base Fare + (Distance × Price per KM)`

4. **Book a Ride**
   - User selects preferred vehicle
   - Booking is created with status "PENDING"
   - Unique booking reference generated
   - User receives confirmation

5. **Track Bookings**
   - View all bookings in "My Bookings" page
   - See booking status, fare, distance, and vehicle details
   - Status progression: PENDING → CONFIRMED → IN_PROGRESS → COMPLETED

### Admin Management Flow

1. **Admin Login**
   - Admin logs in with admin credentials
   - Role-based access control verifies admin role

2. **Dashboard**
   - View platform statistics:
     - Total bookings
     - Active bookings
     - Completed bookings
     - Total revenue
     - Vehicle availability

3. **Vehicle Management**
   - Add new vehicles with details (type, model, license plate, capacity, pricing)
   - Edit existing vehicle information
   - Delete vehicles from fleet
   - Update vehicle status (Available, Busy, Maintenance)

4. **Booking Management**
   - View all bookings across platform
   - Filter by status
   - Update booking status
   - View customer and vehicle details for each booking

### Authentication System

**JWT Token Flow:**

1. User logs in → Server validates credentials
2. Server generates:
   - Access Token (expires in 15 minutes)
   - Refresh Token (expires in 7 days)
3. Tokens stored in localStorage
4. Access token sent with each API request
5. When access token expires, refresh token automatically gets new access token
6. User stays logged in until refresh token expires or logout

**Security Features:**

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens signed with secret keys
- Role-based access control (Customer vs Admin)
- Rate limiting on login endpoint (5 attempts per 15 minutes)
- Input validation with Zod schemas

### Database Architecture

**Users Table:**

- Stores user information (name, email, phone, password hash)
- Role field (CUSTOMER or ADMIN)
- Timestamps for created_at and updated_at

**Vehicles Table:**

- Vehicle details (type, model, license plate)
- Pricing information (base fare, price per km)
- Status (AVAILABLE, BUSY, MAINTENANCE)
- Capacity and optional image URL

**Bookings Table:**

- Links users and vehicles
- Pickup and dropoff locations (address + coordinates)
- Calculated distance and fare
- Booking status tracking
- Unique booking reference for easy lookup

**Relationships:**

- One User can have many Bookings
- One Vehicle can have many Bookings
- Bookings reference both User and Vehicle

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
POST   /api/auth/refresh       - Refresh access token
POST   /api/auth/logout        - Logout user
```

### Vehicles (Public)

```
GET    /api/vehicles           - Get all available vehicles
```

### Bookings (Customer - Requires Auth)

```
POST   /api/bookings/estimate  - Get fare estimates
POST   /api/bookings           - Create new booking
GET    /api/bookings/my        - Get user's bookings
```

### Admin - Vehicles (Requires Admin Role)

```
GET    /api/admin/vehicles     - Get all vehicles
POST   /api/admin/vehicles     - Add new vehicle
PUT    /api/admin/vehicles/:id - Update vehicle
DELETE /api/admin/vehicles/:id - Delete vehicle
```

### Admin - Bookings (Requires Admin Role)

```
GET    /api/admin/bookings           - Get all bookings
PATCH  /api/admin/bookings/:id/status - Update booking status
GET    /api/admin/dashboard          - Get platform statistics
```

## 🗄 Database Schema

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  role ENUM('CUSTOMER', 'ADMIN') DEFAULT 'CUSTOMER',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vehicles Table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY,
  type VARCHAR NOT NULL,
  model VARCHAR NOT NULL,
  license_plate VARCHAR UNIQUE NOT NULL,
  capacity INTEGER NOT NULL,
  price_per_km DECIMAL NOT NULL,
  base_fare DECIMAL DEFAULT 50,
  status ENUM('AVAILABLE', 'BUSY', 'MAINTENANCE') DEFAULT 'AVAILABLE',
  image_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  booking_ref VARCHAR UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  vehicle_id UUID REFERENCES vehicles(id),
  pickup_location VARCHAR NOT NULL,
  pickup_lat DECIMAL NOT NULL,
  pickup_lng DECIMAL NOT NULL,
  dropoff_location VARCHAR NOT NULL,
  dropoff_lat DECIMAL NOT NULL,
  dropoff_lng DECIMAL NOT NULL,
  distance DECIMAL NOT NULL,
  fare DECIMAL NOT NULL,
  status ENUM('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Troubleshooting

### Database Connection Issues

**Error: "Database taxi_booking does not exist"**

```bash
# Solution: Create the database
psql -U postgres
CREATE DATABASE taxi_booking;
\q
```

**Error: "Authentication failed"**

- Check your PostgreSQL password in `backend/.env`
- Ensure DATABASE_URL format: `postgresql://postgres:YOUR_PASSWORD@127.0.0.1:5432/taxi_booking`

**Error: "no pg_hba.conf entry for host"**

- Use `127.0.0.1` instead of `localhost` in DATABASE_URL

### Port Already in Use

**Backend port 5001 in use:**

```bash
# Windows: Find and kill process
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5002
```

**Frontend port 3000 in use:**

```bash
# Next.js will automatically suggest port 3001
# Or kill the process using port 3000
```

### Prisma Issues

**Error: "Prisma Client not generated"**

```bash
cd backend
npx prisma generate
```

**Database out of sync:**

```bash
cd backend
npx prisma migrate reset  # Warning: This deletes all data
npm run db:seed
```

### Frontend Issues

**Error: "isAuthenticated is not a function"**

- This has been fixed in the latest version
- Clear browser localStorage and refresh

**API connection failed:**

- Ensure backend is running on port 5001
- Check `frontend/.env` has correct API URL: `NEXT_PUBLIC_API_URL=http://localhost:5001/api`

## 📊 Viewing Database Data

### Option 1: Prisma Studio (Recommended)

```bash
cd backend
npm run db:studio
```

Opens at `http://localhost:5555` - Visual database browser

### Option 2: pgAdmin

- Download from https://www.pgadmin.org/
- Connect with:
  - Host: `127.0.0.1`
  - Port: `5432`
  - Database: `taxi_booking`
  - Username: `postgres`
  - Password: Your PostgreSQL password

### Option 3: Command Line

```bash
psql -U postgres -d taxi_booking
\dt                    # List tables
SELECT * FROM users;   # View users
SELECT * FROM bookings; # View bookings
\q                     # Quit
```

## 🎨 Project Structure

```
Taxi_Booking/
├── backend/
│   ├── prisma/
│   │   ├── migrations/        # Database migrations
│   │   └── schema.prisma      # Database schema
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Auth, error handling
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Helper functions
│   │   └── server.ts         # Express app
│   ├── .env                  # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js pages
│   │   │   ├── admin/        # Admin pages
│   │   │   ├── booking/      # Booking page
│   │   │   ├── bookings/     # Bookings list
│   │   │   ├── login/        # Login page
│   │   │   └── register/     # Register page
│   │   └── lib/
│   │       ├── api.ts        # Axios instance
│   │       └── store.ts      # Zustand store
│   ├── .env                  # Environment variables
│   └── package.json
└── README.md
```

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Add environment variables
4. Deploy
5. Run migrations: `npx prisma migrate deploy`

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project to Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL=<your-backend-url>/api`
4. Deploy

## 📝 License

MIT

---

**Need Help?** Check the troubleshooting section or open an issue on GitHub.
