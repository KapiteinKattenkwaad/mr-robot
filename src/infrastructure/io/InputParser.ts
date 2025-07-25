import { ParsedCommand } from '../../application/commands/CommandFactory';

/**
 * Interface for parsing input strings into structured command objects.
 * Abstracts the parsing logic to allow for different input formats.
 */
export interface InputParser {
  /**
   * Parses an input string into a structured command object.
   * @param input - The input string to parse
   * @returns ParsedCommand object if parsing succeeds, null otherwise
   */
  parse(input: string): ParsedCommand | null;
}