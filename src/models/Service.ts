import { v4 as uuid } from 'uuid';

// Groups similar cleaning services together
class ServiceCategory {
  id: string;        // unique ID
  name: string;      // category name
  info: string;      // what it is
  createdAt: Date;   // when made

  // Make a new category
  constructor(name: string, info: string) {
    this.id = uuid();
    this.name = name;
    this.info = info;
    this.createdAt = new Date();
  }
}

// A specific cleaning service
class Service {
  id: string;        // unique ID
  name: string;      // service name
  info: string;      // what it includes
  category: ServiceCategory;  // type of service
  price: number;     // cost per hour
  hours: number;     // how many hours
  createdAt: Date;   // when made
  updatedAt: Date;   // when changed

  // Make a new service
  constructor(
    name: string,
    info: string,
    category: ServiceCategory,
    price: number,
    hours: number
  ) {
    this.id = uuid();
    this.name = name;
    this.info = info;
    this.category = category;
    this.price = price;
    this.hours = hours;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Get total cost
  getPrice(): number {
    return this.price * this.hours;
  }

  // Update service info
  update(
    name?: string,
    info?: string,
    price?: number,
    hours?: number
  ) {
    // Only change what's given
    if (name) this.name = name;
    if (info) this.info = info;
    if (price) this.price = price;
    if (hours) this.hours = hours;
    
    this.updatedAt = new Date();
  }
}

// Let other files use these
export { Service, ServiceCategory }; 