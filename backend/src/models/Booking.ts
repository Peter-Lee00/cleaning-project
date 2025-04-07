// Import UUID to generate random IDs
import { v4 as uuid } from 'uuid';

// List of possible booking statuses
const BookingStatus = {
  PENDING: 'PENDING',     // when booking is first created
  CONFIRMED: 'CONFIRMED', // when both parties accept
  COMPLETED: 'COMPLETED', // when service is done
  CANCELLED: 'CANCELLED'  // when booking is cancelled
} as const;

// Helper type for TypeScript
type BookingStatusType = typeof BookingStatus[keyof typeof BookingStatus];

/**
 * Interface defining the structure of a booking
 * This ensures type safety and consistency across the application
 */
export interface IBooking {
  id: string;                    // Unique identifier for the booking
  cleanerId: string;            // ID of the cleaner providing the service
  homeOwnerId: string;          // ID of the home owner receiving the service
  serviceId: string;            // ID of the service being booked
  status: BookingStatusType;    // Current status of the booking
  scheduledDate: Date;          // When the service is scheduled
  duration: number;             // Duration in minutes
  totalPrice: number;           // Total price for the service
  notes?: string;               // Optional notes about the booking
  rating?: number;              // Optional rating (1-5) after completion
  review?: string;              // Optional review text after completion
  createdAt: Date;              // When the booking was created
  updatedAt: Date;              // When the booking was last updated
}

// Main booking class
class Booking implements IBooking {
  // Basic booking info
  public readonly id: string;
  public cleanerId: string;
  public homeOwnerId: string;
  public serviceId: string;
  public status: BookingStatusType;
  public scheduledDate: Date;
  public duration: number;
  public totalPrice: number;
  public notes?: string;
  public rating?: number;
  public review?: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  // Make a new booking
  constructor(
    cleanerId: string,    // who will clean
    homeOwnerId: string,  // who needs cleaning
    serviceId: string,    // what type of cleaning
    scheduledDate: Date,  // when to clean
    duration: number,     // how long it takes
    totalPrice: number,   // how much it costs
    notes?: string        // extra info
  ) {
    // Set all the basic info
    this.id = uuid();
    this.cleanerId = cleanerId;
    this.homeOwnerId = homeOwnerId;
    this.serviceId = serviceId;
    this.status = BookingStatus.PENDING;
    this.scheduledDate = scheduledDate;
    this.duration = duration;
    this.totalPrice = totalPrice;
    this.notes = notes;
    
    // Set when it was created
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Change the booking status
  public setStatus(newStatus: BookingStatusType) {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  // Add a review after cleaning
  public addReview(rating: number, review: string) {
    // Can only review if cleaning is done
    if (this.status !== BookingStatus.COMPLETED) {
      throw new Error('Can only review completed bookings');
    }
    
    // Save the review
    this.rating = rating;
    this.review = review;
    this.updatedAt = new Date();
  }

  // Change the cleaning date
  public updateScheduledDate(newDate: Date) {
    // Can only change date if not started
    if (this.status === BookingStatus.PENDING) {
      this.scheduledDate = newDate;
      this.updatedAt = new Date();
    }
  }

  // Change the extra notes
  public updateNotes(newNotes: string) {
    this.notes = newNotes;
    this.updatedAt = new Date();
  }
}

// Make these available to other files
export { Booking, BookingStatus }; 