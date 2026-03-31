# API Documentation

Base URL: `http://localhost:5000/api` (development)

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

## Endpoints

### Authentication

#### Register User
```
POST /auth/register
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "role": "CUSTOMER"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### Login
```
POST /auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "role": "CUSTOMER"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

**Rate Limit:** 5 requests per 15 minutes

#### Refresh Token
```
POST /auth/refresh
```

**Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token"
  }
}
```

#### Logout
```
POST /auth/logout
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Vehicles

#### Get Available Vehicles
```
GET /vehicles
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "Sedan",
      "model": "Honda Accord",
      "licensePlate": "XYZ-5678",
      "capacity": 4,
      "pricePerKm": 3.0,
      "baseFare": 60,
      "status": "AVAILABLE",
      "imageUrl": "https://...",
      "createdAt": "2024-03-30T10:00:00Z",
      "updatedAt": "2024-03-30T10:00:00Z"
    }
  ]
}
```

#### Get Vehicle by ID
```
GET /vehicles/:id
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "Sedan",
    "model": "Honda Accord",
    "licensePlate": "XYZ-5678",
    "capacity": 4,
    "pricePerKm": 3.0,
    "baseFare": 60,
    "status": "AVAILABLE",
    "imageUrl": "https://...",
    "createdAt": "2024-03-30T10:00:00Z",
    "updatedAt": "2024-03-30T10:00:00Z"
  }
}
```

---

### Bookings (Customer)

#### Get Fare Estimate
```
POST /bookings/estimate
```

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "pickupLat": 40.758896,
  "pickupLng": -73.985130,
  "dropoffLat": 40.785091,
  "dropoffLng": -73.968285
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "distance": 3.45,
    "estimates": [
      {
        "vehicleId": "uuid",
        "vehicleType": "Economy",
        "model": "Toyota Corolla",
        "capacity": 4,
        "distance": 3.45,
        "fare": 58.63,
        "imageUrl": "https://..."
      },
      {
        "vehicleId": "uuid",
        "vehicleType": "Sedan",
        "model": "Honda Accord",
        "capacity": 4,
        "distance": 3.45,
        "fare": 70.35,
        "imageUrl": "https://..."
      }
    ]
  }
}
```

**Fare Calculation:**
- Base Fare + (Distance × Price Per KM) × Surge Multiplier
- Surge Multiplier varies by time:
  - Weekday peak hours (7-10 AM, 5-8 PM): 1.5x
  - Late night (10 PM - 6 AM): 1.3x
  - Weekends: 1.2x
  - Normal hours: 1.0x

#### Create Booking
```
POST /bookings
```

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "vehicleId": "uuid",
  "pickupLocation": "Times Square, New York",
  "pickupLat": 40.758896,
  "pickupLng": -73.985130,
  "dropoffLocation": "Central Park, New York",
  "dropoffLat": 40.785091,
  "dropoffLng": -73.968285
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "bookingRef": "clx1234567890",
    "userId": "uuid",
    "vehicleId": "uuid",
    "pickupLocation": "Times Square, New York",
    "pickupLat": 40.758896,
    "pickupLng": -73.985130,
    "dropoffLocation": "Central Park, New York",
    "dropoffLat": 40.785091,
    "dropoffLng": -73.968285,
    "distance": 3.45,
    "fare": 58.63,
    "status": "CONFIRMED",
    "createdAt": "2024-03-30T10:00:00Z",
    "updatedAt": "2024-03-30T10:00:00Z",
    "vehicle": {
      "type": "Economy",
      "model": "Toyota Corolla",
      "licensePlate": "ABC-1234"
    }
  },
  "message": "Booking confirmed! Reference: clx1234567890"
}
```

#### Get My Bookings
```
GET /bookings/my
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "bookingRef": "clx1234567890",
      "pickupLocation": "Times Square, New York",
      "dropoffLocation": "Central Park, New York",
      "distance": 3.45,
      "fare": 58.63,
      "status": "CONFIRMED",
      "createdAt": "2024-03-30T10:00:00Z",
      "vehicle": {
        "type": "Economy",
        "model": "Toyota Corolla",
        "licensePlate": "ABC-1234"
      }
    }
  ]
}
```

#### Get Booking by Reference
```
GET /bookings/ref/:ref
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "bookingRef": "clx1234567890",
    "pickupLocation": "Times Square, New York",
    "dropoffLocation": "Central Park, New York",
    "distance": 3.45,
    "fare": 58.63,
    "status": "CONFIRMED",
    "createdAt": "2024-03-30T10:00:00Z",
    "vehicle": {
      "id": "uuid",
      "type": "Economy",
      "model": "Toyota Corolla",
      "licensePlate": "ABC-1234",
      "capacity": 4,
      "pricePerKm": 2.5,
      "baseFare": 50
    }
  }
}
```

