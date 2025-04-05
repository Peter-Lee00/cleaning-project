import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';

// Different types of users
const UserRole = {
  ADMIN: 'ADMIN',           // can manage everything
  CLEANER: 'CLEANER',      // provides cleaning services
  HOME_OWNER: 'HOME_OWNER' // needs cleaning services
} as const;

// Helper type for TypeScript
type UserRoleType = typeof UserRole[keyof typeof UserRole];

// Basic user class that others will extend
class User {
  id: string;           // random ID for user
  email: string;        // user's email
  password: string;     // user's password (hashed)
  name: string;         // user's full name
  role: UserRoleType;   // type of user
  phone?: string;       // user's phone number
  address?: string;     // user's address
  createdAt: Date;      // when account was created
  updatedAt: Date;      // when account was updated

  // Make a new user
  constructor(
    email: string,
    password: string,
    name: string,
    role: UserRoleType,
    phone?: string,
    address?: string
  ) {
    this.id = uuid();
    this.email = email;
    this.password = password;
    this.name = name;
    this.role = role;
    this.phone = phone;
    this.address = address;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Update user's basic info
  updateProfile(
    name?: string,
    phone?: string,
    address?: string
  ) {
    // Only update what's provided
    if (name) this.name = name;
    if (phone) this.phone = phone;
    if (address) this.address = address;
    
    // Mark as updated
    this.updatedAt = new Date();
  }

  // Change user's password
  updatePassword(newPassword: string) {
    this.password = newPassword;
    this.updatedAt = new Date();
  }

  // hash password before saving
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // check if password matches
  async comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }

  getFullName() {
    return this.name;
  }
}

// Special admin user
class Admin extends User {
  constructor(
    email: string,
    password: string,
    name: string,
    phone?: string,
    address?: string
  ) {
    super(email, password, name, UserRole.ADMIN, phone, address);
  }
}

// Cleaner user with extra cleaning info
class Cleaner extends User {
  bio?: string;              // about the cleaner
  hourlyRate?: number;       // how much they charge
  availability?: string[];   // when they can work
  rating?: number;           // average rating
  totalBookings: number;     // how many jobs done
  completedBookings: number; // how many jobs finished

  constructor(
    email: string,
    password: string,
    name: string,
    phone?: string,
    address?: string
  ) {
    super(email, password, name, UserRole.CLEANER, phone, address);
    this.totalBookings = 0;
    this.completedBookings = 0;
  }

  // Update cleaner's special info
  updateCleanerProfile(
    bio?: string,
    hourlyRate?: number,
    availability?: string[]
  ) {
    if (bio) this.bio = bio;
    if (hourlyRate) this.hourlyRate = hourlyRate;
    if (availability) this.availability = availability;
    this.updatedAt = new Date();
  }

  // Add a new booking
  addBooking(completed: boolean = false) {
    this.totalBookings++;
    if (completed) this.completedBookings++;
  }
}

// Home owner user with preferences
class HomeOwner extends User {
  preferences?: string[];     // cleaning preferences
  favoriteCleaners?: string[]; // preferred cleaners

  constructor(
    email: string,
    password: string,
    name: string,
    phone?: string,
    address?: string
  ) {
    super(email, password, name, UserRole.HOME_OWNER, phone, address);
    this.favoriteCleaners = [];
  }

  // Update home owner's preferences
  updatePreferences(preferences: string[]) {
    this.preferences = preferences;
    this.updatedAt = new Date();
  }

  // Add a cleaner to favorites
  addFavoriteCleaner(cleanerId: string) {
    if (!this.favoriteCleaners) {
      this.favoriteCleaners = [];
    }
    if (!this.favoriteCleaners.includes(cleanerId)) {
      this.favoriteCleaners.push(cleanerId);
    }
  }

  // Remove a cleaner from favorites
  removeFavoriteCleaner(cleanerId: string) {
    if (this.favoriteCleaners) {
      this.favoriteCleaners = this.favoriteCleaners.filter(id => id !== cleanerId);
    }
  }
}

// Make these available to other files
export { User, Admin, Cleaner, HomeOwner, UserRole }; 