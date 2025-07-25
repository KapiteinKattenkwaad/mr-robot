import { DefaultCommandFactory, CommandCreator, ParsedCommand } from './CommandFactory';
import { Command } from './Command';
import { Result, Direction, TableBounds } from '../../domain/types';
import { Robot } from '../../domain/Robot';
import { PlaceCommand } from './PlaceCommand';
import { MoveCommand } from './MoveCommand';
import { LeftCommand } from './LeftCommand';
import { RightCommand } from './RightCommand';
import { ReportCommand } from './ReportCommand';
import { InputParser } from '../../infrastructure/io/InputParser';

// Mock command implementation for testing
class MockCommand implements Command {
  constructor(private name: string, private params?: Record<string, any>) {}

  async execute(): Promise<Result<string, string>> {
    return { success: true, data: `${this.name} executed with ${JSON.stringify(this.params)}` };
  }
}

// Mock input parser for testing
class MockInputParser implements InputParser {
  constructor(private parsedResult: ParsedCommand | null = null) {}

  parse(input: string): ParsedCommand | null {
    if (this.parsedResult) {
      return this.parsedResult;
    }

    // Simple parsing logic for testing
    const trimmedInput = input.trim().toUpperCase();
    if (!trimmedInput) {
      return null;
    }

    if (trimmedInput === 'MOVE' || trimmedInput === 'LEFT' || 
        trimmedInput === 'RIGHT' || trimmedInput === 'REPORT' || 
        trimmedInput === 'TEST' || trimmedInput === 'CUSTOM' ||
        trimmedInput === 'CMD1' || trimmedInput === 'CMD2' ||
        trimmedInput === 'THROWING') {
      return { type: trimmedInput };
    }

    if (trimmedInput.startsWith('PLACE ')) {
      const match = trimmedInput.match(/PLACE (\d+),(\d+),(NORTH|EAST|SOUTH|WEST)/i);
      if (match) {
        return {
          type: 'PLACE',
          parameters: {
            x: parseInt(match[1], 10),
            y: parseInt(match[2], 10),
            direction: match[3].toUpperCase()
          }
        };
      }
    }

    return null;
  }
}

