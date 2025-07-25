import { Result } from '../domain/types';
import { CommandFactory } from './commands/CommandFactory';
import { Robot } from '../domain/Robot';
import { Logger } from '../infrastructure/logging/Logger';
import { safeExecuteAsync, formatErrorForUser } from '../infrastructure/io/ErrorHandling';

/**
 * Application service interface for executing robot commands.
 * Provides a high-level API for the presentation layer to interact with the application.
 */
export interface RobotApplicationService {
  /**
   * Executes a command based on the input string.
   * @param input - The command input string to execute
   * @returns Promise resolving to a Result containing either success message or error
   */
  executeCommand(input: string): Promise<Result<string, string>>;
  
  /**
   * Gets the current robot state as a string.
   * @returns String representation of the robot state
   */
  getRobotState(): string;
}

/**
 * Default implementation of RobotApplicationService.
 * Coordinates between the command factory, robot entity, and logging.
 */
export class RobotApplicationServiceImpl implements RobotApplicationService {
  /**
   * Creates a new RobotApplicationServiceImpl.
   * @param robot - The robot entity to operate on
   * @param commandFactory - The command factory to create commands
   * @param logger - The logger to log operations
   */
  constructor(
    private readonly robot: Robot,
    private readonly commandFactory: CommandFactory,
    private readonly logger: Logger
  ) {}
  
  /**
   * Executes a command based on the input string.
   * @param input - The command input string to execute
   * @returns Promise resolving to a Result containing either success message or error
   */
  async executeCommand(input: string): Promise<Result<string, string>> {
    this.logger.debug(`Executing command: ${input}`);
    
    // Safely create command with error handling
    const command = this.commandFactory.createCommand(input);
    
    if (!command) {
      this.logger.warn(`Invalid command: ${input}`);
      return {
        success: false,
        error: `Invalid command: ${input}`
      };
    }
    
    // Safely execute command with comprehensive error handling
    const result = await safeExecuteAsync(
      async () => command.execute(),
      {
        logger: this.logger,
        errorMessage: `Error executing command: ${input}`,
        defaultValue: {
          success: false,
          error: `An error occurred while executing the command: ${input}`
        },
        rethrow: false
      }
    );
    
    // Handle the result
    if (result) {
      if (result.success) {
        this.logger.debug(`Command executed successfully: ${result.data}`);
      } else {
        this.logger.warn(`Command execution failed: ${result.error}`);
      }
      
      return result;
    }
    
    // This should never happen due to defaultValue, but TypeScript needs it
    return {
      success: false,
      error: `An unexpected error occurred while executing the command: ${input}`
    };
  }
  
  /**
   * Gets the current robot state as a string.
   * @returns String representation of the robot state
   */
  getRobotState(): string {
    const position = this.robot.getPosition();
    
    if (!position) {
      return 'Robot has not been placed on the table yet';
    }
    
    return `Robot is at position (${position.x}, ${position.y}) facing ${position.direction}`;
  }
}