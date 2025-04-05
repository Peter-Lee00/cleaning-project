import { User, Admin, Cleaner, HomeOwner, UserRole } from '../models/User';
import { Service, ServiceCategory } from '../models/Service';
import { Booking, BookingStatus } from '../models/Booking';

// Simple in-memory database
class DataStore {
  // Store our data
  private static instance: DataStore;
  private users = new Map<string, User>();
  private services = new Map<string, Service>();
  private categories = new Map<string, ServiceCategory>();
  private bookings = new Map<string, Booking>();

  // Make it a singleton
  private constructor() {}

  static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  // User methods
  addUser(user: User): void {
    this.users.set(user.id, user);
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  getUsersByRole(role: typeof UserRole[keyof typeof UserRole]): User[] {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  updateUser(user: User): void {
    if (this.users.has(user.id)) {
      this.users.set(user.id, user);
    }
  }

  deleteUser(id: string): void {
    this.users.delete(id);
  }

  // Service methods
  addService(service: Service): void {
    this.services.set(service.id, service);
  }

  getServiceById(id: string): Service | undefined {
    return this.services.get(id);
  }

  getServicesByCategory(categoryId: string): Service[] {
    return Array.from(this.services.values())
      .filter(service => service.category.id === categoryId);
  }

  getAllServices(): Service[] {
    return Array.from(this.services.values());
  }

  updateService(service: Service): void {
    if (this.services.has(service.id)) {
      this.services.set(service.id, service);
    }
  }

  deleteService(id: string): void {
    this.services.delete(id);
  }

  // Category methods
  addCategory(category: ServiceCategory): void {
    this.categories.set(category.id, category);
  }

  getCategoryById(id: string): ServiceCategory | undefined {
    return this.categories.get(id);
  }

  getAllCategories(): ServiceCategory[] {
    return Array.from(this.categories.values());
  }

  updateCategory(category: ServiceCategory): void {
    if (this.categories.has(category.id)) {
      this.categories.set(category.id, category);
    }
  }

  deleteCategory(id: string): void {
    this.categories.delete(id);
  }

  // Booking methods
  addBooking(booking: Booking): void {
    this.bookings.set(booking.id, booking);
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.get(id);
  }

  getBookingsByCleaner(cleanerId: string): Booking[] {
    return Array.from(this.bookings.values())
      .filter(booking => booking.cleanerId === cleanerId);
  }

  getBookingsByHomeOwner(homeOwnerId: string): Booking[] {
    return Array.from(this.bookings.values())
      .filter(booking => booking.homeOwnerId === homeOwnerId);
  }

  getBookingsByStatus(status: typeof BookingStatus[keyof typeof BookingStatus]): Booking[] {
    return Array.from(this.bookings.values())
      .filter(booking => booking.status === status);
  }

  getAllBookings(): Booking[] {
    return Array.from(this.bookings.values());
  }

  updateBooking(booking: Booking): void {
    if (this.bookings.has(booking.id)) {
      this.bookings.set(booking.id, booking);
    }
  }

  deleteBooking(id: string): void {
    this.bookings.delete(id);
  }
}

// Let other files use this
export { DataStore }; 