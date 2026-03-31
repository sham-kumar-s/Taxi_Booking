# PERN Stack Taxi Booking Platform

A full-stack taxi booking system built with PostgreSQL, Express.js, React (Next.js), and Node.js.

## Architecture Decisions

### 1. Project Structure: Monorepo
- **Why**: Simplified development, shared types, easier deployment coordination
- Single repository with `backend/` and `frontend/` directories
- Shared TypeScript interfaces for type safety across stack

### 2. Fare Calculation Logic
- **Location**: Backend service layer (`backend/src/services/fareService.ts`)
- **Why**: Business logic belongs on server for security and consistency
- Dynamic calculation based on: distance, vehicle type, time of day, surge pricing
- Prevents client-side manipulation

### 3. Authentication Strategy
- **Mechanism**: JWT (JSON Web Tokens) with HTTP-only cookies
- **Session Management**: 
  - Access tokens (15min expiry) + Refresh tokens (7 days)
  - Refresh token rotation for security
- **Admin Auth**: Role-based access control (RBAC) with `role` field in JWT
- **Why**: Stateless, scalable, secure against XSS when using HTTP-only cookies

### 4. Database Design
```
Users (id, email, password_hash, name, phone, role, created_at)
Vehicles (id, type, model, license_plate, capacity, price_per_km, status, created_at)
Bookings (id, user_id, vehicle_id, pickup_location, dropoff_location, distance, fare, status, booking_ref, created_at)
```
- **Relationships**: Users 1:N Bookings, Vehicles 1:N Bookings
- **Constraints**: Foreign keys, unique emails, check constraints on status enums
- **Indexes**: On user_id, vehicle_id, booking_ref, status for query performance

### 5. Error Handling
- **Backend**: Centralized error middleware with typed error classes
- **Frontend**: Error boundaries + toast notifications for user feedback
- **Validation**: Zod schemas on both client and server
- **Logging**: Structured logging with Winston (production-ready)

### 6. Admin Security
- Role-based middleware (`requireAdmin`)
- Separate admin routes with authentication checks
- Admin panel protected by Next.js middleware
- Rate limiting on sensitive endpoints
- Input sanitization and SQL injection prevention via Prisma ORM

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, React Query
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT with bcrypt password hashing
- **Validation**: Zod
- **API**: RESTful with proper HTTP status codes

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run db:migrate
npm run db:seed
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with backend API URL
npm run dev
```

### Environment Variables

#### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/taxi_booking
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key
PORT=5001
NODE_ENV=development
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## Default Admin Credentials
```
Email: admin@taxibooking.com
Password: Admin@123
```

## API Endpoints

### Public
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- POST `/api/auth/refresh` - Refresh access token

### Customer
- GET `/api/vehicles` - List available vehicles
- POST `/api/bookings/estimate` - Get fare estimate
- POST `/api/bookings` - Create booking
- GET `/api/bookings/my` - Get user's bookings

### Admin
- GET `/api/admin/vehicles` - List all vehicles
- POST `/api/admin/vehicles` - Add vehicle
- PUT `/api/admin/vehicles/:id` - Update vehicle
- DELETE `/api/admin/vehicles/:id` - Delete vehicle
- GET `/api/admin/bookings` - List all bookings
- PATCH `/api/admin/bookings/:id/status` - Update booking status

## Features

### Customer Flow
1. Register/Login
2. Search for trip (pickup → dropoff)
3. View fare estimates for different vehicle types
4. Select vehicle and confirm booking
5. Receive booking reference ID
6. View booking history

### Admin Panel
1. Secure login (admin role required)
2. Vehicle management (CRUD operations)
3. View all bookings with filters
4. Update booking status
5. Dashboard with statistics

## Deployment

### Backend
- Deploy to Railway/Render/Heroku
- Set environment variables
- Run migrations: `npm run db:migrate`

### Frontend
- Deploy to Vercel/Netlify
- Set `NEXT_PUBLIC_API_URL` to production backend URL

### Database
- Use managed PostgreSQL (Railway, Supabase, or AWS RDS)

## Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Demo Video
[Link to Google Drive demo video]

## Live Demo
- Frontend: [Deployment URL]
- Backend API: [API URL]

## Edge Cases Handled

1. **Concurrent Bookings**: Optimistic locking on vehicle availability
2. **Invalid Locations**: Validation on coordinates format
3. **Fare Manipulation**: Server-side calculation only
4. **Token Expiry**: Automatic refresh token flow
5. **SQL Injection**: Parameterized queries via Prisma
6. **XSS**: Input sanitization and CSP headers
7. **Rate Limiting**: Prevent brute force attacks
8. **Database Failures**: Graceful error handling with retries
9. **Invalid Vehicle Selection**: Availability checks before booking
10. **Unauthorized Access**: Middleware guards on all protected routes

## Future Enhancements

- Real-time driver tracking with WebSockets
- Payment gateway integration
- Email/SMS notifications
- Ride history with ratings
- Multi-language support
- Mobile app (React Native)

## License
MIT