---

### Admin Endpoints

All admin endpoints require authentication AND admin role.

#### Get Dashboard Statistics
```
GET /admin/dashboard
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalBookings": 150,
    "activeBookings": 12,
    "completedBookings": 130,
    "totalRevenue": 8450.50,
    "totalVehicles": 5,
    "availableVehicles": 4
  }
}
```

#### Get All Vehicles
```
GET /admin/vehicles
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "Sedan",
      "model": "Honda Accord",
      "licensePlate": "XYZ-5678",
      "capacity": 4,
      "pricePerKm": 3.0,
      "baseFare": 60,
      "status": "AVAILABLE",
      "imageUrl": "https://...",
      "createdAt": "2024-03-30T10:00:00Z",
      "updatedAt": "2024-03-30T10:00:00Z"
    }
  ]
}
```

#### Create Vehicle
```
POST /admin/vehicles
```

**Headers:** `Authorization: Bearer <admin_token>`

**Body:**
```json
{
  "type": "SUV",
  "model": "Toyota RAV4",
  "licensePlate": "NEW-1234",
  "capacity": 6,
  "pricePerKm": 4.0,
  "baseFare": 80,
  "imageUrl": "https://..."
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "SUV",
    "model": "Toyota RAV4",
    "licensePlate": "NEW-1234",
    "capacity": 6,
    "pricePerKm": 4.0,
    "baseFare": 80,
    "status": "AVAILABLE",
    "imageUrl": "https://...",
    "createdAt": "2024-03-30T10:00:00Z",
    "updatedAt": "2024-03-30T10:00:00Z"
  },
  "message": "Vehicle created successfully"
}
```

#### Update Vehicle
```
PUT /admin/vehicles/:id
```

**Headers:** `Authorization: Bearer <admin_token>`

**Body:** (all fields optional)
```json
{
  "type": "SUV",
  "model": "Toyota RAV4 2024",
  "pricePerKm": 4.5,
  "status": "MAINTENANCE"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "SUV",
    "model": "Toyota RAV4 2024",
    "licensePlate": "NEW-1234",
    "capacity": 6,
    "pricePerKm": 4.5,
    "baseFare": 80,
    "status": "MAINTENANCE",
    "imageUrl": "https://...",
    "createdAt": "2024-03-30T10:00:00Z",
    "updatedAt": "2024-03-30T11:00:00Z"
  },
  "message": "Vehicle updated successfully"
}
```

#### Delete Vehicle
```
DELETE /admin/vehicles/:id
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Vehicle deleted successfully"
}
```

**Error (if vehicle has active bookings):** `400 Bad Request`
```json
{
  "success": false,
  "message": "Cannot delete vehicle with active bookings"
}
```

#### Get All Bookings
```
GET /admin/bookings?status=CONFIRMED
```

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `status` (optional): Filter by booking status (PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "bookingRef": "clx1234567890",
      "pickupLocation": "Times Square, New York",
      "dropoffLocation": "Central Park, New York",
      "distance": 3.45,
      "fare": 58.63,
      "status": "CONFIRMED",
      "createdAt": "2024-03-30T10:00:00Z",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      },
      "vehicle": {
        "type": "Economy",
        "model": "Toyota Corolla",
        "licensePlate": "ABC-1234"
      }
    }
  ]
}
```

#### Update Booking Status
```
PATCH /admin/bookings/:id/status
```

**Headers:** `Authorization: Bearer <admin_token>`

**Body:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Valid Status Values:**
- PENDING
- CONFIRMED
- IN_PROGRESS
- COMPLETED
- CANCELLED

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "bookingRef": "clx1234567890",
    "status": "IN_PROGRESS",
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "vehicle": {
      "type": "Economy",
      "model": "Toyota Corolla"
    }
  },
  "message": "Booking status updated successfully"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| POST /auth/login | 5 requests per 15 minutes |
| POST /bookings/* | 10 requests per minute |
| All other endpoints | 100 requests per 15 minutes |

## Testing with cURL

### Example: Complete Booking Flow

1. Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123","name":"Test User","phone":"+1234567890"}'
```

2. Get estimate:
```bash
curl -X POST http://localhost:5000/api/bookings/estimate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"pickupLat":40.758896,"pickupLng":-73.985130,"dropoffLat":40.785091,"dropoffLng":-73.968285}'
```

3. Create booking:
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"vehicleId":"VEHICLE_ID","pickupLocation":"Times Square","pickupLat":40.758896,"pickupLng":-73.985130,"dropoffLocation":"Central Park","dropoffLat":40.785091,"dropoffLng":-73.968285}'
```

## Postman Collection

Import this collection for easy API testing:
[Download Postman Collection](./postman_collection.json)

## WebSocket Support

Currently not implemented. Future enhancement for real-time tracking.
