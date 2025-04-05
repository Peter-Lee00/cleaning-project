import { Booking, BookingStatus } from '../models/Booking';
import { DataStore } from '../data/DataStore';
import { UserService } from './UserService';
import { ServiceService } from './ServiceService';
import { UserRole } from '../models/User';

/**
 * Service class handling all booking-related operations
 * This includes creation, updates, queries, and analytics
 */
export class BookingService {
  private dataStore: DataStore;
  private userService: UserService;
  private serviceService: ServiceService;

  constructor() {
    this.dataStore = DataStore.getInstance();
    this.userService = new UserService();
    this.serviceService = new ServiceService();
  }

  /**
   * Creates a new booking
   * Validates the cleaner, home owner, and service before creating
   * @param cleanerId - ID of the cleaner
   * @param homeOwnerId - ID of the home owner
   * @param serviceId - ID of the service
   * @param scheduledDate - When the service is scheduled
   * @param duration - Duration in minutes
   * @param notes - Optional notes about the booking
   * @returns The created booking
   */
  public createBooking(
    cleanerId: string,
    homeOwnerId: string,
    serviceId: string,
    scheduledDate: Date,
    duration: number,
    notes?: string
  ): Booking {
    // Validate cleaner exists and is a cleaner
    const cleaner = this.userService.getUserById(cleanerId);
    if (!cleaner || cleaner.role !== UserRole.CLEANER) {
      throw new Error('Invalid cleaner');
    }

    // Validate home owner exists and is a home owner
    const homeOwner = this.userService.getUserById(homeOwnerId);
    if (!homeOwner || homeOwner.role !== UserRole.HOME_OWNER) {
      throw new Error('Invalid home owner');
    }

    // Validate service exists and calculate total price
    const service = this.serviceService.getServiceById(serviceId);
    const totalPrice = service.basePrice * (duration / 60); // Convert duration to hours

    // Create and save the booking
    const booking = new Booking(
      cleanerId,
      homeOwnerId,
      serviceId,
      scheduledDate,
      duration,
      totalPrice,
      notes
    );

    this.dataStore.addBooking(booking);
    return booking;
  }

  /**
   * Retrieves a booking by its ID
   * @param id - Booking ID
   * @returns The booking
   * @throws Error if booking not found
   */
  public getBookingById(id: string): Booking {
    const booking = this.dataStore.getBookingById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  }

  /**
   * Updates the status of a booking
   * Handles state transitions (PENDING -> CONFIRMED -> COMPLETED)
   * @param id - Booking ID
   * @param status - New status
   * @returns Updated booking
   */
  public updateBookingStatus(id: string, status: BookingStatus): Booking {
    const booking = this.getBookingById(id);

    switch (status) {
      case BookingStatus.PENDING:
        // No action needed, this is the default state
        break;
      case BookingStatus.CONFIRMED:
        booking.confirm();
        break;
      case BookingStatus.COMPLETED:
        booking.complete();
        break;
      case BookingStatus.CANCELLED:
        booking.cancel();
        break;
      default:
        throw new Error('Invalid booking status');
    }

    this.dataStore.updateBooking(booking);
    return booking;
  }

  /**
   * Updates the scheduled date of a booking
   * @param id - Booking ID
   * @param newDate - New scheduled date
   * @returns Updated booking
   */
  public updateBookingSchedule(id: string, newDate: Date): Booking {
    const booking = this.getBookingById(id);
    booking.updateScheduledDate(newDate);
    this.dataStore.updateBooking(booking);
    return booking;
  }

  /**
   * Updates the notes of a booking
   * @param id - Booking ID
   * @param notes - New notes
   * @returns Updated booking
   */
  public updateBookingNotes(id: string, notes: string): Booking {
    const booking = this.getBookingById(id);
    booking.updateNotes(notes);
    this.dataStore.updateBooking(booking);
    return booking;
  }

  /**
   * Adds a review to a completed booking
   * @param id - Booking ID
   * @param rating - Rating from 1-5
   * @param review - Review text
   * @returns Updated booking
   */
  public addReview(id: string, rating: number, review: string): Booking {
    const booking = this.getBookingById(id);
    booking.addReview(rating, review);
    this.dataStore.updateBooking(booking);
    return booking;
  }

  /**
   * Retrieves all bookings for a cleaner
   * @param cleanerId - Cleaner ID
   * @returns Array of bookings
   */
  public getBookingsByCleaner(cleanerId: string): Booking[] {
    return this.dataStore.getBookingsByCleaner(cleanerId);
  }

