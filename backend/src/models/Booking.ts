import { v4 as uuidv4 } from 'uuid';

/**
 * Enum representing the possible states of a booking
 * - PENDING: Initial state when booking is created
 * - CONFIRMED: Booking has been accepted by both parties
 * - COMPLETED: Service has been provided and completed
 * - CANCELLED: Booking has been cancelled by either party
 */
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

/**
 * Interface defining the structure of a booking
 * This ensures type safety and consistency across the application
 */
export interface IBooking {
  id: string;                    // Unique identifier for the booking
  cleanerId: string;            // ID of the cleaner providing the service
  homeOwnerId: string;          // ID of the home owner receiving the service
  serviceId: string;            // ID of the service being booked
  status: BookingStatus;        // Current status of the booking
  scheduledDate: Date;          // When the service is scheduled
  duration: number;             // Duration in minutes
  totalPrice: number;           // Total price for the service
  notes?: string;               // Optional notes about the booking
  rating?: number;              // Optional rating (1-5) after completion
  review?: string;              // Optional review text after completion
  createdAt: Date;              // When the booking was created
  updatedAt: Date;              // When the booking was last updated
}

/**
 * Booking class implementing the IBooking interface
 * Handles the business logic for booking management
 */
export class Booking implements IBooking {
  public readonly id: string;
  public cleanerId: string;
  public homeOwnerId: string;
  public serviceId: string;
  public status: BookingStatus;
  public scheduledDate: Date;
  public duration: number;
  public totalPrice: number;
  public notes?: string;
  public rating?: number;
  public review?: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  /**
   * Creates a new booking
   * @param cleanerId - ID of the cleaner
   * @param homeOwnerId - ID of the home owner
   * @param serviceId - ID of the service
   * @param scheduledDate - When the service is scheduled
   * @param duration - Duration in minutes
   * @param totalPrice - Total price for the service
   * @param notes - Optional notes about the booking
   */
  constructor(
    cleanerId: string,
    homeOwnerId: string,
    serviceId: string,
    scheduledDate: Date,
    duration: number,
    totalPrice: number,
    notes?: string
  ) {
    this.id = uuidv4();                    // Generate unique ID
    this.cleanerId = cleanerId;
    this.homeOwnerId = homeOwnerId;
    this.serviceId = serviceId;
    this.status = BookingStatus.PENDING;   // Set initial status
    this.scheduledDate = scheduledDate;
    this.duration = duration;
    this.totalPrice = totalPrice;
    this.notes = notes;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Confirms the booking
   * Only possible if booking is in PENDING state
   */
  public confirm(): void {
    if (this.status === BookingStatus.PENDING) {
      this.status = BookingStatus.CONFIRMED;
      this.updatedAt = new Date();
    }
  }

  /**
   * Marks the booking as completed
   * Only possible if booking is in CONFIRMED state
   */
  public complete(): void {
    if (this.status === BookingStatus.CONFIRMED) {
      this.status = BookingStatus.COMPLETED;
      this.updatedAt = new Date();
    }
  }

  /**
   * Cancels the booking
   * Not possible if booking is already COMPLETED
   */
  public cancel(): void {
    if (this.status !== BookingStatus.COMPLETED) {
      this.status = BookingStatus.CANCELLED;
      this.updatedAt = new Date();
    }
  }

  /**
   * Adds a review to the booking
   * Only possible if booking is COMPLETED
   * @param rating - Rating from 1-5
   * @param review - Review text
   */
  public addReview(rating: number, review: string): void {
    if (this.status === BookingStatus.COMPLETED) {
      this.rating = rating;
      this.review = review;
      this.updatedAt = new Date();
    }
  }

  /**
   * Updates the scheduled date
   * Only possible if booking is in PENDING state
   * @param newDate - New scheduled date
   */
  public updateScheduledDate(newDate: Date): void {
    if (this.status === BookingStatus.PENDING) {
      this.scheduledDate = newDate;
      this.updatedAt = new Date();
    }
  }

  /**
   * Updates the booking notes
   * @param notes - New notes
   */
  public updateNotes(notes: string): void {
    this.notes = notes;
    this.updatedAt = new Date();
  }
} 