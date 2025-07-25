/**
 * Interface for a dependency injection container.
 * Provides methods for registering and resolving dependencies.
 */
export interface Container {
  /**
   * Registers a factory function for creating a service.
   * @param token - The token to register the service under
   * @param factory - The factory function to create the service
   */
  register<T>(token: string, factory: () => T): void;
  
  /**
   * Registers a singleton factory function for creating a service.
   * The service will be created only once and reused for subsequent requests.
   * @param token - The token to register the service under
   * @param factory - The factory function to create the service
   */
  registerSingleton<T>(token: string, factory: () => T): void;
  
  /**
   * Registers a value as a service.
   * @param token - The token to register the service under
   * @param value - The value to register
   */
  registerValue<T>(token: string, value: T): void;
  
  /**
   * Gets a service from the container.
   * @param token - The token to get the service for
   * @returns The service instance
   * @throws Error if the service is not registered
   */
  get<T>(token: string): T;
  
  /**
   * Checks if a service is registered in the container.
   * @param token - The token to check
   * @returns True if the service is registered, false otherwise
   */
  has(token: string): boolean;
}

/**
 * Factory function type for creating services.
 */
type Factory<T> = () => T;

/**
 * Service registration type.
 */
type Registration<T> = {
  factory: Factory<T>;
  singleton: boolean;
  instance?: T;
};

/**
 * Simple implementation of a dependency injection container.
 * Supports transient, singleton, and value registrations.
 */
export class SimpleContainer implements Container {
  private services = new Map<string, Registration<any>>();
  
  /**
   * Registers a factory function for creating a service.
   * @param token - The token to register the service under
   * @param factory - The factory function to create the service
   */
  register<T>(token: string, factory: () => T): void {
    this.services.set(token, {
      factory,
      singleton: false
    });
  }
  
  /**
   * Registers a singleton factory function for creating a service.
   * The service will be created only once and reused for subsequent requests.
   * @param token - The token to register the service under
   * @param factory - The factory function to create the service
   */
  registerSingleton<T>(token: string, factory: () => T): void {
    this.services.set(token, {
      factory,
      singleton: true
    });
  }
  
  /**
   * Registers a value as a service.
   * @param token - The token to register the service under
   * @param value - The value to register
   */
  registerValue<T>(token: string, value: T): void {
    this.services.set(token, {
      factory: () => value,
      singleton: true,
      instance: value
    });
  }
  
  /**
   * Gets a service from the container.
   * @param token - The token to get the service for
   * @returns The service instance
   * @throws Error if the service is not registered
   */
  get<T>(token: string): T {
    const registration = this.services.get(token);
    
    if (!registration) {
      throw new Error(`Service not registered: ${token}`);
    }
    
    if (registration.singleton) {
      if (!registration.instance) {
        registration.instance = registration.factory();
      }
      
      return registration.instance;
    }
    
    return registration.factory();
  }
  
  /**
   * Checks if a service is registered in the container.
   * @param token - The token to check
   * @returns True if the service is registered, false otherwise
   */
  has(token: string): boolean {
    return this.services.has(token);
  }
}
