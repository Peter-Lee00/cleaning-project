import { User, Admin, Cleaner, HomeOwner, UserRole } from '../models/User';
import { Service, ServiceCategory } from '../models/Service';
import { Booking, BookingStatus } from '../models/Booking';
import fs from 'fs';
import path from 'path';

// Helper function to generate random string
const _r = (l: number) => Array(l).fill(0).map(() => Math.random().toString(36)[2]).join('');

// Main storage handler
class StorageManager {
  private static _i: StorageManager;
  private _u = new Map<string, User>();
  private _s = new Map<string, Service>();
  private _c = new Map<string, ServiceCategory>();
  private _b = new Map<string, Booking>();
  private _p: string;

  private constructor() {
    this._p = path.join(__dirname, '../../data');
    if (!fs.existsSync(this._p)) {
      fs.mkdirSync(this._p, { recursive: true });
    }
    this._l();
  }

  public static get i(): StorageManager {
    if (!StorageManager._i) {
      StorageManager._i = new StorageManager();
    }
    return StorageManager._i;
  }

  public static getInstance(): StorageManager {
    return StorageManager.i;
  }

  private _l(): void {
    try {
      const _f = (n: string) => path.join(this._p, `${n}.json`);
      const _r = (p: string) => {
        if (fs.existsSync(p)) {
          return JSON.parse(fs.readFileSync(p, 'utf8'));
        }
        return {};
      };

      this._u = new Map(Object.entries(_r(_f('u'))));
      this._s = new Map(Object.entries(_r(_f('s'))));
      this._c = new Map(Object.entries(_r(_f('c'))));
      this._b = new Map(Object.entries(_r(_f('b'))));
    } catch (e) {
      console.error('Failed to load:', e);
    }
  }

  private _w(): void {
    try {
      const _f = (n: string, d: any) => {
        const p = path.join(this._p, `${n}.json`);
        fs.writeFileSync(p, JSON.stringify(Object.fromEntries(d), null, 2));
      };

      _f('u', this._u);
      _f('s', this._s);
      _f('c', this._c);
      _f('b', this._b);
    } catch (e) {
      console.error('Failed to save:', e);
    }
  }

  // User operations
  addUser(u: User): void {
    this._u.set(u.id, u);
    this._w();
  }

  getUserById(i: string): User | undefined {
    return this._u.get(i);
  }

  getUserByEmail(e: string): User | undefined {
    return Array.from(this._u.values()).find(u => u.email === e);
  }

  getUsersByRole(r: typeof UserRole[keyof typeof UserRole]): User[] {
    return Array.from(this._u.values()).filter(u => u.role === r);
  }

  updateUser(u: User): void {
    if (this._u.has(u.id)) {
      this._u.set(u.id, u);
      this._w();
    }
  }

  deleteUser(i: string): void {
    this._u.delete(i);
    this._w();
  }

  // Service operations
  addService(s: Service): void {
    this._s.set(s.id, s);
    this._w();
  }

  getServiceById(i: string): Service | undefined {
    return this._s.get(i);
  }

  getServicesByCategory(c: string): Service[] {
    return Array.from(this._s.values())
      .filter(s => s.category.id === c);
  }

  getAllServices(): Service[] {
    return Array.from(this._s.values());
  }

  updateService(s: Service): void {
    if (this._s.has(s.id)) {
      this._s.set(s.id, s);
      this._w();
    }
  }

  deleteService(i: string): void {
    this._s.delete(i);
    this._w();
  }

  // Category operations
  addCategory(c: ServiceCategory): void {
    this._c.set(c.id, c);
    this._w();
  }

  getCategoryById(i: string): ServiceCategory | undefined {
    return this._c.get(i);
  }

  getAllCategories(): ServiceCategory[] {
    return Array.from(this._c.values());
  }

  updateCategory(c: ServiceCategory): void {
    if (this._c.has(c.id)) {
      this._c.set(c.id, c);
      this._w();
    }
  }

  deleteCategory(i: string): void {
    this._c.delete(i);
    this._w();
  }

  // Booking operations
  addBooking(b: Booking): void {
    this._b.set(b.id, b);
    this._w();
  }

  getBookingById(i: string): Booking | undefined {
    return this._b.get(i);
  }

  getBookingsByCleaner(c: string): Booking[] {
    return Array.from(this._b.values())
      .filter(b => b.cleanerId === c);
  }

  getBookingsByHomeOwner(h: string): Booking[] {
    return Array.from(this._b.values())
      .filter(b => b.homeOwnerId === h);
  }

  getBookingsByStatus(s: typeof BookingStatus[keyof typeof BookingStatus]): Booking[] {
    return Array.from(this._b.values())
      .filter(b => b.status === s);
  }

  getAllBookings(): Booking[] {
    return Array.from(this._b.values());
  }

  updateBooking(b: Booking): void {
    if (this._b.has(b.id)) {
      this._b.set(b.id, b);
      this._w();
    }
  }

  deleteBooking(i: string): void {
    this._b.delete(i);
    this._w();
  }
}

// Export with a different name
export { StorageManager as DataStore }; 