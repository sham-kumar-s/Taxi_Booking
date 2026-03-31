# Testing Guide

## Manual Testing Checklist

### Authentication Tests

#### Registration
- [ ] Register with valid details → Success
- [ ] Register with existing email → Error "Email already registered"
- [ ] Register with invalid email → Validation error
- [ ] Register with short password (<6 chars) → Validation error
- [ ] Register with missing fields → Validation error

#### Login
- [ ] Login with correct credentials → Success + redirect
- [ ] Login with wrong password → Error "Invalid credentials"
- [ ] Login with non-existent email → Error "Invalid credentials"
- [ ] Login as admin → Redirect to admin panel
- [ ] Login as customer → Redirect to booking page
- [ ] Rate limiting: 5+ failed attempts → "Too many login attempts"

#### Token Management
- [ ] Access protected route with valid token → Success
- [ ] Access protected route without token → 401 Unauthorized
- [ ] Token expires after 15 minutes → Auto refresh
- [ ] Refresh token works → New access token
- [ ] Invalid refresh token → Redirect to login

### Customer Booking Flow

#### Fare Estimation
- [ ] Enter valid locations → Show fare estimates
- [ ] Enter invalid coordinates → Validation error
- [ ] Distance < 0.5km → Error "Distance too short"
- [ ] Multiple vehicle types shown → Different prices
- [ ] Surge pricing applied → Higher fares during peak hours

#### Booking Creation
- [ ] Select vehicle and confirm → Booking created
- [ ] Booking reference generated → Unique ID
- [ ] Fare calculated correctly → Matches estimate
- [ ] Vehicle availability checked → Error if unavailable
- [ ] Booking saved to database → Visible in history

#### Booking History
- [ ] View all bookings → Sorted by date (newest first)
- [ ] Booking details displayed → All fields correct
- [ ] Status shown correctly → Color-coded badges
- [ ] Empty state shown → "No bookings yet"

### Admin Panel Tests

#### Dashboard
- [ ] Stats displayed correctly → All metrics accurate
- [ ] Total bookings count → Matches database
- [ ] Revenue calculation → Sum of completed bookings
- [ ] Vehicle counts → Available vs total

#### Vehicle Management
- [ ] View all vehicles → All vehicles listed
- [ ] Add new vehicle → Success + appears in list
- [ ] Edit vehicle → Changes saved
- [ ] Delete vehicle (no bookings) → Success
- [ ] Delete vehicle (with bookings) → Error prevented
- [ ] Duplicate license plate → Error

#### Booking Management
- [ ] View all bookings → All bookings listed
- [ ] Filter by status → Correct bookings shown
- [ ] Update status to CONFIRMED → Success
- [ ] Update status to IN_PROGRESS → Success
- [ ] Update status to COMPLETED → Success
- [ ] Update status to CANCELLED → Success
- [ ] Customer details visible → Name, email, phone
- [ ] Vehicle details visible → Type, model, license

### Security Tests

#### Authorization
- [ ] Customer cannot access admin routes → 403 Forbidden
- [ ] Unauthenticated user redirected → Login page
- [ ] Admin can access all routes → Success
- [ ] JWT validation working → Invalid token rejected

#### Input Validation
- [ ] SQL injection attempts → Blocked by Prisma
- [ ] XSS attempts → Sanitized
- [ ] Invalid data types → Validation error
- [ ] Missing required fields → Validation error

#### Rate Limiting
- [ ] Login attempts limited → 5 per 15 minutes
- [ ] Booking requests limited → 10 per minute
- [ ] General API limited → 100 per 15 minutes

### Edge Cases

#### Concurrent Operations
- [ ] Two users book same vehicle → One succeeds, one fails
- [ ] Multiple admins edit same vehicle → Last write wins
- [ ] Rapid booking attempts → Rate limited

#### Network Issues
- [ ] Backend down → Error message shown
- [ ] Slow network → Loading states shown
- [ ] Request timeout → Error handled gracefully

#### Data Validation
- [ ] Negative coordinates → Validation error
- [ ] Coordinates out of range → Validation error
- [ ] Zero distance → Error
- [ ] Negative fare → Prevented by validation

## API Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123",
    "name": "Test User",
    "phone": "+1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@taxibooking.com",
    "password": "Admin@123"
  }'
```

### Get Vehicles (No Auth Required)
```bash
curl http://localhost:5000/api/vehicles
```

### Get Fare Estimate (Auth Required)
```bash
curl -X POST http://localhost:5000/api/bookings/estimate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "pickupLat": 40.758896,
    "pickupLng": -73.985130,
    "dropoffLat": 40.785091,
    "dropoffLng": -73.968285
  }'
```

### Create Booking (Auth Required)
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "vehicleId": "VEHICLE_ID",
    "pickupLocation": "Times Square, New York",
    "pickupLat": 40.758896,
    "pickupLng": -73.985130,
    "dropoffLocation": "Central Park, New York",
    "dropoffLat": 40.785091,
    "dropoffLng": -73.968285
  }'
```

### Admin: Get All Bookings
```bash
curl http://localhost:5000/api/admin/bookings \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

## Performance Testing

### Load Testing Scenarios
1. 100 concurrent users browsing vehicles
2. 50 concurrent booking requests
3. 10 concurrent admin operations
4. Database query performance under load

### Expected Response Times
- Vehicle listing: < 200ms
- Fare estimation: < 300ms
- Booking creation: < 500ms
- Admin dashboard: < 400ms

## Database Testing

### Check Data Integrity
```sql
-- Verify foreign key constraints
SELECT * FROM bookings WHERE user_id NOT IN (SELECT id FROM users);
SELECT * FROM bookings WHERE vehicle_id NOT IN (SELECT id FROM vehicles);

-- Check booking status distribution
SELECT status, COUNT(*) FROM bookings GROUP BY status;

-- Verify fare calculations
SELECT id, distance, fare, (distance * 2.5 + 50) as expected_min_fare 
FROM bookings 
WHERE fare < (distance * 2.5 + 50);
```

## Browser Testing

### Supported Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Responsive Design
- [ ] Mobile (320px - 480px)
- [ ] Tablet (481px - 768px)
- [ ] Desktop (769px+)

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Form labels present
- [ ] Error messages clear
- [ ] Color contrast sufficient
- [ ] Screen reader compatible

## Test Results Template

```
Date: [DATE]
Tester: [NAME]
Environment: [Local/Staging/Production]

✅ Passed: [COUNT]
❌ Failed: [COUNT]
⚠️  Warnings: [COUNT]

Critical Issues:
- [Issue 1]
- [Issue 2]

Notes:
[Additional observations]
```
