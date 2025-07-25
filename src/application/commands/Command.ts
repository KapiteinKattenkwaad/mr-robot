import { Result } from '../../domain/types';

/**
 * Command interface following the Command Pattern.
 * Each command encapsulates a request as an object, allowing for
 * parameterization of clients with different requests and queuing of requests.
 */
export interface Command {
  /**
   * Executes the command and returns a result indicating success or failure.
   * @returns Promise resolving to a Result containing either success message or error
   */
  execute(): Promise<Result<string, string>>;
}