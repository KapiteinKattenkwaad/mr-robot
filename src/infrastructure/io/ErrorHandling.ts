/**
 * Utility functions for error handling throughout the application.
 * Provides consistent error handling patterns and utilities.
 */

import { Logger } from '../logging/Logger';

/**
 * Options for safe execution of functions.
 */
export interface SafeExecutionOptions<T> {
  /** Default value to return if execution fails */
  defaultValue?: T;
  /** Whether to rethrow the error after logging */
  rethrow?: boolean;
  /** Custom error message to log */
  errorMessage?: string;
  /** Logger to use for logging errors */
  logger?: Logger;
  /** Log level to use for errors */
  logLevel?: 'error' | 'warn' | 'debug' | 'info';
}

/**
 * Safely executes a function, catching and handling any errors.
 * 
 * @param fn - The function to execute
 * @param options - Options for error handling
 * @returns The result of the function or the default value if an error occurs
 */
export function safeExecute<T>(
  fn: () => T,
  options: SafeExecutionOptions<T> = {}
): T | undefined {
  const {
    defaultValue,
    rethrow = false,
    errorMessage = 'Error during execution',
    logger,
    logLevel = 'error'
  } = options;

  try {
    return fn();
  } catch (error) {
    if (logger) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      switch (logLevel) {
        case 'warn':
          logger.warn(errorMessage, { error: errorObj.message });
          break;
        case 'debug':
          logger.debug(errorMessage, { error: errorObj.message });
          break;
        case 'info':
          logger.info(errorMessage, { error: errorObj.message });
          break;
        case 'error':
        default:
          logger.error(errorMessage, errorObj);
          break;
      }
    }

    if (rethrow) {
      throw error;
    }

    return defaultValue;
  }
}

/**
 * Safely executes an async function, catching and handling any errors.
 * 
 * @param fn - The async function to execute
 * @param options - Options for error handling
 * @returns A promise that resolves to the result of the function or the default value if an error occurs
 */
export async function safeExecuteAsync<T>(
  fn: () => Promise<T>,
  options: SafeExecutionOptions<T> = {}
): Promise<T | undefined> {
  const {
    defaultValue,
    rethrow = false,
    errorMessage = 'Error during async execution',
    logger,
    logLevel = 'error'
  } = options;

  try {
    return await fn();
  } catch (error) {
    if (logger) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      switch (logLevel) {
        case 'warn':
          logger.warn(errorMessage, { error: errorObj.message });
          break;
        case 'debug':
          logger.debug(errorMessage, { error: errorObj.message });
          break;
        case 'info':
          logger.info(errorMessage, { error: errorObj.message });
          break;
        case 'error':
        default:
          logger.error(errorMessage, errorObj);
          break;
      }
    }

    if (rethrow) {
      throw error;
    }

    return defaultValue;
  }
}

/**
 * Safely closes a resource, catching and handling any errors.
 * 
 * @param resource - The resource to close
 * @param closeMethod - The method to call to close the resource
 * @param logger - Logger to use for logging errors
 */
export function safeClose<T extends Record<string, any>>(
  resource: T | null | undefined,
  closeMethod: keyof T,
  logger?: Logger
): void {
  if (!resource) {
    return;
  }

  try {
    const closeFunction = resource[closeMethod];
    if (typeof closeFunction === 'function') {
      (closeFunction as Function).call(resource);
    }
  } catch (error) {
    if (logger) {
      logger.error('Error closing resource', error instanceof Error ? error : new Error(String(error)));
    }
  }
}

/**
 * Formats an error for user display, hiding sensitive information.
 * 
 * @param error - The error to format
 * @returns A user-friendly error message
 */
export function formatErrorForUser(error: unknown): string {
  if (error instanceof Error) {
    // Return only the message, not the stack trace
    return error.message;
  }
  
  return String(error);
}

/**
 * Determines if an error is critical and should cause the application to exit.
 * 
 * @param error - The error to check
 * @returns True if the error is critical, false otherwise
 */
export function isCriticalError(error: unknown): boolean {
  // Add logic to determine if an error is critical
  // For example, database connection errors, file system errors, etc.
  if (error instanceof Error) {
    // Check for specific error types or messages
    if (
      error.message.includes('EACCES') ||
      error.message.includes('EPERM') ||
      error.message.includes('out of memory')
    ) {
      return true;
    }
  }
  
  return false;
}