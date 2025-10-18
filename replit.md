# PDP University Monitoring Platform

## Overview
A comprehensive full-stack web application for managing university operations, including student performance tracking, grant management, code editor for assignments, and multi-role access control.

**Technology Stack:**
- Frontend: React 18 + Vite + TypeScript + Tailwind CSS
- Backend: Express.js + Node.js
- Database: PostgreSQL (Neon) with Drizzle ORM
- Authentication: Passport.js with local username/password strategy

## Project Architecture

### Directory Structure
- `client/` - React frontend application
  - `src/components/` - UI components (Radix UI components)
  - `src/pages/` - Application pages/routes
  - `src/hooks/` - Custom React hooks
  - `src/lib/` - Utility functions
- `server/` - Express backend
  - `index.ts` - Main server entry point
  - `routes.ts` - API route definitions
  - `auth.ts` - Authentication configuration
  - `db.ts` - Database connection
  - `seed.ts` - Database seeding script
- `shared/` - Code shared between frontend and backend
  - `schema.ts` - Database schema definitions (Drizzle)

### Key Features
1. **Multi-Role Access System**
   - Academic Affairs Admin
   - Student Affairs Admin
   - Grant Committee Admin
   - Teachers
   - Students

2. **Grant Management**
   - Golden Minds grants
   - Unicorn grants
   - Application tracking and review

3. **Performance Tracking**
   - Grade management
   - Attendance monitoring
   - Coding hours tracking

4. **Code Editor**
   - Monaco Editor integration
   - Assignment submission
   - Code review system

## Database

PostgreSQL database is already provisioned and configured.

### Admin Accounts
Three default admin accounts have been seeded:

1. **Student Affairs Admin**
   - Username: `Studentaffairs`
   - Password: `STaffairs2233`

2. **Academic Affairs Admin**
   - Username: `Academicaffairs`
   - Password: `ACaffairs2233`

3. **Grant Committee Admin**
   - Username: `admin`
   - Password: `admin2233`

### Database Commands
- `npm run db:push` - Sync schema to database
- `npm run db:seed` - Seed admin accounts

## Development

### Running Locally
```bash
npm run dev
```
Server runs on port 5000 (http://0.0.0.0:5000)

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-configured)
- `NODE_ENV` - Set to "development" for dev mode
- `PORT` - Server port (defaults to 5000)

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run check` - TypeScript type checking

## Deployment

The project is configured for Replit Autoscale deployment:
- Build command: `npm run build`
- Run command: `npm run start`
- Port: 5000

## Recent Changes (October 18, 2025)

### Initial Replit Setup
1. Installed all npm dependencies
2. Configured PostgreSQL database with Neon serverless driver
3. Applied database schema using Drizzle ORM
4. Seeded admin accounts into the database
5. Set up development workflow on port 5000
6. Configured deployment settings for production
7. Verified application is running correctly

### Technical Notes
- The server binds to `0.0.0.0:5000` for proper Replit proxying
- Vite dev server is configured with `allowedHosts: true` for iframe support
- Database uses Neon serverless with WebSocket connection
- All authentication uses bcrypt for password hashing

## Project Status
✅ Application is fully functional and ready to use
✅ Database is set up and seeded
✅ Development environment configured
✅ Deployment settings configured
