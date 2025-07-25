import * as readline from 'readline';
import { InputReader } from './InputReader';
import { safeExecute, safeExecuteAsync } from './ErrorHandling';

/**
 * Implementation of InputReader that reads from the console (stdin).
 * Uses Node.js readline interface for input handling.
 */
export class ConsoleInputReader implements InputReader {
  private rl: readline.Interface;
  private isClosed = false;
  
  /**
   * Creates a new ConsoleInputReader.
   */
  constructor() {
    this.rl = safeExecute(
      () => {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
          prompt: '> '
        });
        
        // Handle readline events
        rl.on('close', () => {
          this.isClosed = true;
        });
        
        rl.on('error', (err) => {
          console.error('Input reader error:', err);
          this.isClosed = true;
        });
        
        return rl;
      },
      {
        rethrow: true,
        errorMessage: 'Failed to initialize input reader'
      }
    )!;
  }
  
  /**
   * Reads a line of input from the console.
   * @returns Promise resolving to the input string
   * @throws Error if the reader is closed or an error occurs
   */
  readLine(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (this.isClosed) {
        reject(new Error('Input reader is closed'));
        return;
      }
      
      safeExecute(
        () => {
          this.rl.question('', (answer) => {
            resolve(answer);
          });
        },
        {
          rethrow: true,
          errorMessage: 'Failed to read input'
        }
      );
    });
  }
  
  /**
   * Closes the readline interface.
   */
  close(): void {
    if (!this.isClosed) {
      safeExecute(
        () => {
          this.rl.close();
          this.isClosed = true;
        },
        {
          errorMessage: 'Error closing input reader'
        }
      );
    }
  }
}