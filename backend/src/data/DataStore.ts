import { User, Admin, Cleaner, HomeOwner, UserRole } from '../models/User';
import { Service, ServiceCategory } from '../models/Service';
import { Booking, BookingStatus } from '../models/Booking';

export class DataStore {
  private static instance: DataStore;
  private users: Map<string, User>;
  private services: Map<string, Service>;
  private categories: Map<string, ServiceCategory>;
  private bookings: Map<string, Booking>;

  private constructor() {
    this.users = new Map();
    this.services = new Map();
    this.categories = new Map();
    this.bookings = new Map();
  }

  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  // User Management
  public addUser(user: User): void {
    this.users.set(user.id, user);
  }

  public getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  public getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  public getUsersByRole(role: UserRole): User[] {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  public updateUser(user: User): void {
    if (this.users.has(user.id)) {
      this.users.set(user.id, user);
    }
  }

  public deleteUser(id: string): void {
    this.users.delete(id);
  }

  // Service Management
  public addService(service: Service): void {
    this.services.set(service.id, service);
  }

  public getServiceById(id: string): Service | undefined {
    return this.services.get(id);
  }

  public getServicesByCategory(category: string): Service[] {
    return Array.from(this.services.values()).filter(service => service.category === category);
  }

  public updateService(service: Service): void {
    if (this.services.has(service.id)) {
      this.services.set(service.id, service);
    }
  }

  public deleteService(id: string): void {
    this.services.delete(id);
  }

  public getAllServices(): Service[] {
    return Array.from(this.services.values());
  }

  // Category Management
  public addCategory(category: ServiceCategory): void {
    this.categories.set(category.id, category);
  }

  public getCategoryById(id: string): ServiceCategory | undefined {
    return this.categories.get(id);
  }

  public getAllCategories(): ServiceCategory[] {
    return Array.from(this.categories.values());
  }

  public updateCategory(category: ServiceCategory): void {
    if (this.categories.has(category.id)) {
      this.categories.set(category.id, category);
    }
  }

  public deleteCategory(id: string): void {
    this.categories.delete(id);
  }

  // Booking Management
  public addBooking(booking: Booking): void {
    this.bookings.set(booking.id, booking);
  }

  public getBookingById(id: string): Booking | undefined {
    return this.bookings.get(id);
  }

  public getBookingsByCleaner(cleanerId: string): Booking[] {
    return Array.from(this.bookings.values()).filter(booking => booking.cleanerId === cleanerId);
  }

  public getBookingsByHomeOwner(homeOwnerId: string): Booking[] {
    return Array.from(this.bookings.values()).filter(booking => booking.homeOwnerId === homeOwnerId);
  }

  public getBookingsByStatus(status: BookingStatus): Booking[] {
    return Array.from(this.bookings.values()).filter(booking => booking.status === status);
  }

  public updateBooking(booking: Booking): void {
    if (this.bookings.has(booking.id)) {
      this.bookings.set(booking.id, booking);
    }
  }

  public deleteBooking(id: string): void {
    this.bookings.delete(id);
  }

  public getAllBookings(): Booking[] {
    return Array.from(this.bookings.values());
  }

  // Analytics
  public getCleanerStats(cleanerId: string): {
    totalBookings: number;
    completedBookings: number;
    averageRating: number;
    totalEarnings: number;
  } {
    const cleanerBookings = this.getBookingsByCleaner(cleanerId);
    const completedBookings = cleanerBookings.filter(b => b.status === BookingStatus.COMPLETED);
    const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const averageRating = completedBookings.reduce((sum, b) => sum + (b.rating || 0), 0) / 
      (completedBookings.filter(b => b.rating).length || 1);

    return {
      totalBookings: cleanerBookings.length,
      completedBookings: completedBookings.length,
      averageRating,
      totalEarnings
    };
  }

  public getHomeOwnerStats(homeOwnerId: string): {
    totalBookings: number;
    completedBookings: number;
    totalSpent: number;
  } {
    const homeOwnerBookings = this.getBookingsByHomeOwner(homeOwnerId);
    const completedBookings = homeOwnerBookings.filter(b => b.status === BookingStatus.COMPLETED);
    const totalSpent = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    return {
      totalBookings: homeOwnerBookings.length,
      completedBookings: completedBookings.length,
      totalSpent
    };
  }
} 