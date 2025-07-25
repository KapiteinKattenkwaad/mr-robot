import { Robot } from './Robot';
import { Direction, TableBounds } from './types';

describe('Robot Integration Tests', () => {
  let robot: Robot;
  let tableBounds: TableBounds;
  
  beforeEach(() => {
    tableBounds = { width: 5, height: 5 };
    robot = new Robot(tableBounds);
  });
  
  it('should place the robot at the given coordinates and direction', () => {
    const result = robot.place(2, 3, Direction.EAST);
    
    expect(result.success).toBe(true);
    expect(robot.getPosition()).toEqual({ x: 2, y: 3, direction: Direction.EAST });
  });
  
  it('should move the robot north', () => {
    robot.place(1, 1, Direction.NORTH);
    const result = robot.move();
    
    expect(result.success).toBe(true);
    expect(robot.getPosition()).toEqual({ x: 1, y: 2, direction: Direction.NORTH });
  });
  
  it('should move the robot east', () => {
    robot.place(1, 1, Direction.EAST);
    const result = robot.move();
    
    expect(result.success).toBe(true);
    expect(robot.getPosition()).toEqual({ x: 2, y: 1, direction: Direction.EAST });
  });
  
  it('should not move the robot outside the grid', () => {
    robot.place(4, 4, Direction.NORTH);
    const result = robot.move();
    
    expect(result.success).toBe(false);
    expect(robot.getPosition()).toEqual({ x: 4, y: 4, direction: Direction.NORTH });
  });
  
  it('should turn left from NORTH to WEST', () => {
    robot.place(2, 2, Direction.NORTH);
    const result = robot.turnLeft();
    
    expect(result.success).toBe(true);
    expect(robot.getPosition()?.direction).toBe(Direction.WEST);
  });
  
  it('should turn right from NORTH to EAST', () => {
    robot.place(2, 2, Direction.NORTH);
    const result = robot.turnRight();
    
    expect(result.success).toBe(true);
    expect(robot.getPosition()?.direction).toBe(Direction.EAST);
  });
  
  it('should check if a position is inside the grid', () => {
    // Place at valid position
    let result = robot.place(0, 0, Direction.NORTH);
    expect(result.success).toBe(true);
    
    // Place at valid position
    result = robot.place(4, 4, Direction.NORTH);
    expect(result.success).toBe(true);
    
    // Place at invalid positions
    result = robot.place(5, 0, Direction.NORTH);
    expect(result.success).toBe(false);
    
    result = robot.place(0, 5, Direction.NORTH);
    expect(result.success).toBe(false);
    
    result = robot.place(-1, 0, Direction.NORTH);
    expect(result.success).toBe(false);
    
    result = robot.place(0, -1, Direction.NORTH);
    expect(result.success).toBe(false);
  });
  
  it('ignores move that would fall off the grid', () => {
    robot.place(0, 0, Direction.SOUTH);
    const result = robot.move();
    
    expect(result.success).toBe(false);
    expect(robot.getPosition()).toEqual({ x: 0, y: 0, direction: Direction.SOUTH });
  });
  
  it('handles rapid sequence of valid and invalid commands', () => {
    robot.place(2, 2, Direction.NORTH);
    
    for (let i = 0; i < 1000; i++) {
      robot.move();
      robot.turnLeft();
      robot.turnRight();
    }
    
    const position = robot.getPosition();
    expect(position).not.toBeNull();
    expect(position!.x).toBeGreaterThanOrEqual(0);
    expect(position!.x).toBeLessThanOrEqual(4);
    expect(position!.y).toBeGreaterThanOrEqual(0);
    expect(position!.y).toBeLessThanOrEqual(4);
  });
  
  it('should not allow operations before robot is placed', () => {
    // Try to move before placing
    let result = robot.move();
    expect(result.success).toBe(false);
    expect(robot.getPosition()).toBeNull();
    
    // Try to turn left before placing
    result = robot.turnLeft();
    expect(result.success).toBe(false);
    expect(robot.getPosition()).toBeNull();
    
    // Try to turn right before placing
    result = robot.turnRight();
    expect(result.success).toBe(false);
    expect(robot.getPosition()).toBeNull();
  });
  
  it('should handle full movement sequence correctly', () => {
    // Place the robot
    robot.place(0, 0, Direction.NORTH);
    
    // Move forward
    robot.move();
    expect(robot.getPosition()).toEqual({ x: 0, y: 1, direction: Direction.NORTH });
    
    // Turn right
    robot.turnRight();
    expect(robot.getPosition()).toEqual({ x: 0, y: 1, direction: Direction.EAST });
    
    // Move forward twice
    robot.move();
    robot.move();
    expect(robot.getPosition()).toEqual({ x: 2, y: 1, direction: Direction.EAST });
    
    // Turn left
    robot.turnLeft();
    expect(robot.getPosition()).toEqual({ x: 2, y: 1, direction: Direction.NORTH });
    
    // Move forward
    robot.move();
    expect(robot.getPosition()).toEqual({ x: 2, y: 2, direction: Direction.NORTH });
  });
});