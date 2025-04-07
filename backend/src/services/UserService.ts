import { User, Admin, Cleaner, HomeOwner, UserRole } from '../models/User';
import { DataStore } from '../data/DataStore';

// Map our simple roles to UserRole enum
const roleMap = {
  'admin': UserRole.ADMIN,
  'cleaner': UserRole.CLEANER,
  'homeowner': UserRole.HOME_OWNER
} as const;

// List of roles we allow
const validRoles = ['admin', 'cleaner', 'homeowner'] as const;
type ValidRole = typeof validRoles[number];

// Handle all user-related stuff
class UserService {
  // Store all our data
  private db: DataStore;

  // Set up the service
  constructor() {
    this.db = DataStore.getInstance();
  }

  // Make a new user
  register(
    email: string,
    password: string,
    name: string,
    role: ValidRole
  ): User {
    try {
      // Check if email exists
      if (this.db.getUserByEmail(email)) {
        throw new Error('Email already exists');
      }

      // Make the right type of user
      let user: User;
      if (role === 'admin') {
        user = new Admin(email, password, name);
      } else if (role === 'cleaner') {
        user = new Cleaner(email, password, name);
      } else {
        user = new HomeOwner(email, password, name);
      }

      // Save and return
      this.db.addUser(user);
      return user;
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not register user: ' + error.message);
    }
  }

  // Log in a user
  login(email: string, password: string): User {
    try {
      const user = this.db.getUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      if (user.password !== password) {
        throw new Error('Wrong password');
      }
      return user;
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not log in: ' + error.message);
    }
  }

  // Get a user by their ID
  getUserById(id: string): User {
    try {
      const user = this.db.getUserById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not get user: ' + error.message);
    }
  }

  // Update a user's info
  updateProfile(
    id: string,
    updates: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
    }
  ): User {
    try {
      const user = this.getUserById(id);

      // Check if new email exists
      if (updates.email && updates.email !== user.email) {
        if (this.db.getUserByEmail(updates.email)) {
          throw new Error('Email already exists');
        }
      }

      // Update the info
      if (updates.name) user.name = updates.name;
      if (updates.email) user.email = updates.email;
      if (updates.phone) user.phone = updates.phone;
      if (updates.address) user.address = updates.address;

      return user;
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not update profile: ' + error.message);
    }
  }

  // Change a user's password
  changePassword(id: string, oldPassword: string, newPassword: string): void {
    try {
      const user = this.getUserById(id);
      if (user.password !== oldPassword) {
        throw new Error('Wrong password');
      }
      user.password = newPassword;
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not change password: ' + error.message);
    }
  }

  // Delete a user
  deleteUser(id: string): void {
    try {
      const user = this.getUserById(id);
      this.db.deleteUser(user.id);
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not delete user: ' + error.message);
    }
  }

  // Get users by their role
  getUsersByRole(role: ValidRole): User[] {
    try {
      // Convert our simple role to UserRole enum
      const userRole = roleMap[role];
      // Get users by role from database
      return this.db.getUsersByRole(userRole);
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not get users by role: ' + error.message);
    }
  }

  // Get all users
  getAllUsers(): User[] {
    try {
      // Get all users for each role
      const users = Object.values(roleMap).flatMap(role => 
        this.db.getUsersByRole(role)
      );
      return users;
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not get all users: ' + error.message);
    }
  }
}

// Let other files use this
export { UserService, validRoles }; 