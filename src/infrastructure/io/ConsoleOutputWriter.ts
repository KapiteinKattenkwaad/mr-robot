import { OutputWriter } from './OutputWriter';
import { safeExecute } from './ErrorHandling';

/**
 * Implementation of OutputWriter that writes to the console (stdout/stderr).
 * Includes error handling for I/O operations.
 */
export class ConsoleOutputWriter implements OutputWriter {
  /**
   * Writes a message to the console (stdout).
   * @param message - The message to write
   */
  write(message: string): void {
    safeExecute(
      () => console.log(message),
      {
        errorMessage: 'Failed to write to stdout using console.log',
        defaultValue: undefined,
        rethrow: false
      }
    );
    
    // If console.log fails, the safeExecute will catch the error and return undefined
    // In that case, try the fallback method
    safeExecute(
      () => process.stdout.write(`${message}\n`),
      {
        errorMessage: 'Failed to write to stdout using process.stdout.write',
        defaultValue: undefined,
        rethrow: false
      }
    );
    
    // If both methods fail, we can't do much more than swallow the error
    // since we can't reliably report it anywhere
  }
  
  /**
   * Writes an error message to the console (stderr).
   * @param message - The error message to write
   */
  writeError(message: string): void {
    safeExecute(
      () => console.error(message),
      {
        errorMessage: 'Failed to write to stderr using console.error',
        defaultValue: undefined,
        rethrow: false
      }
    );
    
    // If console.error fails, the safeExecute will catch the error and return undefined
    // In that case, try the fallback method
    safeExecute(
      () => process.stderr.write(`${message}\n`),
      {
        errorMessage: 'Failed to write to stderr using process.stderr.write',
        defaultValue: undefined,
        rethrow: false
      }
    );
    
    // If both methods fail, we can't do much more than swallow the error
    // since we can't reliably report it anywhere
  }
}