import { CLIApplication } from './CLIApplication';
import { RobotApplicationService } from '../application/RobotApplicationService';
import { InputReader } from '../infrastructure/io/InputReader';
import { OutputWriter } from '../infrastructure/io/OutputWriter';
import { OutputFormatter } from '../infrastructure/io/OutputFormatter';
import { Logger } from '../infrastructure/logging/Logger';
import { Result } from '../domain/types';
import * as ErrorHandling from '../infrastructure/io/ErrorHandling';

// Mock implementations
class MockInputReader implements InputReader {
  private inputs: string[] = [];
  private closed = false;
  private shouldThrowOnRead = false;
  private shouldThrowOnClose = false;
  
  constructor(inputs: string[] = [], options: { throwOnRead?: boolean; throwOnClose?: boolean } = {}) {
    this.inputs = [...inputs];
    this.shouldThrowOnRead = options.throwOnRead || false;
    this.shouldThrowOnClose = options.throwOnClose || false;
  }
  
  async readLine(): Promise<string> {
    if (this.closed) {
      throw new Error('Input reader is closed');
    }
    
    if (this.shouldThrowOnRead) {
      throw new Error('Simulated read error');
    }
    
    if (this.inputs.length === 0) {
      return '';
    }
    return this.inputs.shift() || '';
  }
  
  close(): void {
    if (this.shouldThrowOnClose) {
      throw new Error('Simulated close error');
    }
    this.closed = true;
  }
  
  isClosed(): boolean {
    return this.closed;
  }
  
  addInput(input: string): void {
    this.inputs.push(input);
  }
}

class MockOutputWriter implements OutputWriter {
  private outputs: string[] = [];
  private errors: string[] = [];
  private shouldThrowOnWrite = false;
  private shouldThrowOnWriteError = false;
  
  constructor(options: { throwOnWrite?: boolean; throwOnWriteError?: boolean } = {}) {
    this.shouldThrowOnWrite = options.throwOnWrite || false;
    this.shouldThrowOnWriteError = options.throwOnWriteError || false;
  }
  
  write(message: string): void {
    if (this.shouldThrowOnWrite) {
      throw new Error('Simulated write error');
    }
    this.outputs.push(message);
  }
  
  writeError(message: string): void {
    if (this.shouldThrowOnWriteError) {
      throw new Error('Simulated writeError error');
    }
    this.errors.push(message);
  }
  
  getOutputs(): string[] {
    return this.outputs;
  }
  
  getErrors(): string[] {
    return this.errors;
  }
  
  clear(): void {
    this.outputs = [];
    this.errors = [];
  }
}

class MockOutputFormatter implements OutputFormatter {
  private shouldThrowOnFormat = false;
  
  constructor(options: { throwOnFormat?: boolean } = {}) {
    this.shouldThrowOnFormat = options.throwOnFormat || false;
  }
  
  formatSuccess(message: string): string {
    if (this.shouldThrowOnFormat) {
      throw new Error('Simulated format error');
    }
    return `SUCCESS: ${message}`;
  }
  
  formatError(message: string): string {
    if (this.shouldThrowOnFormat) {
      throw new Error('Simulated format error');
    }
    return `ERROR: ${message}`;
  }
  
  formatReport(position: any): string {
    if (this.shouldThrowOnFormat) {
      throw new Error('Simulated format error');
    }
    return `REPORT: ${JSON.stringify(position)}`;
  }
}

class MockApplicationService implements RobotApplicationService {
  private commandResults: Map<string, Result<string, string>> = new Map();
  private executedCommands: string[] = [];
  
  constructor(commandResults: Record<string, Result<string, string>> = {}) {
    Object.entries(commandResults).forEach(([command, result]) => {
      this.commandResults.set(command, result);
    });
  }
  
  async executeCommand(input: string): Promise<Result<string, string>> {
    this.executedCommands.push(input);
    
    const result = this.commandResults.get(input);
    
    if (result) {
      return result;
    }
    
    return { success: true, data: `Executed: ${input}` };
  }
  
  getRobotState(): string {
    return 'Robot state';
  }
  
  getExecutedCommands(): string[] {
    return this.executedCommands;
  }
}

class MockLogger implements Logger {
  private logs: Array<{ level: string; message: string; meta?: any }> = [];
  
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
    return 'info';
  }
  
  setLevel(): void {
    // Not used in tests
  }
  
  getLogs(): Array<{ level: string; message: string; meta?: any }> {
    return this.logs;
  }
}