  /**
   * Retrieves all bookings for a home owner
   * @param homeOwnerId - Home owner ID
   * @returns Array of bookings
   */
  public getBookingsByHomeOwner(homeOwnerId: string): Booking[] {
    return this.dataStore.getBookingsByHomeOwner(homeOwnerId);
  }

  /**
   * Retrieves all bookings with a specific status
   * @param status - Booking status
   * @returns Array of bookings
   */
  public getBookingsByStatus(status: BookingStatus): Booking[] {
    return this.dataStore.getBookingsByStatus(status);
  }

  /**
   * Generates analytics for a cleaner
   * @param cleanerId - Cleaner ID
   * @param startDate - Start of date range
   * @param endDate - End of date range
   * @returns Analytics data
   */
  public getCleanerAnalytics(cleanerId: string, startDate: Date, endDate: Date) {
    const bookings = this.getBookingsByCleaner(cleanerId)
      .filter(booking => 
        booking.scheduledDate >= startDate && 
        booking.scheduledDate <= endDate
      );

    const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED);
    const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const averageRating = completedBookings.reduce((sum, b) => sum + (b.rating || 0), 0) / 
      (completedBookings.filter(b => b.rating).length || 1);

    return {
      totalBookings: bookings.length,
      completedBookings: completedBookings.length,
      cancelledBookings: bookings.filter(b => b.status === BookingStatus.CANCELLED).length,
      totalEarnings,
      averageRating,
      bookingsByStatus: {
        pending: bookings.filter(b => b.status === BookingStatus.PENDING).length,
        confirmed: bookings.filter(b => b.status === BookingStatus.CONFIRMED).length,
        completed: completedBookings.length,
        cancelled: bookings.filter(b => b.status === BookingStatus.CANCELLED).length
      }
    };
  }

  /**
   * Generates analytics for a home owner
   * @param homeOwnerId - Home owner ID
   * @param startDate - Start of date range
   * @param endDate - End of date range
   * @returns Analytics data
   */
  public getHomeOwnerAnalytics(homeOwnerId: string, startDate: Date, endDate: Date) {
    const bookings = this.getBookingsByHomeOwner(homeOwnerId)
      .filter(booking => 
        booking.scheduledDate >= startDate && 
        booking.scheduledDate <= endDate
      );

    const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED);
    const totalSpent = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    return {
      totalBookings: bookings.length,
      completedBookings: completedBookings.length,
      cancelledBookings: bookings.filter(b => b.status === BookingStatus.CANCELLED).length,
      totalSpent,
      bookingsByStatus: {
        pending: bookings.filter(b => b.status === BookingStatus.PENDING).length,
        confirmed: bookings.filter(b => b.status === BookingStatus.CONFIRMED).length,
        completed: completedBookings.length,
        cancelled: bookings.filter(b => b.status === BookingStatus.CANCELLED).length
      }
    };
  }

  /**
   * Generates platform-wide analytics
   * @param startDate - Start of date range
   * @param endDate - End of date range
   * @returns Analytics data
   */
  public getPlatformAnalytics(startDate: Date, endDate: Date) {
    const allBookings = Array.from(this.dataStore.getBookingsByStatus(BookingStatus.PENDING))
      .concat(this.dataStore.getBookingsByStatus(BookingStatus.CONFIRMED))
      .concat(this.dataStore.getBookingsByStatus(BookingStatus.COMPLETED))
      .concat(this.dataStore.getBookingsByStatus(BookingStatus.CANCELLED))
      .filter(booking => 
        booking.scheduledDate >= startDate && 
        booking.scheduledDate <= endDate
      );

    const completedBookings = allBookings.filter(b => b.status === BookingStatus.COMPLETED);
    const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    return {
      totalBookings: allBookings.length,
      completedBookings: completedBookings.length,
      cancelledBookings: allBookings.filter(b => b.status === BookingStatus.CANCELLED).length,
      totalRevenue,
      averageBookingValue: totalRevenue / (completedBookings.length || 1),
      bookingsByStatus: {
        pending: allBookings.filter(b => b.status === BookingStatus.PENDING).length,
        confirmed: allBookings.filter(b => b.status === BookingStatus.CONFIRMED).length,
        completed: completedBookings.length,
        cancelled: allBookings.filter(b => b.status === BookingStatus.CANCELLED).length
      }
    };
  }

  // Get all bookings
  public getAllBookings(): Booking[] {
    return Array.from(this.dataStore.getAllBookings());
  }
} 