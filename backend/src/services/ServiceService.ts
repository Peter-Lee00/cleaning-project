import { Service, ServiceCategory } from '../models/Service';
import { DataStore } from '../data/DataStore';

export class ServiceService {
  private dataStore: DataStore;

  constructor() {
    this.dataStore = DataStore.getInstance();
  }

  // Service Management
  public createService(
    name: string,
    description: string,
    category: string,
    basePrice: number,
    duration: number
  ): Service {
    const service = new Service(name, description, category, basePrice, duration);
    this.dataStore.addService(service);
    return service;
  }

  public getServiceById(id: string): Service {
    const service = this.dataStore.getServiceById(id);
    if (!service) {
      throw new Error('Service not found');
    }
    return service;
  }

  public updateService(
    id: string,
    updates: {
      name?: string;
      description?: string;
      category?: string;
      basePrice?: number;
      duration?: number;
    }
  ): Service {
    const service = this.getServiceById(id);
    service.updateDetails(
      updates.name,
      updates.description,
      updates.category,
      updates.basePrice,
      updates.duration
    );
    this.dataStore.updateService(service);
    return service;
  }

  public deleteService(id: string): void {
    const service = this.getServiceById(id);
    this.dataStore.deleteService(id);
  }

  public getServicesByCategory(category: string): Service[] {
    return this.dataStore.getServicesByCategory(category);
  }

  // Category Management
  public createCategory(name: string, description: string): ServiceCategory {
    const category = new ServiceCategory(name, description);
    this.dataStore.addCategory(category);
    return category;
  }

  public getCategoryById(id: string): ServiceCategory {
    const category = this.dataStore.getCategoryById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  public updateCategory(
    id: string,
    updates: {
      name?: string;
      description?: string;
    }
  ): ServiceCategory {
    const category = this.getCategoryById(id);
    category.updateDetails(updates.name, updates.description);
    this.dataStore.updateCategory(category);
    return category;
  }

  public deleteCategory(id: string): void {
    const category = this.getCategoryById(id);
    this.dataStore.deleteCategory(id);
  }

  public getAllCategories(): ServiceCategory[] {
    return this.dataStore.getAllCategories();
  }

  // Service-Category Relationship Management
  public addServiceToCategory(serviceId: string, categoryId: string): void {
    const service = this.getServiceById(serviceId);
    const category = this.getCategoryById(categoryId);

    // Update service category
    service.updateDetails(undefined, undefined, category.name);
    this.dataStore.updateService(service);

    // Add service to category
    category.addService(service);
    this.dataStore.updateCategory(category);
  }

  public removeServiceFromCategory(serviceId: string, categoryId: string): void {
    const service = this.getServiceById(serviceId);
    const category = this.getCategoryById(categoryId);

    // Remove service from category
    category.removeService(serviceId);
    this.dataStore.updateCategory(category);

    // Clear service category
    service.updateDetails(undefined, undefined, '');
    this.dataStore.updateService(service);
  }

  // Service Search and Filtering
  public searchServices(query: string): Service[] {
    const searchTerm = query.toLowerCase();
    return Array.from(this.dataStore.getServicesByCategory(''))
      .filter(service => 
        service.name.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm)
      );
  }

  public getServicesByPriceRange(minPrice: number, maxPrice: number): Service[] {
    return Array.from(this.dataStore.getServicesByCategory(''))
      .filter(service => 
        service.basePrice >= minPrice && 
        service.basePrice <= maxPrice
      );
  }

  public getServicesByDuration(maxDuration: number): Service[] {
    return Array.from(this.dataStore.getServicesByCategory(''))
      .filter(service => service.duration <= maxDuration);
  }

  // Get all services
  public getAllServices(): Service[] {
    return Array.from(this.dataStore.getAllServices());
  }
} 