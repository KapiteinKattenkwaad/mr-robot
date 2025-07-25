import { Command } from './Command';
import { Robot } from '../../domain/Robot';
import { Direction, Result } from '../../domain/types';

/**
 * Command to place the robot at a specific position and direction on the table.
 * Validates coordinates and direction before placing the robot.
 */
export class PlaceCommand implements Command {
  constructor(
    private readonly robot: Robot,
    private readonly x: number,
    private readonly y: number,
    private readonly direction: Direction
  ) {}

  async execute(): Promise<Result<string, string>> {
    // Validate coordinates are non-negative integers
    if (!Number.isInteger(this.x) || !Number.isInteger(this.y)) {
      return {
        success: false,
        error: 'Coordinates must be integers'
      };
    }

    if (this.x < 0 || this.y < 0) {
      return {
        success: false,
        error: 'Coordinates must be non-negative'
      };
    }

    // Validate direction is a valid enum value
    if (!Object.values(Direction).includes(this.direction)) {
      return {
        success: false,
        error: `Invalid direction: ${this.direction}. Must be one of: ${Object.values(Direction).join(', ')}`
      };
    }

    // Attempt to place the robot
    const result = this.robot.place(this.x, this.y, this.direction);
    
    if (result.success) {
      return {
        success: true,
        data: `Robot placed at (${this.x}, ${this.y}) facing ${this.direction}`
      };
    } else {
      return {
        success: false,
        error: result.error
      };
    }
  }
}