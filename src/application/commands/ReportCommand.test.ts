import { ReportCommand } from './ReportCommand';
import { PlaceCommand } from './PlaceCommand';
import { Robot } from '../../domain/Robot';
import { Direction, TableBounds } from '../../domain/types';

describe('ReportCommand', () => {
  let robot: Robot;
  let tableBounds: TableBounds;

  beforeEach(() => {
    tableBounds = { width: 5, height: 5 };
    robot = new Robot(tableBounds);
  });

  describe('execute', () => {
    it('should fail when robot is not placed', async () => {
      const command = new ReportCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Robot has not been placed on the table yet');
      }
    });

    it('should report robot position correctly', async () => {
      // Place robot
      await new PlaceCommand(robot, 2, 3, Direction.NORTH).execute();
      
      // Report robot position
      const command = new ReportCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Output: 2,3,NORTH');
      }
    });

    it('should report updated position after movement', async () => {
      // Place robot
      await new PlaceCommand(robot, 0, 0, Direction.NORTH).execute();
      
      // Manually move the robot using the Robot class
      robot.move();
      
      // Report robot position
      const command = new ReportCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Output: 0,1,NORTH');
      }
    });

    it('should report updated direction after turning', async () => {
      // Place robot
      await new PlaceCommand(robot, 1, 1, Direction.NORTH).execute();
      
      // Manually turn the robot using the Robot class
      robot.turnRight();
      
      // Report robot position
      const command = new ReportCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Output: 1,1,EAST');
      }
    });

    it('should report position at table boundaries', async () => {
      // Place robot at maximum position
      await new PlaceCommand(robot, 4, 4, Direction.SOUTH).execute();
      
      // Report robot position
      const command = new ReportCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Output: 4,4,SOUTH');
      }
    });
  });
});