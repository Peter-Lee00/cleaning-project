# CleanConnect Platform

A full-stack application connecting homeowners with cleaning service providers. Built with TypeScript, Express.js, and Next.js.

## Project Structure

```
cleaning-project/
├── backend/           # Express.js API
│   ├── src/
│   │   ├── models/   # Data models
│   │   ├── services/ # Business logic
│   │   ├── data/     # Data storage
│   │   └── scripts/  # Utility scripts
│   └── package.json
└── frontend/         # Next.js application
    ├── src/
    │   ├── app/     # App router pages
    │   ├── components/ # React components
    │   └── lib/     # Utilities and API
    └── package.json
```

## Features

### Backend
- User authentication and authorization (Admin, Cleaner, Home Owner, User roles)
- Service management (categories, services)
- Booking system with status tracking
- Review and rating system
- In-memory data store with TypeScript types
- Analytics and reporting

### Frontend
- Modern UI with Tailwind CSS
- Responsive design
- User authentication flows
- Dashboard for both cleaners and homeowners
- Service browsing and booking

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### User Management
- `GET /api/users` - Get all users (with optional role filter)
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user

### Service Management
- `GET /api/services` - Get services (with filters)
- `POST /api/services` - Create new service
- `GET /api/services/all` - Get all services

### Booking Management
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/status` - Update booking status
- `POST /api/bookings/:id/review` - Add review
- `GET /api/bookings` - Get all bookings

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cleaning-project.git
cd cleaning-project
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Start development servers:
```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm run dev
```

The backend will run on http://localhost:3001 and the frontend on http://localhost:3000.

## Development

### Backend
- Written in TypeScript
- Uses service-based architecture
- In-memory data store (can be extended to use a database)
- Includes test data generation script
- Object-Oriented Design

### Frontend
- Built with Next.js 15 (App Router)
- Uses React 19
- Styled with Tailwind CSS
- TypeScript for type safety

## License

This project is licensed under the MIT License.
