import { Service, ServiceCategory } from '../models/Service';
import { DataStore } from '../data/DataStore';
import { v4 as uuidv4 } from 'uuid';

// Handle all service-related stuff
class ServiceService {
  // Store all our data
  private db: DataStore;

  // Set up the service
  constructor() {
    this.db = DataStore.getInstance();
  }

  // Make a new category
  createCategory(name: string, description: string): ServiceCategory {
    try {
      const category = new ServiceCategory(name, description);
      this.db.addCategory(category);
      return category;
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not create category: ' + error.message);
    }
  }

  // Get a category by ID
  getCategoryById(id: string): ServiceCategory {
    try {
      const category = this.db.getCategoryById(id);
      if (!category) {
        throw new Error('No category found with ID: ' + id);
      }
      return category;
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not get category: ' + error.message);
    }
  }

  // Make a new service
  createService(
    name: string,
    info: string,
    categoryId: string,
    price: number,
    hours: number
  ): Service {
    try {
      // Get the category
      const category = this.getCategoryById(categoryId);

      // Make the service
      const service = new Service(name, info, category, price, hours);
      this.db.addService(service);
      return service;
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not create service: ' + error.message);
    }
  }

  // Get a service by its ID
  getServiceById(id: string): Service {
    const service = this.db.getServiceById(id);
    if (!service) {
      throw new Error('No service found with ID: ' + id);
    }
    return service;
  }

  // Get services by category
  getServicesByCategory(categoryId: string): Service[] {
    try {
      return this.db.getServicesByCategory(categoryId);
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not get services by category: ' + error.message);
    }
  }

  // Get services in a price range
  getServicesByPriceRange(min: number, max: number): Service[] {
    try {
      if (min < 0 || max < min) {
        throw new Error('Invalid price range');
      }
      return this.db.getAllServices().filter(service => {
        const price = service.getPrice();
        return price >= min && price <= max;
      });
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not get services by price: ' + error.message);
    }
  }

  // Get services that take less than maxHours
  getServicesByDuration(maxHours: number): Service[] {
    try {
      if (maxHours <= 0) {
        throw new Error('Duration must be positive');
      }
      return this.db.getAllServices().filter(service => 
        service.hours <= maxHours
      );
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not get services by duration: ' + error.message);
    }
  }

  // Search services by name or info
  searchServices(searchText: string): Service[] {
    try {
      if (!searchText.trim()) {
        throw new Error('Search text cannot be empty');
      }
      const text = searchText.toLowerCase();
      return this.db.getAllServices().filter(service =>
        service.name.toLowerCase().includes(text) ||
        service.info.toLowerCase().includes(text)
      );
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not search services: ' + error.message);
    }
  }

  // Get all services
  getAllServices(): Service[] {
    try {
      return this.db.getAllServices();
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not get all services: ' + error.message);
    }
  }

  // Get all categories
  getAllCategories(): ServiceCategory[] {
    try {
      return this.db.getAllCategories();
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not get categories: ' + error.message);
    }
  }

  // Delete a service
  deleteService(id: string): void {
    try {
      const service = this.getServiceById(id);
      this.db.deleteService(service.id);
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not delete service: ' + error.message);
    }
  }

  // Delete a category
  deleteCategory(id: string): void {
    try {
      const category = this.getCategoryById(id);
      this.db.deleteCategory(category.id);
    } catch (err) {
      const error = err as Error;
      throw new Error('Could not delete category: ' + error.message);
    }
  }
}

// Let other files use this
export { ServiceService }; 