# CleanConnect - C2C Freelance Home Cleaning Platform

A modern web application connecting home owners with freelance cleaners.

## Features

- 🔐 Multi-role user system (Admin, Cleaner, Home Owner)
- 🧹 Cleaner service management
- 🔍 Advanced search and filtering
- 📊 Analytics and tracking
- 📅 Booking and scheduling
- 💼 Service history and reporting

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Shadcn UI
- Tailwind CSS
- React Server Components

### Backend
- Node.js
- TypeScript
- Object-Oriented Design
- In-memory data storage

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Start the development servers
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd ../frontend
npm run dev
```

## Project Structure

```
├── frontend/           # Next.js frontend application
│   ├── app/           # App router pages
│   ├── components/    # React components
│   ├── lib/          # Utility functions
│   └── types/        # TypeScript types
│
├── backend/           # Node.js backend application
│   ├── src/          # Source code
│   │   ├── models/   # Domain models
│   │   ├── services/ # Business logic
│   │   └── api/      # API routes
│   └── tests/        # Test files
│
└── docs/             # Project documentation
```

## Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write unit tests for critical functionality
- Follow the Git flow branching strategy

## License

This project is licensed under the MIT License. 