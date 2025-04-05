import { v4 as uuidv4 } from 'uuid';

export interface IService {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  duration: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

export class Service implements IService {
  public readonly id: string;
  public name: string;
  public description: string;
  public category: string;
  public basePrice: number;
  public duration: number;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(
    name: string,
    description: string,
    category: string,
    basePrice: number,
    duration: number
  ) {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.category = category;
    this.basePrice = basePrice;
    this.duration = duration;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public updateDetails(
    name?: string,
    description?: string,
    category?: string,
    basePrice?: number,
    duration?: number
  ): void {
    if (name) this.name = name;
    if (description) this.description = description;
    if (category) this.category = category;
    if (basePrice) this.basePrice = basePrice;
    if (duration) this.duration = duration;
    this.updatedAt = new Date();
  }
}

export class ServiceCategory {
  public readonly id: string;
  public name: string;
  public description: string;
  public services: Service[];
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(name: string, description: string) {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.services = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public addService(service: Service): void {
    this.services.push(service);
    this.updatedAt = new Date();
  }

  public removeService(serviceId: string): void {
    this.services = this.services.filter(service => service.id !== serviceId);
    this.updatedAt = new Date();
  }

  public updateDetails(name?: string, description?: string): void {
    if (name) this.name = name;
    if (description) this.description = description;
    this.updatedAt = new Date();
  }
} 