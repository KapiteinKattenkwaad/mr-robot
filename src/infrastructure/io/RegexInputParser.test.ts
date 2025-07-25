import { RegexInputParser } from './RegexInputParser';

describe('RegexInputParser', () => {
  let parser: RegexInputParser;

  beforeEach(() => {
    parser = new RegexInputParser();
  });

  describe('parse', () => {
    it('should parse valid PLACE command', () => {
      const result = parser.parse('PLACE 1,2,NORTH');
      expect(result).toEqual({
        type: 'PLACE',
        parameters: { x: 1, y: 2, direction: 'NORTH' }
      });
    });

    it('should parse valid PLACE command with lowercase direction', () => {
      const result = parser.parse('PLACE 1,2,north');
      expect(result).toEqual({
        type: 'PLACE',
        parameters: { x: 1, y: 2, direction: 'NORTH' }
      });
    });

    it('should parse valid PLACE command with whitespace', () => {
      const result = parser.parse('  PLACE  1,2,NORTH  ');
      expect(result).toEqual({
        type: 'PLACE',
        parameters: { x: 1, y: 2, direction: 'NORTH' }
      });
    });

    it('should parse valid MOVE command', () => {
      const result = parser.parse('MOVE');
      expect(result).toEqual({ type: 'MOVE' });
    });

    it('should parse valid LEFT command', () => {
      const result = parser.parse('LEFT');
      expect(result).toEqual({ type: 'LEFT' });
    });

    it('should parse valid RIGHT command', () => {
      const result = parser.parse('RIGHT');
      expect(result).toEqual({ type: 'RIGHT' });
    });

    it('should parse valid REPORT command', () => {
      const result = parser.parse('REPORT');
      expect(result).toEqual({ type: 'REPORT' });
    });

    it('should return null for empty input', () => {
      const result = parser.parse('');
      expect(result).toBeNull();
    });

    it('should return null for whitespace input', () => {
      const result = parser.parse('   ');
      expect(result).toBeNull();
    });

    it('should return null for invalid command', () => {
      const result = parser.parse('INVALID');
      expect(result).toBeNull();
    });

    it('should return null for PLACE command with invalid parameters', () => {
      const result = parser.parse('PLACE 1,2');
      expect(result).toBeNull();
    });

    it('should return null for PLACE command with invalid coordinates', () => {
      const result = parser.parse('PLACE a,b,NORTH');
      expect(result).toBeNull();
    });

    it('should return null for PLACE command with invalid direction', () => {
      const result = parser.parse('PLACE 1,2,INVALID');
      expect(result).toBeNull();
    });

    it('should return null for command with extra parameters', () => {
      const result = parser.parse('MOVE EXTRA');
      expect(result).toBeNull();
    });

    it('should support custom command types', () => {
      const customParser = new RegexInputParser(['CUSTOM', 'MOVE']);
      
      expect(customParser.parse('CUSTOM')).toEqual({ type: 'CUSTOM' });
      expect(customParser.parse('MOVE')).toEqual({ type: 'MOVE' });
      expect(customParser.parse('LEFT')).toBeNull();
    });
  });
});