import { OutputFormatter } from './OutputFormatter';
import { Position } from '../../domain/types';

/**
 * Implementation of OutputFormatter that formats output as JSON.
 * Useful for programmatic consumption of the robot simulator output.
 */
export class JsonOutputFormatter implements OutputFormatter {
  /**
   * Formats a success message as JSON.
   * @param message - The success message to format
   * @returns JSON string representing the success message
   */
  formatSuccess(message: string): string {
    const response = {
      status: 'success',
      message
    };
    
    return JSON.stringify(response);
  }
  
  /**
   * Formats an error message as JSON.
   * @param message - The error message to format
   * @returns JSON string representing the error message
   */
  formatError(message: string): string {
    const response = {
      status: 'error',
      message
    };
    
    return JSON.stringify(response);
  }
  
  /**
   * Formats a robot position report as JSON.
   * @param position - The robot position to format
   * @returns JSON string representing the robot position
   */
  formatReport(position: Position): string {
    const response = {
      status: 'success',
      position: {
        x: position.x,
        y: position.y,
        direction: position.direction
      }
    };
    
    return JSON.stringify(response);
  }
}