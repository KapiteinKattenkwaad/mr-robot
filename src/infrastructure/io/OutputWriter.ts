/**
 * Interface for writing output to various destinations.
 * Abstracts the output mechanism to allow for different implementations
 * (console, file, network, etc.)
 */
export interface OutputWriter {
  /**
   * Writes a message to the output destination.
   * @param message - The message to write
   */
  write(message: string): void;
  
  /**
   * Writes an error message to the output destination.
   * @param message - The error message to write
   */
  writeError(message: string): void;
}