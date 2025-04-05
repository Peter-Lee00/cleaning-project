import { User, Admin, Cleaner, HomeOwner, UserRole } from '../models/User';
import { DataStore } from '../data/DataStore';

export class UserService {
  private dataStore: DataStore;

  constructor() {
    this.dataStore = DataStore.getInstance();
  }

  // User Retrieval
  public getUserById(id: string): User {
    const user = this.dataStore.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // User Registration
  public async registerUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: UserRole,
    hourlyRate?: number
  ): Promise<User> {
    // Check if user already exists
    const existingUser = this.dataStore.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create user based on role
    let user: User;
    switch (role) {
      case UserRole.ADMIN:
        user = new Admin(email, password, firstName, lastName);
        break;
      case UserRole.CLEANER:
        if (hourlyRate === undefined) {
          throw new Error('Hourly rate is required for cleaners');
        }
        user = new Cleaner(email, password, firstName, lastName, hourlyRate);
        break;
      case UserRole.HOME_OWNER:
        user = new HomeOwner(email, password, firstName, lastName);
        break;
      default:
        throw new Error('Invalid user role');
    }

    // Hash password and save user
    await user.hashPassword();
    this.dataStore.addUser(user);
    return user;
  }

  // User Authentication
  public async login(email: string, password: string): Promise<User> {
    const user = this.dataStore.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    return user;
  }

  // User Profile Management
  public updateUserProfile(
    userId: string,
    updates: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
    }
  ): User {
    const user = this.dataStore.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (updates.firstName) user.firstName = updates.firstName;
    if (updates.lastName) user.lastName = updates.lastName;
    if (updates.email) {
      const existingUser = this.dataStore.getUserByEmail(updates.email);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Email already in use');
      }
      user.email = updates.email;
    }

    this.dataStore.updateUser(user);
    return user;
  }

  // Cleaner-specific operations
  public updateCleanerServices(cleanerId: string, services: string[]): Cleaner {
    const user = this.dataStore.getUserById(cleanerId);
    if (!user || user.role !== UserRole.CLEANER) {
      throw new Error('Cleaner not found');
    }

    const cleaner = user as Cleaner;
    cleaner.services = services;
    this.dataStore.updateUser(cleaner);
    return cleaner;
  }

  public updateCleanerAvailability(cleanerId: string, available: boolean): Cleaner {
    const user = this.dataStore.getUserById(cleanerId);
    if (!user || user.role !== UserRole.CLEANER) {
      throw new Error('Cleaner not found');
    }

    const cleaner = user as Cleaner;
    cleaner.updateAvailability(available);
    this.dataStore.updateUser(cleaner);
    return cleaner;
  }

  // Home Owner-specific operations
  public shortlistCleaner(homeOwnerId: string, cleanerId: string): void {
    const homeOwner = this.dataStore.getUserById(homeOwnerId);
    if (!homeOwner || homeOwner.role !== UserRole.HOME_OWNER) {
      throw new Error('Home owner not found');
    }

    const cleaner = this.dataStore.getUserById(cleanerId);
    if (!cleaner || cleaner.role !== UserRole.CLEANER) {
      throw new Error('Cleaner not found');
    }

    const owner = homeOwner as HomeOwner;
    owner.shortlistCleaner(cleanerId);
    this.dataStore.updateUser(owner);

    // Update cleaner stats
    const cleanerObj = cleaner as Cleaner;
    cleanerObj.incrementShortlists();
    this.dataStore.updateUser(cleanerObj);
  }

  public removeFromShortlist(homeOwnerId: string, cleanerId: string): void {
    const homeOwner = this.dataStore.getUserById(homeOwnerId);
    if (!homeOwner || homeOwner.role !== UserRole.HOME_OWNER) {
      throw new Error('Home owner not found');
    }

    const owner = homeOwner as HomeOwner;
    owner.removeFromShortlist(cleanerId);
    this.dataStore.updateUser(owner);
  }

  // Admin operations
  public getAllUsers(): User[] {
    return Array.from(this.dataStore.getUsersByRole(UserRole.ADMIN))
      .concat(this.dataStore.getUsersByRole(UserRole.CLEANER))
      .concat(this.dataStore.getUsersByRole(UserRole.HOME_OWNER));
  }

  public deleteUser(userId: string): void {
    const user = this.dataStore.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    this.dataStore.deleteUser(userId);
  }
} 