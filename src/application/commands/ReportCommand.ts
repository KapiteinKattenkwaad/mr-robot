import { Command } from './Command';
import { Robot } from '../../domain/Robot';
import { Result } from '../../domain/types';

/**
 * Command to report the current position and direction of the robot.
 * Returns an error if the robot has not been placed.
 */
export class ReportCommand implements Command {
  constructor(private readonly robot: Robot) {}

  async execute(): Promise<Result<string, string>> {
    // Check if robot is placed
    if (!this.robot.isPlaced()) {
      return {
        success: false,
        error: 'Robot has not been placed on the table yet'
      };
    }

    // Get the current position
    const position = this.robot.getPosition()!;
    
    return {
      success: true,
      data: `Output: ${position.x},${position.y},${position.direction}`
    };
  }
}