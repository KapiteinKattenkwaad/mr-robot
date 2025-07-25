import { ConsoleOutputFormatter } from './ConsoleOutputFormatter';
import { Direction } from '../../domain/types';
import chalk from 'chalk';

// Mock chalk to avoid ANSI color codes in tests
jest.mock('chalk', () => ({
  green: jest.fn((text) => `GREEN:${text}`),
  red: jest.fn((text) => `RED:${text}`),
  blue: jest.fn((text) => `BLUE:${text}`)
}));

describe('ConsoleOutputFormatter', () => {
  let formatter: ConsoleOutputFormatter;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('with colors enabled', () => {
    beforeEach(() => {
      formatter = new ConsoleOutputFormatter(true);
    });
    
    it('should format success message with green color', () => {
      const result = formatter.formatSuccess('Success message');
      expect(result).toBe('GREEN:Success message');
      expect(chalk.green).toHaveBeenCalledWith('Success message');
    });
    
    it('should format error message with red color', () => {
      const result = formatter.formatError('Error message');
      expect(result).toBe('RED:Error: Error message');
      expect(chalk.red).toHaveBeenCalledWith('Error: Error message');
    });
    
    it('should format report with blue color', () => {
      const position = { x: 1, y: 2, direction: Direction.NORTH };
      const result = formatter.formatReport(position);
      expect(result).toBe('BLUE:Output: 1,2,NORTH');
      expect(chalk.blue).toHaveBeenCalledWith('Output: 1,2,NORTH');
    });
  });
  
  describe('with colors disabled', () => {
    beforeEach(() => {
      formatter = new ConsoleOutputFormatter(false);
    });
    
    it('should format success message without color', () => {
      const result = formatter.formatSuccess('Success message');
      expect(result).toBe('Success message');
      expect(chalk.green).not.toHaveBeenCalled();
    });
    
    it('should format error message without color', () => {
      const result = formatter.formatError('Error message');
      expect(result).toBe('Error: Error message');
      expect(chalk.red).not.toHaveBeenCalled();
    });
    
    it('should format report without color', () => {
      const position = { x: 1, y: 2, direction: Direction.NORTH };
      const result = formatter.formatReport(position);
      expect(result).toBe('Output: 1,2,NORTH');
      expect(chalk.blue).not.toHaveBeenCalled();
    });
  });
});