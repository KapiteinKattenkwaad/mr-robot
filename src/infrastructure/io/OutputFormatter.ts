import { Position } from '../../domain/types';

/**
 * Interface for formatting output messages in different formats.
 * Abstracts the formatting logic to allow for different output formats
 * (plain text, colored console, JSON, etc.)
 */
export interface OutputFormatter {
  /**
   * Formats a success message.
   * @param message - The success message to format
   * @returns Formatted success message
   */
  formatSuccess(message: string): string;
  
  /**
   * Formats an error message.
   * @param message - The error message to format
   * @returns Formatted error message
   */
  formatError(message: string): string;
  
  /**
   * Formats a robot position report.
   * @param position - The robot position to format
   * @returns Formatted position report
   */
  formatReport(position: Position): string;
}