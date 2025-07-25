import { Command } from './Command';
import { Robot } from '../../domain/Robot';
import { Result } from '../../domain/types';

/**
 * Command to move the robot one unit forward in the direction it is facing.
 * Validates that the robot is placed and the move is within table bounds.
 */
export class MoveCommand implements Command {
  constructor(private readonly robot: Robot) {}

  async execute(): Promise<Result<string, string>> {
    // Check if robot is placed
    if (!this.robot.isPlaced()) {
      return {
        success: false,
        error: 'Robot must be placed on the table before it can move'
      };
    }

    // Attempt to move the robot
    const result = this.robot.move();
    
    if (result.success) {
      const position = this.robot.getPosition()!;
      return {
        success: true,
        data: `Robot moved to (${position.x}, ${position.y}) facing ${position.direction}`
      };
    } else {
      return {
        success: false,
        error: result.error
      };
    }
  }
}