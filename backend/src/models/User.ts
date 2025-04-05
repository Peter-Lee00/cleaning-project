import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'ADMIN',
  CLEANER = 'CLEANER',
  HOME_OWNER = 'HOME_OWNER'
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class User implements IUser {
  public readonly id: string;
  public email: string;
  public password: string;
  public firstName: string;
  public lastName: string;
  public readonly role: UserRole;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: UserRole
  ) {
    this.id = uuidv4();
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export class Admin extends User {
  constructor(email: string, password: string, firstName: string, lastName: string) {
    super(email, password, firstName, lastName, UserRole.ADMIN);
  }
}

export class Cleaner extends User {
  public services: string[];
  public hourlyRate: number;
  public availability: boolean;
  public rating: number;
  public totalJobs: number;
  public views: number;
  public shortlists: number;

  constructor(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    hourlyRate: number
  ) {
    super(email, password, firstName, lastName, UserRole.CLEANER);
    this.services = [];
    this.hourlyRate = hourlyRate;
    this.availability = true;
    this.rating = 0;
    this.totalJobs = 0;
    this.views = 0;
    this.shortlists = 0;
  }

  public addService(service: string): void {
    if (!this.services.includes(service)) {
      this.services.push(service);
    }
  }

  public removeService(service: string): void {
    this.services = this.services.filter(s => s !== service);
  }

  public updateAvailability(available: boolean): void {
    this.availability = available;
  }

  public incrementViews(): void {
    this.views++;
  }

  public incrementShortlists(): void {
    this.shortlists++;
  }
}

export class HomeOwner extends User {
  public shortlistedCleaners: string[];
  public bookingHistory: string[];

  constructor(email: string, password: string, firstName: string, lastName: string) {
    super(email, password, firstName, lastName, UserRole.HOME_OWNER);
    this.shortlistedCleaners = [];
    this.bookingHistory = [];
  }

  public shortlistCleaner(cleanerId: string): void {
    if (!this.shortlistedCleaners.includes(cleanerId)) {
      this.shortlistedCleaners.push(cleanerId);
    }
  }

  public removeFromShortlist(cleanerId: string): void {
    this.shortlistedCleaners = this.shortlistedCleaners.filter(id => id !== cleanerId);
  }

  public addToBookingHistory(bookingId: string): void {
    this.bookingHistory.push(bookingId);
  }
} 