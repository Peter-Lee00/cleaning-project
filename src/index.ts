import express from 'express';
import cors from 'cors';
import { UserService, validRoles } from './services/UserService';
import { ServiceService } from './services/ServiceService';
import { BookingService } from './services/BookingService';
import { UserRole } from './models/User';
import { BookingStatus } from './models/Booking';

const app = express();
const port = 3001;

// basic setup
app.use(cors());
app.use(express.json());

// services
const userService = new UserService();
const serviceService = new ServiceService();
const bookingService = new BookingService();

// user routes
app.post('/api/users/register', (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const user = userService.register(email, password, name, role);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/users/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = userService.login(email, password);
    res.json(user);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

app.put('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = userService.updateProfile(id, updates);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    userService.deleteUser(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// service routes
app.post('/api/services', (req, res) => {
  try {
    const { name, info, categoryId, price, hours } = req.body;
    const service = serviceService.createService(name, info, categoryId, price, hours);
    res.status(201).json(service);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/services', (req, res) => {
  try {
    const { category, minPrice, maxPrice, maxHours, search } = req.query;
    let services;

    if (search) {
      services = serviceService.searchServices(search as string);
    } else if (category) {
      services = serviceService.getServicesByCategory(category as string);
    } else if (minPrice && maxPrice) {
      services = serviceService.getServicesByPriceRange(Number(minPrice), Number(maxPrice));
    } else if (maxHours) {
      services = serviceService.getServicesByDuration(Number(maxHours));
    } else {
      services = serviceService.getAllServices();
    }

    res.json(services);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// booking routes
app.post('/api/bookings', (req, res) => {
  try {
    const { cleanerId, homeOwnerId, serviceId, date, hours, notes } = req.body;
    const booking = bookingService.createBooking(cleanerId, homeOwnerId, serviceId, new Date(date), hours, notes);
    res.status(201).json(booking);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/bookings/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const booking = bookingService.updateBookingStatus(id, status);
    res.json(booking);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/bookings/:id/review', (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    const booking = bookingService.addReview(id, rating, review);
    res.json(booking);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// get all data routes
app.get('/api/users', (req, res) => {
  try {
    const { role } = req.query;
    let users;
    
    if (role) {
      // Validate role if provided
      if (!validRoles.includes(role as any)) {
        throw new Error('Invalid role. Must be one of: ' + validRoles.join(', '));
      }
      users = userService.getUsersByRole(role as typeof validRoles[number]);
    } else {
      // Get all users if no role specified
      users = userService.getAllUsers();
    }
    
    res.json(users);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/services/all', (req, res) => {
  try {
    const services = serviceService.getAllServices();
    res.json(services);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/bookings', (req, res) => {
  try {
    const bookings = bookingService.getAllBookings();
    res.json(bookings);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// start server
app.listen(port, () => {
  console.log('Server started! Go to: http://localhost:' + port);
}); 