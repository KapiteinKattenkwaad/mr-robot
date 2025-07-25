/**
 * Interface for reading input from various sources.
 * Abstracts the input mechanism to allow for different implementations
 * (console, file, network, etc.)
 */
export interface InputReader {
  /**
   * Reads a line of input asynchronously.
   * @returns Promise resolving to the input string
   */
  readLine(): Promise<string>;
  
  /**
   * Closes the input reader and releases any resources.
   */
  close(): void;
}