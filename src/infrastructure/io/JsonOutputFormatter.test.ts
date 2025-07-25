import { JsonOutputFormatter } from './JsonOutputFormatter';
import { Direction } from '../../domain/types';

describe('JsonOutputFormatter', () => {
  let formatter: JsonOutputFormatter;
  
  beforeEach(() => {
    formatter = new JsonOutputFormatter();
  });
  
  describe('formatSuccess', () => {
    it('should format success message as JSON', () => {
      const message = 'Operation successful';
      const result = formatter.formatSuccess(message);
      
      const parsed = JSON.parse(result);
      expect(parsed).toEqual({
        status: 'success',
        message: 'Operation successful'
      });
    });
  });
  
  describe('formatError', () => {
    it('should format error message as JSON', () => {
      const message = 'Operation failed';
      const result = formatter.formatError(message);
      
      const parsed = JSON.parse(result);
      expect(parsed).toEqual({
        status: 'error',
        message: 'Operation failed'
      });
    });
  });
  
  describe('formatReport', () => {
    it('should format robot position as JSON', () => {
      const position = { x: 2, y: 3, direction: Direction.NORTH };
      const result = formatter.formatReport(position);
      
      const parsed = JSON.parse(result);
      expect(parsed).toEqual({
        status: 'success',
        position: {
          x: 2,
          y: 3,
          direction: Direction.NORTH
        }
      });
    });
  });
});