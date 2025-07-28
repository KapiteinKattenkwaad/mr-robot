import { ConsoleInputReader } from './ConsoleInputReader';
import { ConsoleOutputWriter } from './ConsoleOutputWriter';
import { 
  safeExecute, 
  safeExecuteAsync, 
  safeClose, 
  formatErrorForUser,
  isCriticalError
} from './ErrorHandling';
import { Logger } from '../logging/Logger';

// Mock logger for testing
class MockLogger implements Logger {
  logs: Array<{ level: string; message: string; meta?: any }> = [];

  debug(message: string, meta?: any): void {
    this.logs.push({ level: 'debug', message, meta });
  }

  info(message: string, meta?: any): void {
    this.logs.push({ level: 'info', message, meta });
  }

  warn(message: string, meta?: any): void {
    this.logs.push({ level: 'warn', message, meta });
  }

  error(message: string, error?: Error): void {
    this.logs.push({ level: 'error', message, meta: error });
  }

  getLevel(): 'debug' | 'info' | 'warn' | 'error' {
    return 'debug';
  }

  setLevel(): void {
    // Not used in tests
  }
}

describe('Error Handling', () => {
  describe('ConsoleInputReader', () => {
    afterEach(() => {
      // Clear all mocks
      jest.restoreAllMocks();
    });
    
    it('should handle readline errors gracefully', () => {
      // Mock console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Create a reader with error handling
      const reader = new ConsoleInputReader();
      
      // Simulate an error event
      const mockRl = {
        on: jest.fn(),
        question: jest.fn(),
        close: jest.fn()
      };
      
      // @ts-ignore - Access private property for testing
      reader['rl'] = mockRl;
      
      // @ts-ignore - Set closed flag for testing
      reader['isClosed'] = true;
      
      // Try to read a line after close
      expect(reader.readLine()).rejects.toThrow('Input reader is closed');
    });
    
    it('should handle close method errors gracefully', () => {
      // Mock console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Create a reader with error handling
      const reader = new ConsoleInputReader();
      
      // Mock the readline interface to throw on close
      const mockRl = {
        on: jest.fn(),
        question: jest.fn(),
        close: jest.fn().mockImplementation(() => {
          throw new Error('Mock close error');
        })
      };
      
      // @ts-ignore - Access private property for testing
      reader['rl'] = mockRl;
      
      // Close should not throw
      expect(() => reader.close()).not.toThrow();
      
      // The safeExecute function doesn't log to console.error without a logger
      // So we just verify it doesn't throw, which is the main behavior we want
      expect(mockRl.close).toHaveBeenCalled();
    });
  });
  
  describe('ConsoleOutputWriter', () => {
    let writer: ConsoleOutputWriter;
    
    beforeEach(() => {
      writer = new ConsoleOutputWriter();
    });
    
    afterEach(() => {
      jest.restoreAllMocks();
    });
    
    it('should handle console.log errors gracefully', () => {
      // Mock console.log to throw an error
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {
        throw new Error('Mock console.log error');
      });
      
      // Mock process.stdout.write
      const stdoutWriteSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
      
      // Write should not throw
      expect(() => writer.write('Test message')).not.toThrow();
      
      // console.log should have been called
      expect(consoleLogSpy).toHaveBeenCalledWith('Test message');
      
      // process.stdout.write should have been called as fallback
      expect(stdoutWriteSpy).toHaveBeenCalledWith('Test message\n');
    });
    
    it('should handle console.error errors gracefully', () => {
      // Mock console.error to throw an error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        throw new Error('Mock console.error error');
      });
      
      // Mock process.stderr.write
      const stderrWriteSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
      
      // writeError should not throw
      expect(() => writer.writeError('Test error')).not.toThrow();
      
      // console.error should have been called
      expect(consoleErrorSpy).toHaveBeenCalledWith('Test error');
      
      // process.stderr.write should have been called as fallback
      expect(stderrWriteSpy).toHaveBeenCalledWith('Test error\n');
    });
    
    it('should handle both console.log and process.stdout.write errors gracefully', () => {
      // Mock console.log to throw an error
      jest.spyOn(console, 'log').mockImplementation(() => {
        throw new Error('Mock console.log error');
      });
      
      // Mock process.stdout.write to also throw an error
      jest.spyOn(process.stdout, 'write').mockImplementation(() => {
        throw new Error('Mock process.stdout.write error');
      });
      
      // Write should not throw
      expect(() => writer.write('Test message')).not.toThrow();
    });
  });

  describe('safeExecute', () => {
    let logger: MockLogger;

    beforeEach(() => {
      logger = new MockLogger();
    });

    it('should return the result of the function when successful', () => {
      const result = safeExecute(() => 'success');
      expect(result).toBe('success');
    });

    it('should return undefined when an error occurs and no default value is provided', () => {
      const result = safeExecute(() => {
        throw new Error('Test error');
      });
      expect(result).toBeUndefined();
    });

    it('should return the default value when an error occurs', () => {
      const result = safeExecute(
        () => {
          throw new Error('Test error');
        },
        { defaultValue: 'default' }
      );
      expect(result).toBe('default');
    });

    it('should log errors when a logger is provided', () => {
      safeExecute(
        () => {
          throw new Error('Test error');
        },
        { logger }
      );

      expect(logger.logs.length).toBe(1);
      expect(logger.logs[0].level).toBe('error');
      expect(logger.logs[0].message).toBe('Error during execution');
    });

    it('should use the specified log level', () => {
      safeExecute(
        () => {
          throw new Error('Test error');
        },
        { logger, logLevel: 'warn' }
      );

      expect(logger.logs.length).toBe(1);
      expect(logger.logs[0].level).toBe('warn');
    });

    it('should use the specified error message', () => {
      safeExecute(
        () => {
          throw new Error('Test error');
        },
        { logger, errorMessage: 'Custom error message' }
      );

      expect(logger.logs.length).toBe(1);
      expect(logger.logs[0].message).toBe('Custom error message');
    });

    it('should rethrow the error when rethrow is true', () => {
      expect(() =>
        safeExecute(
          () => {
            throw new Error('Test error');
          },
          { rethrow: true }
        )
      ).toThrow('Test error');
    });
  });

  describe('safeExecuteAsync', () => {
    let logger: MockLogger;

    beforeEach(() => {
      logger = new MockLogger();
    });

    it('should return the result of the async function when successful', async () => {
      const result = await safeExecuteAsync(async () => 'success');
      expect(result).toBe('success');
    });

    it('should return undefined when an error occurs and no default value is provided', async () => {
      const result = await safeExecuteAsync(async () => {
        throw new Error('Test error');
      });
      expect(result).toBeUndefined();
    });

    it('should return the default value when an error occurs', async () => {
      const result = await safeExecuteAsync(
        async () => {
          throw new Error('Test error');
        },
        { defaultValue: 'default' }
      );
      expect(result).toBe('default');
    });

    it('should log errors when a logger is provided', async () => {
      await safeExecuteAsync(
        async () => {
          throw new Error('Test error');
        },
        { logger }
      );

      expect(logger.logs.length).toBe(1);
      expect(logger.logs[0].level).toBe('error');
      expect(logger.logs[0].message).toBe('Error during async execution');
    });

    it('should rethrow the error when rethrow is true', async () => {
      await expect(
        safeExecuteAsync(
          async () => {
            throw new Error('Test error');
          },
          { rethrow: true }
        )
      ).rejects.toThrow('Test error');
    });
  });

  describe('safeClose', () => {
    let logger: MockLogger;

    beforeEach(() => {
      logger = new MockLogger();
    });

    it('should call the close method on the resource', () => {
      const resource = {
        close: jest.fn()
      };

      safeClose(resource, 'close');
      expect(resource.close).toHaveBeenCalled();
    });

    it('should handle null resources gracefully', () => {
      expect(() => safeClose(null, 'close')).not.toThrow();
    });

    it('should handle undefined resources gracefully', () => {
      expect(() => safeClose(undefined, 'close')).not.toThrow();
    });

    it('should handle errors during close', () => {
      const resource = {
        close: jest.fn().mockImplementation(() => {
          throw new Error('Close error');
        })
      };

      expect(() => safeClose(resource, 'close', logger)).not.toThrow();
      expect(logger.logs.length).toBe(1);
      expect(logger.logs[0].level).toBe('error');
      expect(logger.logs[0].message).toBe('Error closing resource');
    });
  });

  describe('formatErrorForUser', () => {
    it('should format Error objects correctly', () => {
      const error = new Error('Test error');
      expect(formatErrorForUser(error)).toBe('Test error');
    });

    it('should format non-Error objects correctly', () => {
      expect(formatErrorForUser('string error')).toBe('string error');
      expect(formatErrorForUser(123)).toBe('123');
      expect(formatErrorForUser(null)).toBe('null');
      expect(formatErrorForUser(undefined)).toBe('undefined');
    });
  });

  describe('isCriticalError', () => {
    it('should identify critical errors', () => {
      expect(isCriticalError(new Error('EACCES: permission denied'))).toBe(true);
      expect(isCriticalError(new Error('EPERM: operation not permitted'))).toBe(true);
      expect(isCriticalError(new Error('out of memory'))).toBe(true);
    });

    it('should identify non-critical errors', () => {
      expect(isCriticalError(new Error('Not critical'))).toBe(false);
      expect(isCriticalError('string error')).toBe(false);
    });
  });
});