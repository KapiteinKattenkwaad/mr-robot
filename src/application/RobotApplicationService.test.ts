import { RobotApplicationServiceImpl } from './RobotApplicationService';
import { Robot } from '../domain/Robot';
import { CommandFactory } from './commands/CommandFactory';
import { Logger } from '../infrastructure/logging/Logger';
import { Command } from './commands/Command';
import { Direction, Result, TableBounds } from '../domain/types';

// Mock command for testing
class MockCommand implements Command {
  constructor(
    private result: Result<string, string>
  ) {}

  async execute(): Promise<Result<string, string>> {
    return this.result;
  }
}

// Mock command factory for testing
class MockCommandFactory implements CommandFactory {
  private commandToReturn: Command | null = null;
  private lastInput: string | null = null;

  setCommandToReturn(command: Command | null): void {
    this.commandToReturn = command;
  }

  getLastInput(): string | null {
    return this.lastInput;
  }

  createCommand(input: string): Command | null {
    this.lastInput = input;
    return this.commandToReturn;
  }

  registerCommand(): void {
    // Not used in tests
  }
}

// Mock logger for testing
class MockLogger implements Logger {
  private logs: Array<{ level: string; message: string; meta?: any }> = [];

  getLogs(): Array<{ level: string; message: string; meta?: any }> {
    return this.logs;
  }

  debug(message: string, meta?: any): void {
    this.logs.push({ level: 'debug', message, meta });
  }

  info(message: string, meta?: any): void {
    this.logs.push({ level: 'info', message, meta });
  }

  warn(message: string, meta?: any): void {
    this.logs.push({ level: 'warn', message, meta });
  }

  error(message: string, error?: Error): void {
    this.logs.push({ level: 'error', message, meta: error });
  }

  getLevel(): 'debug' | 'info' | 'warn' | 'error' {
    return 'debug';
  }

  setLevel(): void {
    // Not used in tests
  }
}

describe('RobotApplicationService', () => {
  let robot: Robot;
  let commandFactory: MockCommandFactory;
  let logger: MockLogger;
  let service: RobotApplicationServiceImpl;

  beforeEach(() => {
    const tableBounds: TableBounds = { width: 5, height: 5 };
    robot = new Robot(tableBounds);
    commandFactory = new MockCommandFactory();
    logger = new MockLogger();
    service = new RobotApplicationServiceImpl(robot, commandFactory, logger);
  });

  describe('executeCommand', () => {
    it('should execute valid commands and return success result', async () => {
      const successCommand = new MockCommand({
        success: true,
        data: 'Command executed successfully'
      });
      
      commandFactory.setCommandToReturn(successCommand);
      
      const result = await service.executeCommand('VALID COMMAND');
      
      expect(result.success).toBe(true);
      expect(result.success && result.data).toBe('Command executed successfully');
      expect(commandFactory.getLastInput()).toBe('VALID COMMAND');
      
      // Check that appropriate logs were created
      const logs = logger.getLogs();
      expect(logs.some(log => 
        log.level === 'debug' && 
        log.message.includes('Executing command')
      )).toBe(true);
      expect(logs.some(log => 
        log.level === 'debug' && 
        log.message.includes('Command executed successfully')
      )).toBe(true);
    });

    it('should handle invalid commands and return error result', async () => {
      commandFactory.setCommandToReturn(null);
      
      const result = await service.executeCommand('INVALID COMMAND');
      
      expect(result.success).toBe(false);
      expect(!result.success && result.error).toContain('Invalid command');
      expect(commandFactory.getLastInput()).toBe('INVALID COMMAND');
      
      // Check that appropriate logs were created
      const logs = logger.getLogs();
      expect(logs.some(log => 
        log.level === 'warn' && 
        log.message.includes('Invalid command')
      )).toBe(true);
    });

    it('should handle command execution failures', async () => {
      const failureCommand = new MockCommand({
        success: false,
        error: 'Command execution failed'
      });
      
      commandFactory.setCommandToReturn(failureCommand);
      
      const result = await service.executeCommand('FAILING COMMAND');
      
      expect(result.success).toBe(false);
      expect(!result.success && result.error).toBe('Command execution failed');
      
      // Check that appropriate logs were created
      const logs = logger.getLogs();
      expect(logs.some(log => 
        log.level === 'warn' && 
        log.message.includes('Command execution failed')
      )).toBe(true);
    });

    it('should handle exceptions during command execution', async () => {
      const throwingCommand: Command = {
        execute: async () => {
          throw new Error('Execution error');
        }
      };
      
      commandFactory.setCommandToReturn(throwingCommand);
      
      const result = await service.executeCommand('THROWING COMMAND');
      
      expect(result.success).toBe(false);
      expect(!result.success && result.error).toContain('An error occurred while executing the command');
      
      // Check that appropriate logs were created
      const logs = logger.getLogs();
      expect(logs.some(log => 
        log.level === 'error' && 
        log.message.includes('Error executing command')
      )).toBe(true);
    });
  });

  describe('getRobotState', () => {
    it('should return message when robot is not placed', () => {
      const state = service.getRobotState();
      expect(state).toContain('not been placed');
    });

    it('should return robot position when robot is placed', () => {
      robot.place(2, 3, Direction.NORTH);
      const state = service.getRobotState();
      expect(state).toContain('(2, 3)');
      expect(state).toContain('NORTH');
    });
  });
});