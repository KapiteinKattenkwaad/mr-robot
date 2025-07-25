import { RobotApplicationService } from '../application/RobotApplicationService';
import { InputReader } from '../infrastructure/io/InputReader';
import { OutputWriter } from '../infrastructure/io/OutputWriter';
import { OutputFormatter } from '../infrastructure/io/OutputFormatter';
import { Logger } from '../infrastructure/logging/Logger';
import { 
  safeExecute, 
  safeExecuteAsync, 
  safeClose, 
  formatErrorForUser,
  isCriticalError 
} from '../infrastructure/io/ErrorHandling';

/**
 * CLI application that handles user interaction through the command line.
 * Coordinates between input/output and the application service.
 */
export class CLIApplication {
  private isRunning = false;

  /**
   * Creates a new CLIApplication.
   * @param inputReader - The input reader to use for reading user input
   * @param outputWriter - The output writer to use for writing output
   * @param outputFormatter - The output formatter to use for formatting output
   * @param applicationService - The application service to use for executing commands
   * @param logger - The logger to use for logging
   */
  constructor(
    private readonly inputReader: InputReader,
    private readonly outputWriter: OutputWriter,
    private readonly outputFormatter: OutputFormatter,
    private readonly applicationService: RobotApplicationService,
    private readonly logger: Logger
  ) {}

  /**
   * Starts the CLI application and begins processing user input.
   * @returns Promise that resolves when the application exits
   */
  async start(): Promise<void> {
    this.isRunning = true;
    
    try {
      // Safely write welcome messages
      await safeExecuteAsync(
        async () => {
          this.outputWriter.write(this.outputFormatter.formatSuccess('Welcome to Robot Simulator!'));
          this.outputWriter.write('Type commands to control the robot, or "EXIT" to quit.');
        },
        {
          logger: this.logger,
          errorMessage: 'Failed to display welcome message',
          logLevel: 'warn'
        }
      );
      
      // Main application loop
      while (this.isRunning) {
        try {
          // Safely read input with error handling
          const input = await safeExecuteAsync(
            async () => this.inputReader.readLine(),
            {
              logger: this.logger,
              errorMessage: 'Error reading input',
              defaultValue: ''
            }
          );
          
          if (!input) {
            continue;
          }
          
          if (input.toUpperCase() === 'EXIT') {
            this.isRunning = false;
            await safeExecuteAsync(
              async () => {
                this.outputWriter.write(this.outputFormatter.formatSuccess('Goodbye!'));
              },
              {
                logger: this.logger,
                errorMessage: 'Failed to display exit message',
                logLevel: 'debug'
              }
            );
            break;
          }
          
          // Execute command with comprehensive error handling
          await safeExecuteAsync(
            async () => {
              const result = await this.applicationService.executeCommand(input);
              
              if (result.success) {
                if (result.data) {
                  this.outputWriter.write(this.outputFormatter.formatSuccess(result.data));
                }
              } else {
                this.outputWriter.writeError(this.outputFormatter.formatError(result.error));
              }
            },
            {
              logger: this.logger,
              errorMessage: `Error executing command: ${input}`,
              rethrow: false
            }
          );
        } catch (error) {
          // This is a fallback error handler for any errors not caught by safeExecuteAsync
          await this.handleError(error);
          
          // If it's a critical error, exit the application
          if (isCriticalError(error)) {
            this.logger.error('Critical error detected, shutting down application', 
              error instanceof Error ? error : new Error(String(error)));
            this.isRunning = false;
            break;
          }
        }
      }
    } catch (error) {
      // This is a fallback error handler for any errors in the main loop
      await this.handleError(error);
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Stops the CLI application.
   */
  stop(): void {
    this.isRunning = false;
  }

  /**
   * Handles errors that occur during application execution.
   * @param error - The error to handle
   */
  private async handleError(error: unknown): Promise<void> {
    // Log the full error for debugging
    this.logger.error('Application error', error instanceof Error ? error : new Error(String(error)));
    
    // Display a user-friendly error message
    await safeExecuteAsync(
      async () => {
        this.outputWriter.writeError(
          this.outputFormatter.formatError('An unexpected error occurred. Please try again.')
        );
      },
      {
        logger: this.logger,
        errorMessage: 'Failed to display error message',
        logLevel: 'debug'
      }
    );
  }

  /**
   * Cleans up resources when the application exits.
   */
  private async cleanup(): Promise<void> {
    // Close the input reader safely
    safeClose(this.inputReader, 'close', this.logger);
    
    // Log shutdown completion
    safeExecute(
      () => {
        this.logger.info('Application shutdown complete');
      },
      {
        logger: this.logger,
        errorMessage: 'Error logging shutdown completion',
        logLevel: 'debug'
      }
    );
  }
}