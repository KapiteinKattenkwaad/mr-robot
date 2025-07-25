import { InputParser } from './InputParser';
import { ParsedCommand } from '../../application/commands/CommandFactory';

/**
 * Implementation of InputParser that uses regular expressions to parse input strings.
 * Supports standard robot commands (PLACE, MOVE, LEFT, RIGHT, REPORT) and can be extended.
 */
export class RegexInputParser implements InputParser {
  // Set of valid command types
  private readonly validCommandTypes: Set<string>;
  
  /**
   * Creates a new RegexInputParser with the specified valid command types.
   * @param validCommandTypes - Array of valid command types (e.g., ['PLACE', 'MOVE'])
   */
  constructor(validCommandTypes: string[] = ['PLACE', 'MOVE', 'LEFT', 'RIGHT', 'REPORT']) {
    this.validCommandTypes = new Set(validCommandTypes.map(cmd => cmd.toUpperCase()));
  }
  
  /**
   * Parses an input string into a structured command object.
   * @param input - The input string to parse
   * @returns ParsedCommand object if parsing succeeds, null otherwise
   */
  parse(input: string): ParsedCommand | null {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      return null;
    }

    const parts = trimmedInput.split(/\s+/);
    const commandType = parts[0].toUpperCase();

    // Check if this is a valid command type
    if (!this.validCommandTypes.has(commandType)) {
      return null;
    }

    // Handle PLACE command with special parameter parsing
    if (commandType === 'PLACE') {
      if (parts.length !== 2) {
        return null;
      }
      const placeParams = this.parsePlaceParameters(parts[1]);
      return placeParams ? { type: commandType, parameters: placeParams } : null;
    }

    // Handle other commands (should have no additional parameters)
    if (parts.length === 1) {
      return { type: commandType };
    }

    return null;
  }

  /**
   * Parses PLACE command parameters from format "x,y,direction".
   * @param paramString - The parameter string to parse (e.g., "1,2,NORTH")
   * @returns Parameter object if parsing succeeds, null otherwise
   */
  private parsePlaceParameters(paramString: string): Record<string, any> | null {
    const parts = paramString.split(',');
    if (parts.length !== 3) {
      return null;
    }

    // Validate that x and y are integers (not decimals)
    const xStr = parts[0].trim();
    const yStr = parts[1].trim();
    
    if (!/^-?\d+$/.test(xStr) || !/^-?\d+$/.test(yStr)) {
      return null;
    }

    const x = parseInt(xStr, 10);
    const y = parseInt(yStr, 10);
    const direction = parts[2].trim().toUpperCase();

    if (isNaN(x) || isNaN(y)) {
      return null;
    }

    if (!['NORTH', 'EAST', 'SOUTH', 'WEST'].includes(direction)) {
      return null;
    }

    return { x, y, direction };
  }
}