/**
 * Log levels supported by the logger.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Interface for logging messages at different levels.
 * Abstracts the logging mechanism to allow for different implementations.
 */
export interface Logger {
  /**
   * Logs a debug message.
   * @param message - The message to log
   * @param meta - Optional metadata to include in the log
   */
  debug(message: string, meta?: any): void;
  
  /**
   * Logs an info message.
   * @param message - The message to log
   * @param meta - Optional metadata to include in the log
   */
  info(message: string, meta?: any): void;
  
  /**
   * Logs a warning message.
   * @param message - The message to log
   * @param meta - Optional metadata to include in the log
   */
  warn(message: string, meta?: any): void;
  
  /**
   * Logs an error message.
   * @param message - The message to log
   * @param error - Optional error object to include in the log
   */
  error(message: string, error?: Error): void;
  
  /**
   * Gets the current log level.
   * @returns The current log level
   */
  getLevel(): LogLevel;
  
  /**
   * Sets the log level.
   * @param level - The log level to set
   */
  setLevel(level: LogLevel): void;
}

/**
 * Implementation of Logger that logs to the console with structured output.
 * Supports different log levels and formats.
 */
export class ConsoleLogger implements Logger {
  /**
   * Creates a new ConsoleLogger.
   * @param level - The initial log level (default: 'info')
   * @param useJson - Whether to output logs in JSON format (default: false)
   */
  constructor(
    private level: LogLevel = 'info',
    private readonly useJson: boolean = false
  ) {}
  
  /**
   * Logs a debug message if the current level is 'debug'.
   * @param message - The message to log
   * @param meta - Optional metadata to include in the log
   */
  debug(message: string, meta?: any): void {
    if (this.shouldLog('debug')) {
      this.log('debug', message, meta);
    }
  }
  
  /**
   * Logs an info message if the current level is 'info' or lower.
   * @param message - The message to log
   * @param meta - Optional metadata to include in the log
   */
  info(message: string, meta?: any): void {
    if (this.shouldLog('info')) {
      this.log('info', message, meta);
    }
  }
  
  /**
   * Logs a warning message if the current level is 'warn' or lower.
   * @param message - The message to log
   * @param meta - Optional metadata to include in the log
   */
  warn(message: string, meta?: any): void {
    if (this.shouldLog('warn')) {
      this.log('warn', message, meta);
    }
  }
  
  /**
   * Logs an error message if the current level is 'error' or lower.
   * @param message - The message to log
   * @param error - Optional error object to include in the log
   */
  error(message: string, error?: Error): void {
    if (this.shouldLog('error')) {
      this.log('error', message, error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined);
    }
  }
  
  /**
   * Gets the current log level.
   * @returns The current log level
   */
  getLevel(): LogLevel {
    return this.level;
  }
  
  /**
   * Sets the log level.
   * @param level - The log level to set
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }
  
  /**
   * Determines if a message at the given level should be logged.
   * @param messageLevel - The level of the message to check
   * @returns True if the message should be logged, false otherwise
   */
  private shouldLog(messageLevel: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.level);
    const messageLevelIndex = levels.indexOf(messageLevel);
    
    return messageLevelIndex >= currentLevelIndex;
  }
  
  /**
   * Logs a message at the specified level.
   * @param level - The level to log at
   * @param message - The message to log
   * @param meta - Optional metadata to include in the log
   */
  private log(level: LogLevel, message: string, meta?: any): void {
    const timestamp = new Date().toISOString();
    
    if (this.useJson) {
      const logEntry = {
        timestamp,
        level: level.toUpperCase(),
        message,
        ...(meta ? { meta } : {})
      };
      
      console.log(JSON.stringify(logEntry));
    } else {
      const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
      console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`);
    }
  }
}