describe('DefaultCommandFactory', () => {
  let factory: DefaultCommandFactory;
  let mockInputParser: MockInputParser;

  beforeEach(() => {
    mockInputParser = new MockInputParser();
    factory = new DefaultCommandFactory(mockInputParser);
  });

  describe('Command Registration', () => {
    it('should register and create commands', () => {
      const mockCreator: CommandCreator = (params) => new MockCommand('TEST', params);
      factory.registerCommand('TEST', mockCreator);

      const command = factory.createCommand('TEST');
      expect(command).toBeInstanceOf(MockCommand);
    });

    it('should handle case-insensitive command registration', () => {
      const mockCreator: CommandCreator = () => new MockCommand('TEST');
      factory.registerCommand('test', mockCreator);

      const command = factory.createCommand('TEST');
      expect(command).toBeInstanceOf(MockCommand);
    });

    it('should allow overriding existing command registrations', () => {
      const creator1: CommandCreator = () => new MockCommand('FIRST');
      const creator2: CommandCreator = () => new MockCommand('SECOND');

      factory.registerCommand('TEST', creator1);
      factory.registerCommand('TEST', creator2);

      const command = factory.createCommand('TEST') as MockCommand;
      expect(command).toBeInstanceOf(MockCommand);
    });
  });

  describe('Command Creation', () => {
    beforeEach(() => {
      // Register mock creators for standard commands
      factory.registerCommand('MOVE', () => new MockCommand('MOVE'));
      factory.registerCommand('LEFT', () => new MockCommand('LEFT'));
      factory.registerCommand('RIGHT', () => new MockCommand('RIGHT'));
      factory.registerCommand('REPORT', () => new MockCommand('REPORT'));
      factory.registerCommand('PLACE', (params) => new MockCommand('PLACE', params));
    });

    it('should create simple commands without parameters', () => {
      expect(factory.createCommand('MOVE')).toBeInstanceOf(MockCommand);
      expect(factory.createCommand('LEFT')).toBeInstanceOf(MockCommand);
      expect(factory.createCommand('RIGHT')).toBeInstanceOf(MockCommand);
      expect(factory.createCommand('REPORT')).toBeInstanceOf(MockCommand);
    });

    it('should create PLACE command with valid parameters', () => {
      const command = factory.createCommand('PLACE 1,2,NORTH');
      expect(command).toBeInstanceOf(MockCommand);
    });

    it('should use the input parser to parse commands', () => {
      // Create a mock parser that always returns a specific result
      const specificParser = new MockInputParser({ 
        type: 'CUSTOM', 
        parameters: { foo: 'bar' } 
      });
      
      const specificFactory = new DefaultCommandFactory(specificParser);
      specificFactory.registerCommand('CUSTOM', (params) => new MockCommand('CUSTOM', params));
      
      // The input doesn't matter, the parser will always return the same result
      const command = specificFactory.createCommand('anything');
      expect(command).toBeInstanceOf(MockCommand);
    });
  });

  describe('Error Handling', () => {
    it('should return null when parser returns null', () => {
      // Create a mock parser that always returns null
      const nullParser = new MockInputParser(null);
      const nullFactory = new DefaultCommandFactory(nullParser);
      
      expect(nullFactory.createCommand('ANYTHING')).toBeNull();
    });

    it('should return null for unregistered commands', () => {
      // Parser will return a valid command, but it's not registered
      const specificParser = new MockInputParser({ type: 'UNKNOWN' });
      const specificFactory = new DefaultCommandFactory(specificParser);
      
      const command = specificFactory.createCommand('UNKNOWN');
      expect(command).toBeNull();
    });

    it('should return null when command creator throws error', () => {
      const throwingCreator: CommandCreator = () => {
        throw new Error('Creation failed');
      };
      factory.registerCommand('THROWING', throwingCreator);

      const command = factory.createCommand('THROWING');
      expect(command).toBeNull();
    });
  });

  describe('Extensibility', () => {
    it('should support custom command types', () => {
      const customCreator: CommandCreator = (params) => new MockCommand('CUSTOM', params);
      factory.registerCommand('CUSTOM', customCreator);

      const command = factory.createCommand('CUSTOM');
      expect(command).toBeInstanceOf(MockCommand);
    });

    it('should maintain separate registrations for different command types', () => {
      factory.registerCommand('CMD1', () => new MockCommand('CMD1'));
      factory.registerCommand('CMD2', () => new MockCommand('CMD2'));

      expect(factory.createCommand('CMD1')).toBeInstanceOf(MockCommand);
      expect(factory.createCommand('CMD2')).toBeInstanceOf(MockCommand);
      expect(factory.createCommand('CMD3')).toBeNull();
    });
  });

  describe('createWithDefaultCommands', () => {
    let robot: Robot;
    let tableBounds: TableBounds;
    let inputParser: MockInputParser;

    beforeEach(() => {
      tableBounds = { width: 5, height: 5 };
      robot = new Robot(tableBounds);
      inputParser = new MockInputParser();
    });

    it('should create factory with all standard commands registered', () => {
      const factory = DefaultCommandFactory.createWithDefaultCommands(robot, inputParser);
      
      // Test that all standard commands are registered
      expect(factory.createCommand('PLACE 1,1,NORTH')).toBeInstanceOf(PlaceCommand);
      expect(factory.createCommand('MOVE')).toBeInstanceOf(MoveCommand);
      expect(factory.createCommand('LEFT')).toBeInstanceOf(LeftCommand);
      expect(factory.createCommand('RIGHT')).toBeInstanceOf(RightCommand);
      expect(factory.createCommand('REPORT')).toBeInstanceOf(ReportCommand);
    });

    it('should create commands that use the provided robot instance', async () => {
      const factory = DefaultCommandFactory.createWithDefaultCommands(robot, inputParser);
      
      // Place the robot
      const placeCommand = factory.createCommand('PLACE 2,2,NORTH');
      expect(placeCommand).toBeInstanceOf(PlaceCommand);
      await placeCommand!.execute();
      
      // Verify robot state was updated
      expect(robot.getPosition()).toEqual({ x: 2, y: 2, direction: Direction.NORTH });
      
      // Move the robot
      const moveCommand = factory.createCommand('MOVE');
      expect(moveCommand).toBeInstanceOf(MoveCommand);
      await moveCommand!.execute();
      
      // Verify robot position was updated
      expect(robot.getPosition()).toEqual({ x: 2, y: 3, direction: Direction.NORTH });
    });

    it('should reject invalid commands', () => {
      // Create a parser that always returns null for specific inputs
      const nullParser = new MockInputParser(null);
      const factory = DefaultCommandFactory.createWithDefaultCommands(robot, nullParser);
      
      expect(factory.createCommand('INVALID')).toBeNull();
      expect(factory.createCommand('PLACE INVALID')).toBeNull();
      expect(factory.createCommand('PLACE 1,1,INVALID')).toBeNull();
    });
  });
});