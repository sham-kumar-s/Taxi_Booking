#!/bin/bash

echo "🚕 Setting up PERN Taxi Booking Platform..."

# Backend setup
echo "\n📦 Setting up backend..."
cd backend
cp .env.example .env
echo "⚠️  Please update backend/.env with your database credentials"
npm install
echo "✅ Backend dependencies installed"

# Frontend setup
echo "\n📦 Setting up frontend..."
cd ../frontend
cp .env.example .env.local
npm install
echo "✅ Frontend dependencies installed"

cd ..

echo "\n✅ Setup complete!"
echo "\nNext steps:"
echo "1. Update backend/.env with your PostgreSQL credentials"
echo "2. Run: cd backend && npm run db:migrate"
echo "3. Run: cd backend && npm run db:seed"
echo "4. Start backend: cd backend && npm run dev"
echo "5. Start frontend: cd frontend && npm run dev"
echo "\n🎉 Happy coding!"
