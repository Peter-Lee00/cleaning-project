import { UserRole, User, Cleaner, HomeOwner } from '../models/User';
import { UserService } from '../services/UserService';
import { ServiceService } from '../services/ServiceService';
import { BookingService } from '../services/BookingService';
import { BookingStatus } from '../models/Booking';

// Initialize services
const userService = new UserService();
const serviceService = new ServiceService();
const bookingService = new BookingService();

/**
 * Helper function to generate a random date within a given range
 * @param start - Start date
 * @param end - End date
 * @returns Random date between start and end
 */
function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Helper function to generate a random number within a given range
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns Random number between min and max
 */
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Main function to generate test data for the application
 * Creates:
 * 1. Service categories and services
 * 2. Cleaners and home owners
 * 3. Bookings with various statuses
 * 4. Reviews for completed bookings
 */
async function generateTestData() {
  console.log('Generating test data...');

  // Step 1: Generate service categories
  const categories = [
    { name: 'Regular Cleaning', description: 'Standard home cleaning services' },
    { name: 'Deep Cleaning', description: 'Thorough deep cleaning services' },
    { name: 'Move In/Out Cleaning', description: 'Specialized cleaning for moving' },
    { name: 'Window Cleaning', description: 'Professional window cleaning' },
    { name: 'Carpet Cleaning', description: 'Specialized carpet cleaning' }
  ];

  // Create categories in the database
  const createdCategories = await Promise.all(
    categories.map(category => 
      serviceService.createCategory(category.name, category.description)
    )
  );

  // Step 2: Generate services for each category
  const services = [];
  for (const category of createdCategories) {
    // Each category gets 3-6 services
    const serviceCount = getRandomNumber(3, 6);
    for (let i = 0; i < serviceCount; i++) {
      const service = serviceService.createService(
        `${category.name} Service ${i + 1}`,
        `Description for ${category.name} Service ${i + 1}`,
        category.name,
        getRandomNumber(30, 100),  // Base price between $30-$100
        getRandomNumber(60, 240)   // Duration between 1-4 hours
      );
      services.push(service);
    }
  }

  // Step 3: Generate users
  const users: {
    cleaners: Cleaner[];
    homeOwners: HomeOwner[];
  } = {
    cleaners: [],
    homeOwners: []
  };

  // Generate 50 cleaners
  for (let i = 0; i < 50; i++) {
    const cleaner = await userService.registerUser(
      `cleaner${i + 1}@example.com`,
      'password123',
      `Cleaner`,
      `${i + 1}`,
      UserRole.CLEANER,
      getRandomNumber(25, 50)  // Hourly rate between $25-$50
    ) as Cleaner;
    users.cleaners.push(cleaner);
  }

  // Generate 100 home owners
  for (let i = 0; i < 100; i++) {
    const homeOwner = await userService.registerUser(
      `homeowner${i + 1}@example.com`,
      'password123',
      `HomeOwner`,
      `${i + 1}`,
      UserRole.HOME_OWNER
    ) as HomeOwner;
    users.homeOwners.push(homeOwner);
  }

  // Step 4: Generate bookings
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6); // 6 months ago

  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 6); // 6 months from now

  // Generate bookings for each cleaner
  for (const cleaner of users.cleaners) {
    // Each cleaner gets 10-20 bookings
    const bookingCount = getRandomNumber(10, 20);
    for (let i = 0; i < bookingCount; i++) {
      // Randomly select a service and home owner
      const service = services[getRandomNumber(0, services.length - 1)];
      const homeOwner = users.homeOwners[getRandomNumber(0, users.homeOwners.length - 1)];
      const scheduledDate = getRandomDate(startDate, endDate);
      const duration = getRandomNumber(60, 240);  // Duration between 1-4 hours

      // Create the booking
      const booking = bookingService.createBooking(
        cleaner.id,
        homeOwner.id,
        service.id,
        scheduledDate,
        duration
      );

      // Randomly set booking status
      const statuses = [
        BookingStatus.PENDING,
        BookingStatus.CONFIRMED,
        BookingStatus.COMPLETED,
        BookingStatus.CANCELLED
      ];
      const status = statuses[getRandomNumber(0, statuses.length - 1)];
      bookingService.updateBookingStatus(booking.id, status);

      // Add review for completed bookings
      if (status === BookingStatus.COMPLETED) {
        bookingService.addReview(
          booking.id,
          getRandomNumber(1, 5),  // Rating between 1-5
          `Great service! Very professional and thorough.`
        );
      }
    }
  }

  // Log generation summary
  console.log('Test data generation completed!');
  console.log(`Generated:
    - ${createdCategories.length} service categories
    - ${services.length} services
    - ${users.cleaners.length} cleaners
    - ${users.homeOwners.length} home owners
    - ${bookingService.getBookingsByStatus(BookingStatus.PENDING).length} pending bookings
    - ${bookingService.getBookingsByStatus(BookingStatus.CONFIRMED).length} confirmed bookings
    - ${bookingService.getBookingsByStatus(BookingStatus.COMPLETED).length} completed bookings
    - ${bookingService.getBookingsByStatus(BookingStatus.CANCELLED).length} cancelled bookings
  `);
}

// Run the script
generateTestData().catch(console.error); 