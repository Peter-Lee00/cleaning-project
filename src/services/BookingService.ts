import { Booking, BookingStatus } from '../models/Booking';
import { DataStore } from '../data/DataStore';
import { UserService } from './UserService';
import { ServiceService } from './ServiceService';

// List of valid booking statuses
const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const;

// Type for booking status
type BookingStatusType = typeof validStatuses[number];

/**
 * Service class handling all booking-related operations
 * This includes creation, updates, queries, and analytics
 */
class BookingService {
  // Store all our data
  private db: DataStore;
  private userService: UserService;
  private serviceService: ServiceService;

  // Set up the service
  constructor() {
    this.db = DataStore.getInstance();
    this.userService = new UserService();
    this.serviceService = new ServiceService();
  }

  /**
   * Creates a new booking
   * Validates the cleaner, home owner, and service before creating
   * @param cleanerId - ID of the cleaner
   * @param homeOwnerId - ID of the home owner
   * @param serviceId - ID of the service
   * @param date - When the service is scheduled
   * @param hours - Duration in hours
   * @param notes - Optional notes about the booking
   * @returns The created booking
   */
  createBooking(
    cleanerId: string,
    homeOwnerId: string,
    serviceId: string,
    date: Date,
    hours: number,
    notes: string = ''
  ): Booking {
    try {
      // Check if users exist
      const cleaner = this.userService.getUserById(cleanerId);
      const homeOwner = this.userService.getUserById(homeOwnerId);
      
      // Check if service exists
      const service = this.serviceService.getServiceById(serviceId);
      
      // Calculate total price
      const totalPrice = service.getPrice();

      // Make the booking
      const booking = new Booking(
        cleanerId,
        homeOwnerId,
        serviceId,
        date,
        hours,
        totalPrice,
        notes
      );

      // Save it
      this.db.addBooking(booking);
      return booking;
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not create booking: ' + error.message);
    }
  }

  /**
   * Retrieves a booking by its ID
   * @param id - Booking ID
   * @returns The booking
   * @throws Error if booking not found
   */
  getBookingById(id: string): Booking {
    const booking = this.db.getBookingById(id);
    if (!booking) {
      throw new Error('No booking found with ID: ' + id);
    }
    return booking;
  }

  /**
   * Checks if a status is valid
   * @param status - Booking status
   * @returns True if status is valid, false otherwise
   */
  private isValidStatus(status: string): status is BookingStatusType {
    return validStatuses.includes(status as BookingStatusType);
  }

  /**
   * Updates the status of a booking
   * Handles state transitions (PENDING -> CONFIRMED -> COMPLETED)
   * @param id - Booking ID
   * @param newStatus - New status
   * @returns Updated booking
   */
  updateBookingStatus(id: string, newStatus: string): Booking {
    try {
      // Check if status is valid
      if (!this.isValidStatus(newStatus)) {
        throw new Error('Invalid booking status: ' + newStatus);
      }

      const booking = this.getBookingById(id);
      booking.setStatus(newStatus);
      this.db.updateBooking(booking);
      return booking;
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not update booking status: ' + error.message);
    }
  }

  /**
   * Updates the notes of a booking
   * @param id - Booking ID
   * @param notes - New notes
   * @returns Updated booking
   */
  updateBookingNotes(id: string, notes: string): Booking {
    try {
      const booking = this.getBookingById(id);
      booking.updateNotes(notes);
      this.db.updateBooking(booking);
      return booking;
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not update booking notes: ' + error.message);
    }
  }

  /**
   * Adds a review to a completed booking
   * @param id - Booking ID
   * @param rating - Rating from 1-5
   * @param review - Review text
   * @returns Updated booking
   */
  addReview(id: string, rating: number, review: string): Booking {
    try {
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }
      const booking = this.getBookingById(id);
      booking.addReview(rating, review);
      this.db.updateBooking(booking);
      return booking;
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not add review: ' + error.message);
    }
  }

  /**
   * Retrieves all bookings for a cleaner
   * @param cleanerId - Cleaner ID
   * @returns Array of bookings
   */
  getBookingsByCleaner(cleanerId: string): Booking[] {
    try {
      return this.db.getBookingsByCleaner(cleanerId);
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not get cleaner bookings: ' + error.message);
    }
  }

  /**
   * Retrieves all bookings for a home owner
   * @param homeOwnerId - Home owner ID
   * @returns Array of bookings
   */
  getBookingsByHomeOwner(homeOwnerId: string): Booking[] {
    try {
      return this.db.getBookingsByHomeOwner(homeOwnerId);
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not get home owner bookings: ' + error.message);
    }
  }

  /**
   * Retrieves all bookings with a specific status
   * @param status - Booking status
   * @returns Array of bookings
   */
  getBookingsByStatus(status: string): Booking[] {
    try {
      // Check if status is valid
      if (!this.isValidStatus(status)) {
        throw new Error('Invalid booking status: ' + status);
      }
      return this.db.getBookingsByStatus(status);
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not get bookings by status: ' + error.message);
    }
  }

  /**
   * Retrieves all bookings
   * @returns Array of bookings
   */
  getAllBookings(): Booking[] {
    try {
      return this.db.getAllBookings();
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not get all bookings: ' + error.message);
    }
  }

  /**
   * Generates analytics for a cleaner
   * @param cleanerId - Cleaner ID
   * @param startDate - Start of date range
   * @param endDate - End of date range
   * @returns Analytics data
   */
  getCleanerStats(cleanerId: string, startDate: Date, endDate: Date) {
    try {
      // Get cleaner's bookings in date range
      const bookings = this.getBookingsByCleaner(cleanerId)
        .filter(booking => 
          booking.scheduledDate >= startDate && 
          booking.scheduledDate <= endDate
        );

      // Calculate stats
      return {
        total: bookings.length,
        completed: bookings.filter(b => b.status === 'COMPLETED').length,
        cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
        totalEarnings: bookings
          .filter(b => b.status === 'COMPLETED')
          .reduce((sum, b) => sum + b.totalPrice, 0),
        averageRating: this.calculateAverageRating(bookings)
      };
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not get cleaner stats: ' + error.message);
    }
  }

  /**
   * Generates analytics for a home owner
   * @param homeOwnerId - Home owner ID
   * @param startDate - Start of date range
   * @param endDate - End of date range
   * @returns Analytics data
   */
  getHomeOwnerStats(homeOwnerId: string, startDate: Date, endDate: Date) {
    try {
      // Get home owner's bookings in date range
      const bookings = this.getBookingsByHomeOwner(homeOwnerId)
        .filter(booking => 
          booking.scheduledDate >= startDate && 
          booking.scheduledDate <= endDate
        );

      // Calculate stats
      return {
        total: bookings.length,
        completed: bookings.filter(b => b.status === 'COMPLETED').length,
        cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
        totalSpent: bookings
          .filter(b => b.status === 'COMPLETED')
          .reduce((sum, b) => sum + b.totalPrice, 0),
        averageRating: this.calculateAverageRating(bookings)
      };
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not get home owner stats: ' + error.message);
    }
  }

  // Helper to calculate average rating
  private calculateAverageRating(bookings: Booking[]): number {
    try {
      // Only count bookings with ratings
      const rated = bookings.filter(b => b.rating && b.rating > 0);
      if (rated.length === 0) return 0;
      
      // Add up all ratings and divide by count
      const sum = rated.reduce((total, b) => total + (b.rating || 0), 0);
      return sum / rated.length;
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not calculate average rating: ' + error.message);
    }
  }
}

export { BookingService }; 