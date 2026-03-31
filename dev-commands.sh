#!/bin/bash

# Development Helper Commands for PERN Taxi Booking Platform

show_help() {
    echo "🚕 PERN Taxi Booking - Development Commands"
    echo ""
    echo "Usage: ./dev-commands.sh [command]"
    echo ""
    echo "Commands:"
    echo "  setup          - Initial project setup"
    echo "  start          - Start both backend and frontend"
    echo "  backend        - Start backend only"
    echo "  frontend       - Start frontend only"
    echo "  db-reset       - Reset database (migrate + seed)"
    echo "  db-studio      - Open Prisma Studio"
    echo "  clean          - Clean node_modules and reinstall"
    echo "  test           - Run tests"
    echo "  build          - Build for production"
    echo "  help           - Show this help message"
    echo ""
}

setup() {
    echo "🚀 Setting up project..."
    chmod +x setup.sh
    ./setup.sh
}

start_all() {
    echo "🚀 Starting backend and frontend..."
    echo "Backend will run on http://localhost:5000"
    echo "Frontend will run on http://localhost:3000"
    echo ""
    
    # Start backend in background
    cd backend
    npm run dev &
    BACKEND_PID=$!
    
    # Start frontend in background
    cd ../frontend
    npm run dev &
    FRONTEND_PID=$!
    
    echo ""
    echo "✅ Both servers started!"
    echo "Backend PID: $BACKEND_PID"
    echo "Frontend PID: $FRONTEND_PID"
    echo ""
    echo "Press Ctrl+C to stop both servers"
    
    # Wait for Ctrl+C
    trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
    wait
}

start_backend() {
    echo "🚀 Starting backend..."
    cd backend
    npm run dev
}

start_frontend() {
    echo "🚀 Starting frontend..."
    cd frontend
    npm run dev
}

reset_db() {
    echo "🔄 Resetting database..."
    cd backend
    echo "Running migrations..."
    npm run db:migrate
    echo "Seeding database..."
    npm run db:seed
    echo "✅ Database reset complete!"
}

open_studio() {
    echo "🎨 Opening Prisma Studio..."
    cd backend
    npm run db:studio
}

clean_install() {
    echo "🧹 Cleaning and reinstalling dependencies..."
    
    echo "Cleaning backend..."
    cd backend
    rm -rf node_modules package-lock.json
    npm install
    
    echo "Cleaning frontend..."
    cd ../frontend
    rm -rf node_modules package-lock.json .next
    npm install
    
    echo "✅ Clean install complete!"
}

run_tests() {
    echo "🧪 Running tests..."
    echo "Backend tests..."
    cd backend
    npm test
    
    echo "Frontend tests..."
    cd ../frontend
    npm test
}

build_prod() {
    echo "🏗️  Building for production..."
    
    echo "Building backend..."
    cd backend
    npm run build
    
    echo "Building frontend..."
    cd ../frontend
    npm run build
    
    echo "✅ Build complete!"
}

# Main script logic
case "$1" in
    setup)
        setup
        ;;
    start)
        start_all
        ;;
    backend)
        start_backend
        ;;
    frontend)
        start_frontend
        ;;
    db-reset)
        reset_db
        ;;
    db-studio)
        open_studio
        ;;
    clean)
        clean_install
        ;;
    test)
        run_tests
        ;;
    build)
        build_prod
        ;;
    help|*)
        show_help
        ;;
esac
