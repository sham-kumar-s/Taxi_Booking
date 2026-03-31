# Demo Video Script (5-10 minutes)

## Introduction (30 seconds)
"Hi, I'm demonstrating my PERN Stack Taxi Booking Platform. This is a full-stack application built with PostgreSQL, Express, React (Next.js), and Node.js with TypeScript."

## Architecture Overview (1 minute)
"Let me quickly show you the architecture:
- Monorepo structure with separate backend and frontend
- Backend: Node.js + Express + Prisma ORM + PostgreSQL
- Frontend: Next.js 14 with App Router + TailwindCSS
- Authentication: JWT with refresh tokens
- Fare calculation: Server-side with surge pricing logic"

## Customer Flow Demo (3-4 minutes)

### 1. Registration
"First, let's register as a new customer..."
- Show registration form
- Fill in details
- Submit and show automatic login

### 2. Booking Flow
"Now let's book a ride..."
- Enter pickup location (or use demo locations)
- Enter dropoff location with coordinates
- Click "Get Fare Estimates"
- Show multiple vehicle options with different prices
- Explain fare calculation (distance + vehicle type + surge pricing)
- Select a vehicle
- Confirm booking
- Show booking reference ID

### 3. Booking History
"Let's view our booking history..."
- Navigate to "My Bookings"
- Show booking details
- Highlight booking reference, status, fare

## Admin Panel Demo (3-4 minutes)

### 1. Admin Login
"Now let's login as an admin..."
- Logout from customer account
- Login with admin credentials
- Show admin dashboard

### 2. Dashboard
"The admin dashboard shows key metrics..."
- Total bookings
- Active bookings
- Completed bookings
- Total revenue
- Vehicle statistics

### 3. Vehicle Management
"Admins can manage the vehicle fleet..."
- Navigate to Vehicles
- Show existing vehicles
- Add a new vehicle (fill form)
- Edit a vehicle
- Explain delete restrictions (can't delete with active bookings)

### 4. Booking Management
"Admins can view and manage all bookings..."
- Navigate to Bookings
- Show all bookings with customer details
- Filter by status
- Update booking status (Confirmed → In Progress → Completed)
- Show customer and vehicle information

## Technical Highlights (1 minute)

"Key technical decisions:
1. Fare calculation on backend prevents manipulation
2. JWT with refresh tokens for secure auth
3. Role-based access control for admin routes
4. Prisma ORM prevents SQL injection
5. Input validation with Zod on both client and server
6. Error handling with custom error classes
7. Rate limiting on sensitive endpoints
8. Responsive design with TailwindCSS"

## Edge Cases Handled (30 seconds)

"The system handles:
- Invalid coordinates
- Concurrent bookings
- Token expiry with automatic refresh
- Vehicle availability checks
- Distance validation (minimum distance)
- Admin-only route protection
- Database transaction failures"

## Conclusion (30 seconds)

"This demonstrates a production-ready taxi booking platform with:
- Complete customer booking flow
- Comprehensive admin panel
- Secure authentication
- Clean architecture
- Proper error handling
- Scalable design

The code is on GitHub with full documentation. Thank you!"

## Tips for Recording

1. Use demo credentials provided in README
2. Have demo locations ready (Times Square to Central Park)
3. Show browser dev tools briefly to demonstrate API calls
4. Keep pace steady but not rushed
5. Highlight unique features and decisions
6. Show both success and error handling
7. End with GitHub repo and README
