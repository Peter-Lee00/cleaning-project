import express from 'express';
import cors from 'cors';
import { UserService } from './services/UserService';
import { ServiceService } from './services/ServiceService';
import { BookingService } from './services/BookingService';
import { UserRole } from './models/User';
import { BookingStatus } from './models/Booking';

// Initialize Express application
const app = express();
const port = process.env.PORT || 3001;

// Middleware setup
app.use(cors());                // Enable CORS for all routes
app.use(express.json());        // Parse JSON request bodies

// Initialize services
const userService = new UserService();
const serviceService = new ServiceService();
const bookingService = new BookingService();

// Error handling interface
interface ApiError extends Error {
  status?: number;  // Optional HTTP status code
}

// User Management Routes
// --------------------

/**
 * Register a new user
 * POST /api/users/register
 * Body: {
 *   email: string
 *   password: string
 *   firstName: string
 *   lastName: string
 *   role: UserRole
 *   hourlyRate?: number  // Required for cleaners
 * }
 */
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, hourlyRate } = req.body;
    const user = await userService.registerUser(
      email,
      password,
      firstName,
      lastName,
      role,
      hourlyRate
    );
    res.status(201).json(user);
  } catch (error) {
    const apiError = error as ApiError;
    res.status(apiError.status || 400).json({ error: apiError.message });
  }
});

/**
 * User login
 * POST /api/users/login
 * Body: {
 *   email: string
 *   password: string
 * }
 */
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.login(email, password);
    res.json(user);
  } catch (error) {
    const apiError = error as ApiError;
    res.status(apiError.status || 401).json({ error: apiError.message });
  }
});

/**
 * Update user profile
 * PUT /api/users/:id
 * Body: {
 *   firstName?: string
 *   lastName?: string
 *   email?: string
 *   password?: string
 * }
 */
app.put('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = userService.updateUserProfile(id, updates);
    res.json(user);
  } catch (error) {
    const apiError = error as ApiError;
    res.status(apiError.status || 400).json({ error: apiError.message });
  }
});

// Service Management Routes
// -----------------------

/**
 * Create a new service
 * POST /api/services
 * Body: {
 *   name: string
 *   description: string
 *   category: string
 *   basePrice: number
 *   duration: number
 * }
 */
app.post('/api/services', (req, res) => {
  try {
    const { name, description, category, basePrice, duration } = req.body;
    const service = serviceService.createService(
      name,
      description,
      category,
      basePrice,
      duration
    );
    res.status(201).json(service);
  } catch (error) {
    const apiError = error as ApiError;
    res.status(apiError.status || 400).json({ error: apiError.message });
  }
});

/**
 * Get services with filters
 * GET /api/services
 * Query params:
 *   category?: string
 *   minPrice?: number
 *   maxPrice?: number
 *   maxDuration?: number
 *   search?: string
 */
app.get('/api/services', (req, res) => {
  try {
    const { category, minPrice, maxPrice, maxDuration, search } = req.query;
    let services;

    if (search) {
      services = serviceService.searchServices(search as string);
    } else if (category) {
      services = serviceService.getServicesByCategory(category as string);
    } else if (minPrice && maxPrice) {
      services = serviceService.getServicesByPriceRange(
        Number(minPrice),
        Number(maxPrice)
      );
    } else if (maxDuration) {
      services = serviceService.getServicesByDuration(Number(maxDuration));
    } else {
      services = serviceService.getAllCategories();
    }

    res.json(services);
  } catch (error) {
    const apiError = error as ApiError;
    res.status(apiError.status || 400).json({ error: apiError.message });
  }
});

// Booking Management Routes
// -----------------------

/**
 * Create a new booking
 * POST /api/bookings
 * Body: {
 *   cleanerId: string
 *   homeOwnerId: string
 *   serviceId: string
 *   scheduledDate: string (ISO date)
 *   duration: number
 *   notes?: string
 * }
 */
app.post('/api/bookings', (req, res) => {
  try {
    const { cleanerId, homeOwnerId, serviceId, scheduledDate, duration, notes } = req.body;
    const booking = bookingService.createBooking(
      cleanerId,
      homeOwnerId,
      serviceId,
      new Date(scheduledDate),
      duration,
      notes
    );
    res.status(201).json(booking);
  } catch (error) {
    const apiError = error as ApiError;
    res.status(apiError.status || 400).json({ error: apiError.message });
  }
});

/**
 * Update booking status
 * PUT /api/bookings/:id/status
 * Body: {
 *   status: BookingStatus
 * }
 */
app.put('/api/bookings/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const booking = bookingService.updateBookingStatus(id, status);
    res.json(booking);
  } catch (error) {
    const apiError = error as ApiError;
    res.status(apiError.status || 400).json({ error: apiError.message });
  }
});

/**
 * Add review to booking
 * POST /api/bookings/:id/review
 * Body: {
 *   rating: number (1-5)
 *   review: string
 * }
 */
app.post('/api/bookings/:id/review', (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    const booking = bookingService.addReview(id, rating, review);
    res.json(booking);
  } catch (error) {
    const apiError = error as ApiError;
    res.status(apiError.status || 400).json({ error: apiError.message });
  }
});

// Analytics Routes
// ---------------

/**
 * Get cleaner analytics
 * GET /api/analytics/cleaner/:id
 * Query params:
 *   startDate: string (ISO date)
 *   endDate: string (ISO date)
 */
app.get('/api/analytics/cleaner/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    const analytics = bookingService.getCleanerAnalytics(
      id,
      new Date(startDate as string),
      new Date(endDate as string)
    );
    res.json(analytics);
  } catch (error) {
    const apiError = error as ApiError;
    res.status(apiError.status || 400).json({ error: apiError.message });
  }
});

/**
 * Get home owner analytics
 * GET /api/analytics/homeowner/:id
 * Query params:
 *   startDate: string (ISO date)
 *   endDate: string (ISO date)
 */
app.get('/api/analytics/homeowner/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    const analytics = bookingService.getHomeOwnerAnalytics(
      id,
      new Date(startDate as string),
      new Date(endDate as string)
    );
    res.json(analytics);
  } catch (error) {
    const apiError = error as ApiError;
    res.status(apiError.status || 400).json({ error: apiError.message });
  }
});

/**
 * Get platform analytics
 * GET /api/analytics/platform
 * Query params:
 *   startDate: string (ISO date)
 *   endDate: string (ISO date)
 */
app.get('/api/analytics/platform', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = bookingService.getPlatformAnalytics(
      new Date(startDate as string),
      new Date(endDate as string)
    );
    res.json(analytics);
  } catch (error) {
    const apiError = error as ApiError;
    res.status(apiError.status || 400).json({ error: apiError.message });
  }
});

// Get all users
app.get('/api/users', (req, res) => {
  try {
    const users = userService.getAllUsers();
    res.json(users);
  } catch (error) {
    const apiError = error as ApiError;
    res.status(apiError.status || 400).json({ error: apiError.message });
  }
});

// Get all services
app.get('/api/services', (req, res) => {
  try {
    const services = serviceService.getAllServices();
    res.json(services);
  } catch (error) {
    const apiError = error as ApiError;
    res.status(apiError.status || 400).json({ error: apiError.message });
  }
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  try {
    const bookings = bookingService.getAllBookings();
    res.json(bookings);
  } catch (error) {
    const apiError = error as ApiError;
    res.status(apiError.status || 400).json({ error: apiError.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 