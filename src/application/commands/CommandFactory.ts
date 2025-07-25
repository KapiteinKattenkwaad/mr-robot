import { Command } from './Command';
import { Robot } from '../../domain/Robot';
import { Direction } from '../../domain/types';
import { PlaceCommand } from './PlaceCommand';
import { MoveCommand } from './MoveCommand';
import { LeftCommand } from './LeftCommand';
import { RightCommand } from './RightCommand';
import { ReportCommand } from './ReportCommand';
import { InputParser } from '../../infrastructure/io/InputParser';
import { safeExecute } from '../../infrastructure/io/ErrorHandling';

/**
 * Function type for creating commands from parsed parameters.
 */
export type CommandCreator = (parameters?: Record<string, any>) => Command;

/**
 * Parsed command structure containing type and optional parameters.
 */
export interface ParsedCommand {
  type: string;
  parameters?: Record<string, any>;
}

/**
 * Factory interface for creating commands from input strings.
 * Supports extensibility by allowing registration of new command creators.
 */
export interface CommandFactory {
  /**
   * Creates a command from the given input string.
   * @param input - The input string to parse and create a command from
   * @returns Command instance if input is valid, null otherwise
   */
  createCommand(input: string): Command | null;

  /**
   * Registers a command creator for a specific command type.
   * @param commandType - The command type identifier (e.g., 'PLACE', 'MOVE')
   * @param creator - Function that creates a command from parsed parameters
   */
  registerCommand(commandType: string, creator: CommandCreator): void;
}

/**
 * Default implementation of CommandFactory with extensible command registry.
 * Uses an InputParser to parse input strings into command objects.
 */
export class DefaultCommandFactory implements CommandFactory {
  private commandRegistry = new Map<string, CommandCreator>();
  private inputParser: InputParser;

  /**
   * Creates a new DefaultCommandFactory with the specified input parser.
   * @param inputParser - The input parser to use for parsing input strings
   */
  constructor(inputParser: InputParser) {
    this.inputParser = inputParser;
  }

  /**
   * Creates a new DefaultCommandFactory and registers standard commands.
   * @param robot - The robot instance to use for command execution
   * @param inputParser - The input parser to use for parsing input strings
   */
  static createWithDefaultCommands(robot: Robot, inputParser: InputParser): DefaultCommandFactory {
    const factory = new DefaultCommandFactory(inputParser);
    
    // Register standard commands
    factory.registerCommand('PLACE', (params) => {
      if (!params || typeof params.x !== 'number' || typeof params.y !== 'number' || !params.direction) {
        throw new Error('Invalid PLACE parameters');
      }
      return new PlaceCommand(robot, params.x, params.y, params.direction as Direction);
    });
    
    factory.registerCommand('MOVE', () => new MoveCommand(robot));
    factory.registerCommand('LEFT', () => new LeftCommand(robot));
    factory.registerCommand('RIGHT', () => new RightCommand(robot));
    factory.registerCommand('REPORT', () => new ReportCommand(robot));
    
    return factory;
  }

  /**
   * Creates a command from input string by parsing and delegating to registered creators.
   */
  createCommand(input: string): Command | null {
    // Safely parse the input
    const parsedCommand = safeExecute(
      () => this.inputParser.parse(input),
      { defaultValue: null }
    );
    
    if (!parsedCommand) {
      return null;
    }

    const creator = this.commandRegistry.get(parsedCommand.type.toUpperCase());
    if (!creator) {
      return null;
    }

    // Safely create the command
    const result = safeExecute(
      () => creator(parsedCommand.parameters),
      { defaultValue: null }
    );
    
    return result || null;
  }

  /**
   * Registers a command creator for the specified command type.
   */
  registerCommand(commandType: string, creator: CommandCreator): void {
    this.commandRegistry.set(commandType.toUpperCase(), creator);
  }
}