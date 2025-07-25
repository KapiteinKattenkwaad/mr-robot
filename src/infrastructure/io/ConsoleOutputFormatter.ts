import chalk from 'chalk';
import { OutputFormatter } from './OutputFormatter';
import { Position } from '../../domain/types';

/**
 * Implementation of OutputFormatter that formats output for the console with colors.
 * Uses chalk for colored output.
 */
export class ConsoleOutputFormatter implements OutputFormatter {
  private readonly useColors: boolean;
  
  /**
   * Creates a new ConsoleOutputFormatter.
   * @param useColors - Whether to use colors in the output (default: true)
   */
  constructor(useColors: boolean = true) {
    this.useColors = useColors;
  }
  
  /**
   * Formats a success message with green color (if colors are enabled).
   * @param message - The success message to format
   * @returns Formatted success message
   */
  formatSuccess(message: string): string {
    return this.useColors ? chalk.green(message) : message;
  }
  
  /**
   * Formats an error message with red color (if colors are enabled).
   * @param message - The error message to format
   * @returns Formatted error message
   */
  formatError(message: string): string {
    return this.useColors ? chalk.red(`Error: ${message}`) : `Error: ${message}`;
  }
  
  /**
   * Formats a robot position report with blue color (if colors are enabled).
   * @param position - The robot position to format
   * @returns Formatted position report
   */
  formatReport(position: Position): string {
    const reportText = `Output: ${position.x},${position.y},${position.direction}`;
    return this.useColors ? chalk.blue(reportText) : reportText;
  }
}