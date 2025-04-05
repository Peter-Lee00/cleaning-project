# CleanConnect Backend

Backend service for the CleanConnect platform - a C2C freelance home cleaning platform.

## Features

- User management (Admin, Cleaner, Home Owner)
- Service management and categorization
- Booking system
- Analytics and reporting
- In-memory data storage

## Tech Stack

- Node.js
- TypeScript
- Express
- Object-Oriented Design

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Generate test data:
```bash
npm run generate-data
```

3. Start the development server:
```bash
npm run dev
```

The server will start on http://localhost:3001

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run generate-data` - Generate test data
- `npm run setup` - Install dependencies and generate test data

## API Endpoints

### User Management
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `PUT /api/users/:id` - Update user profile

### Service Management
- `POST /api/services` - Create a new service
- `GET /api/services` - Get services with filters
- `GET /api/services/:id` - Get service by ID
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Booking Management
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id/status` - Update booking status
- `POST /api/bookings/:id/review` - Add review to booking
- `GET /api/bookings/cleaner/:id` - Get cleaner's bookings
- `GET /api/bookings/homeowner/:id` - Get home owner's bookings

### Analytics
- `GET /api/analytics/cleaner/:id` - Get cleaner analytics
- `GET /api/analytics/homeowner/:id` - Get home owner analytics
- `GET /api/analytics/platform` - Get platform analytics

## Data Models

### User
- Base user properties
- Role-specific properties for Admin, Cleaner, and Home Owner

### Service
- Service details
- Category association
- Pricing and duration

### Booking
- Booking details
- Status management
- Review system

## Development

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages

### Testing
- Write unit tests for critical functionality
- Use Jest for testing
- Maintain good test coverage

## License

This project is licensed under the MIT License. 