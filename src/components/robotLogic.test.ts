import { moveForward, moveLeft, moveRight, placeOnGrid, isInsideGrid, position, printGrid } from './robotLogic';

describe('Robot grid logic', () => {
  beforeEach(() => {
    // Reset position to initial 
    placeOnGrid(4, 0, 'NORTH');
  });

  it('should place the robot at the given coordinates and direction', () => {
    placeOnGrid(2, 3, 'EAST');
    expect(position).toEqual({ row: 2, col: 3, direction: 'EAST' });
  });

  it('should move the robot north (col + 1)', () => {
    placeOnGrid(1, 1, 'NORTH');
    moveForward();
    expect(position).toEqual({ row: 1, col: 2, direction: 'NORTH' });
  });

  it('should move the robot east (row + 1)', () => {
    placeOnGrid(1, 1, 'EAST');
    moveForward();
    expect(position).toEqual({ row: 2, col: 1, direction: 'EAST' });
  });

  it('should not move the robot outside the grid', () => {
    placeOnGrid(4, 4, 'NORTH');
    moveForward();
    expect(position).toEqual({ row: 4, col: 4, direction: 'NORTH' });
  });

  it('should turn left from NORTH to WEST', () => {
    placeOnGrid(2, 2, 'NORTH');
    moveLeft();
    expect(position.direction).toBe('WEST');
  });

  it('should turn right from NORTH to EAST', () => {
    placeOnGrid(2, 2, 'NORTH');
    moveRight();
    expect(position.direction).toBe('EAST');
  });

  it('should check if a position is inside the grid', () => {
    expect(isInsideGrid(0, 0)).toBe(true);
    expect(isInsideGrid(4, 4)).toBe(true);
    expect(isInsideGrid(5, 0)).toBe(false);
    expect(isInsideGrid(0, 5)).toBe(false);
    expect(isInsideGrid(-1, 0)).toBe(false);
    expect(isInsideGrid(0, -1)).toBe(false);
  });

  it('ignores move that would fall off the grid', () => {
    placeOnGrid(0, 0, 'SOUTH'); 
    moveForward();
    expect(position).toEqual({ row: 0, col: 0, direction: 'SOUTH' });
  });

  it('handles rapid sequence of valid and invalid commands', () => {
    for (let i = 0; i < 1000; i++) {
      moveForward();
      moveLeft();
      moveRight();
    }
    expect(position.row).toBeGreaterThanOrEqual(0);
    expect(position.row).toBeLessThanOrEqual(4);
    expect(position.col).toBeGreaterThanOrEqual(0);
    expect(position.col).toBeLessThanOrEqual(4);
  });

});