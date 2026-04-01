# PERN Stack Taxi Booking Platform

A production-ready, full-stack taxi booking system built with PostgreSQL, Express.js, React (Next.js), and Node.js with TypeScript.

## 📋 Table of Contents

- [Live Demo](#live-demo)
- [Architectural Decisions](#architectural-decisions)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Design](#database-design)
- [Security Measures](#security-measures)
- [Trade-offs & Decisions](#trade-offs--decisions)

---

## 🌐 Live Demo

- **Frontend**: https://taxi-booking-sigma.vercel.app
- **Backend API**: https://taxi-booking-u615.onrender.com
- **API Health Check**: https://taxi-booking-u615.onrender.com/health

### Demo Credentials

**Admin Access:**
- Email: `admin@taxibooking.com`
- Password: `Admin@123`

**Test Customer:**
- Email: `customer@test.com`
- Password: `Customer@123`

---

## 🏗️ Architectural Decisions

### 1. Project Structure: Monorepo

**Decision**: Single repository with `backend/` and `frontend/` directories

**Rationale**:
- **Simplified Development**: Single clone, unified version control
- **Shared Types**: TypeScript interfaces can be shared between frontend and backend
- **Coordinated Deployments**: Changes to API and UI can be deployed together
- **Easier Onboarding**: New developers see the entire system in one place

**Trade-offs**:
- Larger repository size
- Need clear separation of concerns
- Different deployment pipelines for each part

**Why Not Microservices?**
- Overkill for this scale
- Adds complexity (service discovery, inter-service communication)
- Monolith is easier to debug and maintain for a small team

---

### 2. Fare Calculation Logic

**Decision**: Server-side calculation in `backend/src/services/fareService.ts`

**Rationale**:
- **Security**: Prevents client-side manipulation of fares
- **Consistency**: All clients (web, mobile future) get same pricing
- **Business Logic Centralization**: Easy to update pricing rules in one place
- **Audit Trail**: Server logs all fare calculations

**Implementation**:
```typescript
Fare = (Base Fare + Distance × Price Per KM) × Surge Multiplier
```

**Surge Pricing**:
- Weekday peak hours (7-10 AM, 5-8 PM): 1.5×
- Late night (10 PM - 6 AM): 1.3×
- Weekends: 1.2×
- Normal hours: 1.0×

**Trade-offs**:
- Requires API call for estimates (can't calculate offline)
- Server load for calculations (minimal impact)
- **Benefit**: Complete control over pricing strategy

---

### 3. Authentication Strategy

**Decision**: JWT (JSON Web Tokens) with Access + Refresh Token pattern

**Mechanism**:
- **Access Token**: Short-lived (15 minutes), sent with each request
- **Refresh Token**: Long-lived (7 days), used to get new access tokens
- **Storage**: localStorage (tokens), Zustand (user state)

**Session Lifecycle**:
1. User logs in → Server validates credentials
2. Server generates both tokens
3. Client stores tokens in localStorage
4. Client sends access token with each API request (Authorization header)
5. When access token expires → Client automatically uses refresh token
6. Server issues new access token
7. On logout → Client clears tokens

**Why JWT over Sessions?**
- **Stateless**: No server-side session storage needed
- **Scalable**: Works across multiple server instances
- **Mobile-Ready**: Easy to implement in future mobile apps
- **Performance**: No database lookup on every request

**Security Measures**:
- Tokens signed with secret keys (min 32 characters)
- Short access token expiry limits exposure
- Refresh token rotation prevents replay attacks
- HTTP-only cookie option available (currently using localStorage for simplicity)

**Trade-offs**:
- Can't invalidate tokens before expiry (solved with short expiry)
- Token size larger than session ID
- **Benefit**: Scalability and stateless architecture

---

### 4. Database Design

**Decision**: Normalized relational schema with three core tables

**Schema**:

```
Users (id, email, password_hash, name, phone, role, timestamps)
  ↓ 1:N
Bookings (id, booking_ref, user_id, vehicle_id, locations, distance, fare, status, timestamps)
  ↓ N:1
Vehicles (id, type, model, license_plate, capacity, pricing, status, timestamps)
```

**Key Relationships**:
- **Users → Bookings**: One-to-Many (one user, multiple bookings)
- **Vehicles → Bookings**: One-to-Many (one vehicle, multiple bookings)

**Constraints**:
- **Unique Constraints**: email, license_plate, booking_ref
- **Foreign Keys**: user_id → users.id, vehicle_id → vehicles.id
- **Cascade Delete**: Delete user → delete their bookings
- **Restrict Delete**: Cannot delete vehicle with active bookings
- **Check Constraints**: Enums for role, status fields

**Indexes**:
- `users.email` - Fast login lookups
- `bookings.user_id` - Fast user booking queries
- `bookings.vehicle_id` - Fast vehicle booking queries
- `bookings.booking_ref` - Fast reference lookups
- `bookings.status` - Fast status filtering

**Why This Design?**
- **Normalized**: No data duplication, easy to update
- **Referential Integrity**: Foreign keys prevent orphaned records
- **Query Performance**: Indexes on frequently queried fields
- **Scalability**: Can add tables (drivers, payments) without restructuring

**Trade-offs**:
- Requires joins for complete booking data
- More complex queries than denormalized design
- **Benefit**: Data consistency and maintainability

---

### 5. Error Handling Strategy

**Decision**: Centralized error handling with custom error classes

**Backend Error Handling**:

1. **Custom Error Classes**:
   ```typescript
   AppError (base)
   ├─ BadRequestError (400)
   ├─ UnauthorizedError (401)
   ├─ ForbiddenError (403)
   ├─ NotFoundError (404)
   └─ ConflictError (409)
   ```

2. **Centralized Middleware**: `errorHandler.ts` catches all errors
3. **Structured Logging**: Winston logs errors with context
4. **Validation Errors**: Zod schemas provide detailed validation messages
5. **Database Errors**: Prisma errors caught and transformed to user-friendly messages

**Frontend Error Handling**:

1. **Toast Notifications**: User-friendly error messages
2. **Loading States**: Prevent duplicate submissions
3. **Form Validation**: Client-side validation before API calls
4. **Axios Interceptors**: Automatic token refresh on 401 errors
5. **Try-Catch Blocks**: All async operations wrapped

**Expected Errors**:
- Invalid credentials → "Invalid email or password"
- Duplicate email → "Email already registered"
- Vehicle unavailable → "Vehicle is not available"
- Invalid coordinates → "Invalid location coordinates"

**Unexpected Errors**:
- Database connection failure → "Service temporarily unavailable"
- Server crash → Logged with stack trace, user sees generic message
- Network timeout → "Request timeout, please try again"

**Trade-offs**:
- More boilerplate code for error classes
- **Benefit**: Consistent error responses, easier debugging

---

### 6. Admin Panel Security

**Decision**: Multi-layered security approach

**Security Layers**:

1. **Authentication**: JWT token required for all admin routes
2. **Authorization**: Role-based middleware checks user.role === 'ADMIN'
3. **Route Guards**: `requireAdmin` middleware on all admin endpoints
4. **Frontend Protection**: Admin pages redirect non-admins to login
5. **Rate Limiting**: Prevents brute force attacks on login
6. **Input Validation**: Zod schemas validate all admin inputs
7. **SQL Injection Prevention**: Prisma ORM uses parameterized queries
8. **XSS Prevention**: Input sanitization on all user inputs

**Beyond Login**:
- Admin role stored in JWT (can't be modified by client)
- Separate admin routes (`/api/admin/*`) with middleware guards
- Admin actions logged for audit trail
- No admin registration endpoint (admins created via seed script)
- CORS configured to allow only trusted frontend origin

**Trade-offs**:
- More middleware overhead
- **Benefit**: Defense in depth, multiple security layers

---

## ✨ Features

### Customer Features
- ✅ User registration and secure login
- ✅ Browse available vehicles with pricing
- ✅ Get fare estimates for different vehicle types
- ✅ Real-time distance calculation (Haversine formula)
- ✅ Dynamic surge pricing based on time of day
- ✅ Book rides with unique reference IDs
- ✅ View booking history with status tracking
- ✅ Responsive design for mobile and desktop

### Admin Features
- ✅ Secure admin dashboard with statistics
- ✅ Vehicle management (Create, Read, Update, Delete)
- ✅ View all bookings with customer details
- ✅ Filter bookings by status
- ✅ Update booking status workflow
- ✅ Revenue tracking and analytics
- ✅ Fleet availability monitoring

### Technical Features
- ✅ TypeScript for type safety
- ✅ JWT authentication with refresh tokens
- ✅ Input validation on client and server
- ✅ Centralized error handling
- ✅ Rate limiting on sensitive endpoints
- ✅ SQL injection prevention (Prisma ORM)
- ✅ Password hashing (bcrypt)
- ✅ Structured logging (Winston)
- ✅ CORS configuration
- ✅ Database migrations and seeding

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework with SSR
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **Axios** - HTTP client with interceptors
- **React Hot Toast** - User notifications
- **React Query** - Server state management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Zod** - Schema validation
- **Winston** - Logging
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting

### Database
- **PostgreSQL** - Production: Neon DB (serverless)
- **Prisma** - ORM with migrations

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or use Neon DB for cloud)
- npm or yarn

### Local Development Setup

#### 1. Clone Repository
```bash
git clone <repository-url>
cd Taxi_Booking
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your database credentials

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed database with initial data
npm run db:seed

# Start backend server
npm run dev
```

Backend runs on: `http://localhost:5000`

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Edit .env.local with backend API URL

# Start frontend server
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Database Connection (Neon DB for production)
DATABASE_URL=postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require

# JWT Secrets (minimum 32 characters)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars-change-in-production

# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

---

## 📡 API Documentation

### Authentication Endpoints

**POST** `/api/auth/register`
- Register new user
- Body: `{ email, password, name, phone }`
- Returns: User object + tokens

**POST** `/api/auth/login`
- User login
- Body: `{ email, password }`
- Returns: User object + tokens
- Rate limit: 5 attempts per 15 minutes

**POST** `/api/auth/refresh`
- Refresh access token
- Body: `{ refreshToken }`
- Returns: New access token

### Vehicle Endpoints

**GET** `/api/vehicles`
- Get all available vehicles
- Public endpoint (no auth required)

### Booking Endpoints (Requires Authentication)

**POST** `/api/bookings/estimate`
- Get fare estimates for all vehicle types
- Body: `{ pickupLat, pickupLng, dropoffLat, dropoffLng }`
- Returns: Distance + fare estimates for each vehicle

**POST** `/api/bookings`
- Create new booking
- Body: `{ vehicleId, pickupLocation, pickupLat, pickupLng, dropoffLocation, dropoffLat, dropoffLng }`
- Returns: Booking object with reference ID

**GET** `/api/bookings/my`
- Get current user's bookings
- Returns: Array of bookings with vehicle details

### Admin Endpoints (Requires Admin Role)

**GET** `/api/admin/dashboard`
- Get platform statistics
- Returns: Total bookings, revenue, vehicle stats

**GET** `/api/admin/vehicles`
- Get all vehicles (including unavailable)

**POST** `/api/admin/vehicles`
- Add new vehicle
- Body: `{ type, model, licensePlate, capacity, pricePerKm, baseFare, imageUrl? }`

**PUT** `/api/admin/vehicles/:id`
- Update vehicle details

**DELETE** `/api/admin/vehicles/:id`
- Delete vehicle (fails if active bookings exist)

**GET** `/api/admin/bookings?status=CONFIRMED`
- Get all bookings with optional status filter
- Returns: Bookings with user and vehicle details

**PATCH** `/api/admin/bookings/:id/status`
- Update booking status
- Body: `{ status: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' }`

---

## 🗄 Database Design

### Schema Overview

```sql
Users (id, email, password_hash, name, phone, role, created_at, updated_at)
  ↓ 1:N
Bookings (id, booking_ref, user_id, vehicle_id, pickup/dropoff data, distance, fare, status, timestamps)
  ↓ N:1
Vehicles (id, type, model, license_plate, capacity, price_per_km, base_fare, status, timestamps)
```

### Tables

**users**
- Primary Key: `id` (UUID)
- Unique: `email`
- Role: ENUM (CUSTOMER, ADMIN)
- Stores hashed passwords (bcrypt)

**vehicles**
- Primary Key: `id` (UUID)
- Unique: `license_plate`
- Status: ENUM (AVAILABLE, BUSY, MAINTENANCE)
- Pricing: `base_fare` + `price_per_km`

**bookings**
- Primary Key: `id` (UUID)
- Unique: `booking_ref` (CUID for readability)
- Foreign Keys: `user_id`, `vehicle_id`
- Status: ENUM (PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED)
- Stores coordinates for pickup/dropoff

### Relationships & Constraints

**Foreign Keys**:
- `bookings.user_id` → `users.id` (CASCADE on delete)
- `bookings.vehicle_id` → `vehicles.id` (RESTRICT on delete)

**Why CASCADE for users?**
- When user account deleted, their bookings should be removed (GDPR compliance)

**Why RESTRICT for vehicles?**
- Prevents accidental deletion of vehicles with booking history
- Maintains data integrity for completed trips

**Indexes**:
- `users.email` - Fast login queries
- `bookings.user_id` - Fast user booking lookups
- `bookings.vehicle_id` - Fast vehicle booking lookups
- `bookings.booking_ref` - Fast reference searches
- `bookings.status` - Fast status filtering

---

## 🔒 Security Measures

### Authentication & Authorization
- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: Signed with secret keys (min 32 chars)
- **Token Expiry**: Access tokens expire in 15 minutes
- **Role-Based Access Control**: Middleware checks user role
- **Protected Routes**: All sensitive endpoints require authentication

### Input Validation & Sanitization
- **Zod Schemas**: Validate all inputs on client and server
- **Type Safety**: TypeScript prevents type-related bugs
- **SQL Injection Prevention**: Prisma ORM uses parameterized queries
- **XSS Prevention**: Input sanitization, no eval() or innerHTML

### API Security
- **Rate Limiting**: 
  - Login: 5 attempts per 15 minutes
  - Bookings: 10 requests per minute
  - General: 100 requests per 15 minutes
- **CORS**: Configured for specific frontend origin only
- **Helmet**: Security headers (XSS, clickjacking protection)
- **Trust Proxy**: Configured for deployment behind reverse proxy

### Error Handling
- **No Sensitive Data**: Error messages don't leak system details
- **Structured Logging**: Errors logged with context for debugging
- **Graceful Failures**: User sees friendly messages, not stack traces

---

## 🤔 Trade-offs & Decisions

### Why Next.js over Create React App?
- **SSR/SSG**: Better SEO and initial load performance
- **App Router**: Modern routing with layouts
- **API Routes**: Can add serverless functions if needed
- **Image Optimization**: Built-in Next.js Image component
- **Trade-off**: Slightly more complex than CRA, but worth it for production

### Why Prisma over Raw SQL?
- **Type Safety**: Auto-generated types from schema
- **Migration Management**: Version-controlled schema changes
- **SQL Injection Prevention**: Automatic parameterization
- **Developer Experience**: Intuitive API, great autocomplete
- **Trade-off**: Slight performance overhead vs raw SQL, but negligible for this scale

### Why Zustand over Redux?
- **Simplicity**: Less boilerplate, easier to learn
- **Performance**: No unnecessary re-renders
- **Size**: Smaller bundle size (3KB vs 40KB)
- **Trade-off**: Less ecosystem/middleware than Redux, but sufficient for this app

### Why Monorepo over Separate Repos?
- **Coordination**: Frontend and backend changes deployed together
- **Shared Types**: Can share TypeScript interfaces
- **Simplicity**: Single clone, single version control
- **Trade-off**: Larger repo, but easier development workflow

### Why JWT over Session Cookies?
- **Stateless**: No server-side session storage
- **Scalable**: Works with multiple server instances
- **Mobile-Ready**: Easy to implement in future apps
- **Trade-off**: Can't revoke tokens immediately, solved with short expiry

### Why Server-Side Fare Calculation?
- **Security**: Client can't manipulate prices
- **Consistency**: All clients get same pricing
- **Business Logic**: Easy to update pricing rules
- **Trade-off**: Requires API call, but necessary for security

---

## 🎯 Edge Cases Handled

### Booking Flow
- ✅ Distance too short (< 0.5 km) → Error message
- ✅ Invalid coordinates → Validation error
- ✅ Vehicle unavailable → Availability check before booking
- ✅ Concurrent bookings → Database constraints prevent conflicts
- ✅ Fare manipulation → Server-side calculation only

### Authentication
- ✅ Token expiry → Automatic refresh
- ✅ Invalid token → Redirect to login
- ✅ Duplicate registration → "Email already exists"
- ✅ Brute force login → Rate limiting (5 attempts)
- ✅ Weak passwords → Minimum 6 characters required

### Admin Operations
- ✅ Delete vehicle with bookings → Prevented with error message
- ✅ Non-admin accessing admin routes → 403 Forbidden
- ✅ Invalid status transitions → Validation error
- ✅ Duplicate license plates → Unique constraint error

### Network & Database
- ✅ Database connection failure → Graceful error, retry logic
- ✅ Slow queries → Indexed fields for performance
- ✅ Network timeout → Error handling with user feedback
- ✅ Invalid API responses → Type checking and validation

---

## 📊 Project Structure

```
Taxi_Booking/
├── backend/                      # Node.js + Express API
│   ├── prisma/
│   │   ├── migrations/          # Database version control
│   │   └── schema.prisma        # Database schema definition
│   ├── src/
│   │   ├── controllers/         # Request handlers (auth, booking, admin, vehicle)
│   │   ├── routes/              # API route definitions
│   │   ├── services/            # Business logic (fare calculation)
│   │   ├── middleware/          # Auth, error handling, rate limiting
│   │   ├── utils/               # JWT, logger, errors, Prisma client
│   │   ├── database/            # Seed scripts
│   │   └── server.ts            # Express app entry point
│   ├── .env                     # Environment variables
│   └── package.json
│
├── frontend/                     # Next.js 14 Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Landing page
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── providers.tsx    # React Query provider
│   │   │   ├── login/           # Login page
│   │   │   ├── register/        # Registration page
│   │   │   ├── booking/         # Booking flow (2-step)
│   │   │   ├── bookings/        # Booking history
│   │   │   └── admin/           # Admin panel
│   │   │       ├── page.tsx     # Dashboard
│   │   │       ├── vehicles/    # Vehicle management
│   │   │       └── bookings/    # Booking management
│   │   └── lib/
│   │       ├── api.ts           # Axios instance with interceptors
│   │       └── store.ts         # Zustand state management
│   ├── .env.local               # Environment variables
│   └── package.json
│
└── README.md                     # This file
```

---

## 🧪 Testing

### Manual Testing Checklist

**Customer Flow:**
1. Register new account → Success
2. Login → Redirect to booking page
3. Enter locations → Get fare estimates
4. Select vehicle → Create booking
5. View booking history → See all bookings

**Admin Flow:**
1. Login as admin → Redirect to dashboard
2. View statistics → Correct numbers
3. Add vehicle → Appears in list
4. Edit vehicle → Changes saved
5. View bookings → All bookings visible
6. Update status → Status changes

**Security:**
1. Access admin route as customer → 403 Forbidden
2. Invalid token → 401 Unauthorized
3. Expired token → Auto refresh
4. 5+ failed logins → Rate limited

### API Testing with cURL

```bash
# Health check
curl https://taxi-booking-u615.onrender.com/health

# Get vehicles
curl https://taxi-booking-u615.onrender.com/api/vehicles

# Login
curl -X POST https://taxi-booking-u615.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@taxibooking.com","password":"Admin@123"}'
```

---

## 🚀 Deployment

### Backend (Render)

1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install --include=dev && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
4. Add environment variables (see Environment Variables section)
5. Deploy
6. Run in Render Shell: `npm run db:seed`

### Frontend (Vercel)

1. Import project to Vercel
2. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api`
4. Deploy

### Database (Neon)

1. Create database at https://neon.tech
2. Copy connection string
3. Add to Render environment variables as `DATABASE_URL`
4. Ensure `?sslmode=require` is in connection string

---

## 🎥 Demo Video

[Link to Google Drive demo video - 5-10 minutes]

**Demo covers:**
1. Customer registration and booking flow
2. Admin dashboard and vehicle management
3. Booking management and status updates
4. Technical architecture explanation
5. Security features demonstration

---

## 🔍 What Makes This Production-Ready

### Code Quality
- TypeScript for type safety
- Clean separation of concerns (MVC pattern)
- Reusable service layer for business logic
- Consistent error handling
- Comprehensive input validation

### Security
- Multiple layers of authentication and authorization
- SQL injection prevention
- XSS protection
- Rate limiting
- Secure password storage
- CORS configuration

### Scalability
- Stateless JWT authentication
- Database indexes for query performance
- Connection pooling (Prisma)
- Modular architecture for easy feature additions

### Maintainability
- Well-documented code
- Clear project structure
- Type safety prevents bugs
- Migration system for database changes
- Seed scripts for consistent testing

### User Experience
- Responsive design
- Loading states
- Error notifications
- Form validation
- Automatic token refresh

---

## 🤝 Contributing

This is an assessment project. For production use, consider adding:
- Payment gateway integration
- Real-time driver tracking (WebSockets)
- Email/SMS notifications
- Automated testing (Jest, Cypress)
- CI/CD pipeline
- Monitoring and alerting

---

## 📄 License

MIT

---

## 👨‍💻 Developer Notes

### Why These Choices?

Every technical decision was made with these priorities:
1. **Security First**: No shortcuts on authentication or data validation
2. **Developer Experience**: TypeScript, Prisma, and modern tools
3. **Scalability**: Stateless architecture, indexed queries
4. **Maintainability**: Clean code, clear structure, documentation
5. **Production-Ready**: Error handling, logging, deployment guides

### Future Enhancements

- WebSocket integration for real-time tracking
- Payment processing (Stripe/PayPal)
- Driver management module
- Ratings and reviews system
- Email/SMS notifications
- Mobile app (React Native)
- Advanced analytics dashboard
- Multi-language support

---

**Built with ❤️ for PERN Stack Assessment**