describe('CLIApplication', () => {
  let inputReader: MockInputReader;
  let outputWriter: MockOutputWriter;
  let outputFormatter: MockOutputFormatter;
  let applicationService: MockApplicationService;
  let logger: MockLogger;
  let cliApp: CLIApplication;
  
  beforeEach(() => {
    inputReader = new MockInputReader();
    outputWriter = new MockOutputWriter();
    outputFormatter = new MockOutputFormatter();
    applicationService = new MockApplicationService();
    logger = new MockLogger();
    
    cliApp = new CLIApplication(
      inputReader,
      outputWriter,
      outputFormatter,
      applicationService,
      logger
    );
    
    // Spy on error handling utilities to test their usage
    jest.spyOn(ErrorHandling, 'safeExecuteAsync');
    jest.spyOn(ErrorHandling, 'safeExecute');
    jest.spyOn(ErrorHandling, 'safeClose');
    jest.spyOn(ErrorHandling, 'isCriticalError');
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  describe('start', () => {
    it('should display welcome message on start', async () => {
      // Add EXIT command to stop the application
      inputReader.addInput('EXIT');
      
      await cliApp.start();
      
      const outputs = outputWriter.getOutputs();
      expect(outputs[0]).toContain('Welcome');
    });
    
    it('should process commands and display results', async () => {
      // Set up command results
      const commandResults: Record<string, Result<string, string>> = {
        'PLACE 1,1,NORTH': { success: true, data: 'Robot placed at (1,1) facing NORTH' },
        'MOVE': { success: true, data: 'Robot moved forward' },
        'LEFT': { success: true, data: 'Robot turned left' },
        'INVALID': { success: false, error: 'Invalid command' }
      };
      
      applicationService = new MockApplicationService(commandResults);
      
      cliApp = new CLIApplication(
        inputReader,
        outputWriter,
        outputFormatter,
        applicationService,
        logger
      );
      
      // Add commands to process
      inputReader.addInput('PLACE 1,1,NORTH');
      inputReader.addInput('MOVE');
      inputReader.addInput('LEFT');
      inputReader.addInput('INVALID');
      inputReader.addInput('EXIT');
      
      await cliApp.start();
      
      // Check that commands were executed
      const executedCommands = applicationService.getExecutedCommands();
      expect(executedCommands).toEqual(['PLACE 1,1,NORTH', 'MOVE', 'LEFT', 'INVALID']);
      
      // Check outputs
      const outputs = outputWriter.getOutputs();
      expect(outputs).toContainEqual('SUCCESS: Robot placed at (1,1) facing NORTH');
      expect(outputs).toContainEqual('SUCCESS: Robot moved forward');
      expect(outputs).toContainEqual('SUCCESS: Robot turned left');
      
      // Check errors
      const errors = outputWriter.getErrors();
      expect(errors).toContainEqual('ERROR: Invalid command');
    });
    
    it('should exit when EXIT command is received', async () => {
      inputReader.addInput('EXIT');
      
      await cliApp.start();
      
      // Check that the application exited
      expect(inputReader.isClosed()).toBe(true);
      
      // Check goodbye message
      const outputs = outputWriter.getOutputs();
      expect(outputs).toContainEqual('SUCCESS: Goodbye!');
    });
    
    it('should handle errors during command execution', async () => {
      // Create a mock application service that throws an error
      const throwingApplicationService: RobotApplicationService = {
        executeCommand: async () => {
          throw new Error('Command execution failed');
        },
        getRobotState: () => 'Robot state'
      };
      
      cliApp = new CLIApplication(
        inputReader,
        outputWriter,
        outputFormatter,
        throwingApplicationService,
        logger
      );
      
      // Add a command and then EXIT
      inputReader.addInput('COMMAND');
      inputReader.addInput('EXIT');
      
      await cliApp.start();
      
      // Check that error was logged
      const logs = logger.getLogs();
      expect(logs.some(log => 
        log.level === 'error' && 
        log.message.includes('Application error')
      )).toBe(true);
      
      // Check error output
      const errors = outputWriter.getErrors();
      expect(errors).toContainEqual(expect.stringContaining('An unexpected error occurred'));
    });
    
    it('should clean up resources on exit', async () => {
      inputReader.addInput('EXIT');
      
      await cliApp.start();
      
      // Check that input reader was closed
      expect(inputReader.isClosed()).toBe(true);
      
      // Check that cleanup was logged
      const logs = logger.getLogs();
      expect(logs.some(log => 
        log.level === 'info' && 
        log.message.includes('shutdown')
      )).toBe(true);
    });
  });
  
  describe('stop', () => {
    it('should stop the application', async () => {
      // Create a promise that resolves when start completes
      const startPromise = cliApp.start();
      
      // Stop the application
      cliApp.stop();
      
      // Wait for start to complete
      await startPromise;
      
      // Check that input reader was closed
      expect(inputReader.isClosed()).toBe(true);
    });
  });
  
  describe('error handling', () => {
    it('should handle errors when reading input', async () => {
      // Create a reader that throws on read
      inputReader = new MockInputReader([], { throwOnRead: true });
      
      cliApp = new CLIApplication(
        inputReader,
        outputWriter,
        outputFormatter,
        applicationService,
        logger
      );
      
      // Add EXIT command to stop the application after error
      inputReader.addInput('EXIT');
      
      await cliApp.start();
      
      // Check that error was handled
      expect(ErrorHandling.safeExecuteAsync).toHaveBeenCalled();
      
      // Check that error was logged
      const logs = logger.getLogs();
      expect(logs.some(log => 
        log.level === 'error' && 
        log.message.includes('Error reading input')
      )).toBe(true);
    });
    
    it('should handle errors when writing output', async () => {
      // Create a writer that throws on write
      outputWriter = new MockOutputWriter({ throwOnWrite: true });
      
      cliApp = new CLIApplication(
        inputReader,
        outputWriter,
        outputFormatter,
        applicationService,
        logger
      );
      
      // Add EXIT command to stop the application
      inputReader.addInput('EXIT');
      
      await cliApp.start();
      
      // Check that error was handled
      expect(ErrorHandling.safeExecuteAsync).toHaveBeenCalled();
      
      // Check that error was logged
      const logs = logger.getLogs();
      expect(logs.some(log => 
        log.level === 'warn' && 
        log.message.includes('Failed to display welcome message')
      )).toBe(true);
    });
    
    it('should handle errors when formatting output', async () => {
      // Create a formatter that throws on format
      outputFormatter = new MockOutputFormatter({ throwOnFormat: true });
      
      cliApp = new CLIApplication(
        inputReader,
        outputWriter,
        outputFormatter,
        applicationService,
        logger
      );
      
      // Add EXIT command to stop the application
      inputReader.addInput('EXIT');
      
      await cliApp.start();
      
      // Check that error was handled
      expect(ErrorHandling.safeExecuteAsync).toHaveBeenCalled();
      
      // Check that error was logged
      const logs = logger.getLogs();
      expect(logs.some(log => 
        log.message.includes('Failed to display welcome message')
      )).toBe(true);
    });
    
    it('should handle errors during cleanup', async () => {
      // Create a reader that throws on close
      inputReader = new MockInputReader([], { throwOnClose: true });
      
      cliApp = new CLIApplication(
        inputReader,
        outputWriter,
        outputFormatter,
        applicationService,
        logger
      );
      
      // Add EXIT command to stop the application
      inputReader.addInput('EXIT');
      
      await cliApp.start();
      
      // Check that safeClose was called
      expect(ErrorHandling.safeClose).toHaveBeenCalled();
      
      // Check that error was logged but didn't crash the application
      const logs = logger.getLogs();
      expect(logs.some(log => 
        log.level === 'error' && 
        log.message.includes('Error closing resource')
      )).toBe(true);
    });
    
    it('should detect and handle critical errors', async () => {
      // Mock isCriticalError to return true for our test error
      jest.spyOn(ErrorHandling, 'isCriticalError').mockImplementation((error) => {
        if (error instanceof Error && error.message.includes('critical')) {
          return true;
        }
        return false;
      });
      
      // Create a service that throws a critical error
      const criticalErrorService: RobotApplicationService = {
        executeCommand: async () => {
          throw new Error('This is a critical error');
        },
        getRobotState: () => 'Robot state'
      };
      
      cliApp = new CLIApplication(
        inputReader,
        outputWriter,
        outputFormatter,
        criticalErrorService,
        logger
      );
      
      // Add commands to process
      inputReader.addInput('COMMAND');
      inputReader.addInput('SHOULD_NOT_EXECUTE');
      
      await cliApp.start();
      
      // Check that isCriticalError was called
      expect(ErrorHandling.isCriticalError).toHaveBeenCalled();
      
      // Check that application exited after critical error
      const executedCommands = applicationService.getExecutedCommands();
      expect(executedCommands.length).toBeLessThanOrEqual(1);
      
      // Check that error was logged
      const logs = logger.getLogs();
      expect(logs.some(log => 
        log.level === 'error' && 
        log.message.includes('Critical error detected')
      )).toBe(true);
    });
    
    it('should use safeExecuteAsync for command execution', async () => {
      // Add a command and EXIT
      inputReader.addInput('TEST_COMMAND');
      inputReader.addInput('EXIT');
      
      await cliApp.start();
      
      // Verify safeExecuteAsync was called
      expect(ErrorHandling.safeExecuteAsync).toHaveBeenCalled();
      expect(applicationService.getExecutedCommands()).toContain('TEST_COMMAND');
    });
  });
});