import { moveForward, moveLeft, moveRight, placeOnGrid, isInsideGrid, position } from './robotLogic';

//what to test
//first time of user
//input place is correct
// report shows the x y and direction
// move function moves up correctly
// left and right function moves to the correct direction
// place places correctly

// integration test: whole simulation of input and output (use test scenarios from md)

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
});