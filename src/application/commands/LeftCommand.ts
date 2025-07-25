import { Command } from './Command';
import { Robot } from '../../domain/Robot';
import { Result } from '../../domain/types';

/**
 * Command to rotate the robot 90 degrees to the left (counter-clockwise).
 * Validates that the robot is placed before executing.
 */
export class LeftCommand implements Command {
  constructor(private readonly robot: Robot) {}

  async execute(): Promise<Result<string, string>> {
    // Check if robot is placed
    if (!this.robot.isPlaced()) {
      return {
        success: false,
        error: 'Robot must be placed on the table before it can turn'
      };
    }

    // Attempt to turn the robot left
    const result = this.robot.turnLeft();
    
    if (result.success) {
      const position = this.robot.getPosition()!;
      return {
        success: true,
        data: `Robot turned left, now facing ${position.direction}`
      };
    } else {
      return {
        success: false,
        error: result.error
      };
    }
  }
}