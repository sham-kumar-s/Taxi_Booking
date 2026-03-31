# Deployment Guide

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Setup Steps

1. Clone the repository
```bash
git clone <your-repo-url>
cd taxi-booking
```

2. Run setup script
```bash
chmod +x setup.sh
./setup.sh
```

3. Configure environment variables
```bash
# Backend (.env)
cd backend
nano .env
# Update DATABASE_URL with your PostgreSQL credentials
```

4. Initialize database
```bash
cd backend
npm run db:migrate
npm run db:seed
```

5. Start backend
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

6. Start frontend (new terminal)
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

## Production Deployment

### Backend (Railway/Render/Heroku)

1. Create new project on Railway/Render
2. Connect your GitHub repository
3. Set environment variables:
```
DATABASE_URL=<your-production-postgres-url>
JWT_SECRET=<generate-strong-secret-min-32-chars>
JWT_REFRESH_SECRET=<generate-another-strong-secret>
PORT=5000
NODE_ENV=production
FRONTEND_URL=<your-frontend-url>
```

4. Build command: `cd backend && npm install && npm run build`
5. Start command: `cd backend && npm start`
6. Run migrations: `cd backend && npm run db:migrate`
7. Seed database: `cd backend && npm run db:seed`

### Frontend (Vercel/Netlify)

1. Create new project on Vercel/Netlify
2. Connect your GitHub repository
3. Set root directory: `frontend`
4. Set environment variable:
```
NEXT_PUBLIC_API_URL=<your-backend-api-url>
```
5. Build command: `npm run build`
6. Deploy

### Database (Railway/Supabase/AWS RDS)

1. Create PostgreSQL database
2. Copy connection string
3. Update backend DATABASE_URL
4. Run migrations

## Testing the Deployment

1. Visit frontend URL
2. Register a new account
3. Login and create a booking
4. Login as admin (admin@taxibooking.com / Admin@123)
5. Verify admin panel functionality

## Monitoring

- Check backend logs for errors
- Monitor database connections
- Set up error tracking (Sentry)
- Configure uptime monitoring

## Security Checklist

- [ ] Strong JWT secrets (min 32 characters)
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Database backups configured
- [ ] Environment variables secured
- [ ] SQL injection prevention (Prisma ORM)
- [ ] XSS protection (input sanitization)

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL format
- Check database server is running
- Verify network access/firewall rules

### CORS Errors
- Update FRONTEND_URL in backend .env
- Verify CORS configuration in backend/src/server.ts

### JWT Token Issues
- Ensure JWT_SECRET is set
- Check token expiry times
- Verify refresh token flow

## Performance Optimization

- Enable database connection pooling
- Add Redis for caching
- Implement CDN for static assets
- Enable gzip compression
- Optimize database queries with indexes
