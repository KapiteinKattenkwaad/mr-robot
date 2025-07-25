import { Direction, Position, TableBounds, Result } from './types';
import { RobotNotPlacedError, InvalidPositionError } from './errors';

export class Robot {
  private position: Position | null = null;
  private readonly tableBounds: TableBounds;

  constructor(tableBounds: TableBounds) {
    this.tableBounds = tableBounds;
  }

  /**
   * Places the robot at the specified position and direction on the table
   */
  place(x: number, y: number, direction: Direction): Result<void, string> {
    if (!this.isValidPosition(x, y)) {
      return {
        success: false,
        error: new InvalidPositionError(x, y).message
      };
    }

    this.position = { x, y, direction };
    return { success: true, data: undefined };
  }

  /**
   * Moves the robot one unit forward in the direction it is currently facing
   */
  move(): Result<void, string> {
    if (!this.isPlaced()) {
      return {
        success: false,
        error: new RobotNotPlacedError().message
      };
    }

    const currentPosition = this.position!;
    const newPosition = this.calculateNewPosition(currentPosition);

    if (!this.isValidPosition(newPosition.x, newPosition.y)) {
      return {
        success: false,
        error: `Cannot move to position (${newPosition.x}, ${newPosition.y}) - outside table bounds`
      };
    }

    this.position = newPosition;
    return { success: true, data: undefined };
  }

  /**
   * Rotates the robot 90 degrees to the left (counter-clockwise)
   */
  turnLeft(): Result<void, string> {
    if (!this.isPlaced()) {
      return {
        success: false,
        error: new RobotNotPlacedError().message
      };
    }

    const currentPosition = this.position!;
    const newDirection = this.getLeftDirection(currentPosition.direction);
    
    this.position = {
      ...currentPosition,
      direction: newDirection
    };

    return { success: true, data: undefined };
  }

  /**
   * Rotates the robot 90 degrees to the right (clockwise)
   */
  turnRight(): Result<void, string> {
    if (!this.isPlaced()) {
      return {
        success: false,
        error: new RobotNotPlacedError().message
      };
    }

    const currentPosition = this.position!;
    const newDirection = this.getRightDirection(currentPosition.direction);
    
    this.position = {
      ...currentPosition,
      direction: newDirection
    };

    return { success: true, data: undefined };
  }

  /**
   * Returns the current position of the robot, or null if not placed
   */
  getPosition(): Position | null {
    return this.position ? { ...this.position } : null;
  }

  /**
   * Returns true if the robot has been placed on the table
   */
  isPlaced(): boolean {
    return this.position !== null;
  }

  /**
   * Returns the table bounds for this robot
   */
  getTableBounds(): TableBounds {
    return { ...this.tableBounds };
  }

  private isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.tableBounds.width && 
           y >= 0 && y < this.tableBounds.height;
  }

  private calculateNewPosition(currentPosition: Position): Position {
    const { x, y, direction } = currentPosition;
    
    switch (direction) {
      case Direction.NORTH:
        return { x, y: y + 1, direction };
      case Direction.EAST:
        return { x: x + 1, y, direction };
      case Direction.SOUTH:
        return { x, y: y - 1, direction };
      case Direction.WEST:
        return { x: x - 1, y, direction };
      default:
        return currentPosition;
    }
  }

  private getLeftDirection(currentDirection: Direction): Direction {
    switch (currentDirection) {
      case Direction.NORTH:
        return Direction.WEST;
      case Direction.WEST:
        return Direction.SOUTH;
      case Direction.SOUTH:
        return Direction.EAST;
      case Direction.EAST:
        return Direction.NORTH;
      default:
        return currentDirection;
    }
  }

  private getRightDirection(currentDirection: Direction): Direction {
    switch (currentDirection) {
      case Direction.NORTH:
        return Direction.EAST;
      case Direction.EAST:
        return Direction.SOUTH;
      case Direction.SOUTH:
        return Direction.WEST;
      case Direction.WEST:
        return Direction.NORTH;
      default:
        return currentDirection;
    }
  }
}