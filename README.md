# CleanConnect - C2C Freelance Home Cleaning Platform

A modern web application connecting home owners with freelance cleaners.

## Features

- 🔐 Multi-role user system (Admin, Cleaner, Home Owner)
- 🧹 Service and category management
- 📅 Booking management with status tracking
- ⭐ Rating and review system
- 📊 Analytics for cleaners, home owners, and platform
- 💼 User profiles and history

## Tech Stack

### Backend
- Node.js & Express
- TypeScript
- Object-Oriented Design
- In-memory data storage with DataStore pattern
- RESTful API architecture

### Frontend (Coming Soon)
- Next.js 15 (App Router)
- TypeScript
- Shadcn UI
- Tailwind CSS
- React Server Components

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Peter-Lee00/cleaning-project.git
cd cleaning-project
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Generate test data (optional)
```bash
npm run generate-data
```

## Project Structure

```
├── backend/                 # Node.js backend application
│   ├── src/                # Source code
│   │   ├── data/          # Data storage layer
│   │   │   └── DataStore.ts
│   │   ├── models/        # Domain models
│   │   │   ├── User.ts
│   │   │   ├── Service.ts
│   │   │   └── Booking.ts
│   │   ├── services/      # Business logic
│   │   │   ├── UserService.ts
│   │   │   ├── ServiceService.ts
│   │   │   └── BookingService.ts
│   │   ├── scripts/       # Utility scripts
│   │   │   └── generateTestData.ts
│   │   └── index.ts       # Express application setup
│   ├── package.json       # Dependencies and scripts
│   ├── tsconfig.json      # TypeScript configuration
│   └── .eslintrc.json     # ESLint configuration
│
└── frontend/              # Next.js frontend (Coming Soon)
```

## API Endpoints

### User Management
- `POST /api/users/register` - Register new user (Cleaner/Home Owner/Admin)
- `POST /api/users/login` - User login
- `PUT /api/users/:id` - Update user profile
- `GET /api/users` - Get all users

### Service Management
- `POST /api/services` - Create new service
- `GET /api/services` - Get all services
- `GET /api/services/categories` - Get all service categories
- `GET /api/services/search` - Search services by criteria

### Booking Management
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings
- `PUT /api/bookings/:id/status` - Update booking status
- `POST /api/bookings/:id/review` - Add review to booking

### Analytics
- `GET /api/analytics/cleaner/:id` - Get cleaner statistics
- `GET /api/analytics/homeowner/:id` - Get home owner statistics
- `GET /api/analytics/platform` - Get platform-wide analytics

## Data Models

### User Types
- **Cleaner**: Professional service provider
  - Services offered
  - Hourly rate
  - Availability
  - Rating
  - Job statistics

- **Home Owner**: Service requester
  - Booking history
  - Shortlisted cleaners

- **Admin**: Platform manager
  - User management
  - Service oversight
  - Analytics access

### Service
- Name
- Description
- Category
- Base price
- Duration

### Booking
- Cleaner and home owner references
- Service details
- Scheduled date
- Status (Pending/Confirmed/Completed/Cancelled)
- Review and rating

## Development Guidelines

- Use TypeScript for type safety
- Follow OOP principles for code organization
- Implement proper error handling
- Document API endpoints and models
- Write clean, maintainable code

## License

This project is licensed under the MIT License. 