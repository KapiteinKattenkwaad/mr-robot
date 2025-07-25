import { RightCommand } from './RightCommand';
import { PlaceCommand } from './PlaceCommand';
import { Robot } from '../../domain/Robot';
import { Direction, TableBounds } from '../../domain/types';

describe('RightCommand', () => {
  let robot: Robot;
  let tableBounds: TableBounds;

  beforeEach(() => {
    tableBounds = { width: 5, height: 5 };
    robot = new Robot(tableBounds);
  });

  describe('execute', () => {
    it('should fail when robot is not placed', async () => {
      const command = new RightCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Robot must be placed on the table before it can turn');
      }
    });

    it('should turn robot from NORTH to EAST', async () => {
      // Place robot
      await new PlaceCommand(robot, 2, 2, Direction.NORTH).execute();
      
      // Turn robot right
      const command = new RightCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Robot turned right, now facing EAST');
      }
      
      const position = robot.getPosition();
      expect(position).toEqual({ x: 2, y: 2, direction: Direction.EAST });
    });

    it('should turn robot from EAST to SOUTH', async () => {
      // Place robot
      await new PlaceCommand(robot, 2, 2, Direction.EAST).execute();
      
      // Turn robot right
      const command = new RightCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Robot turned right, now facing SOUTH');
      }
      
      const position = robot.getPosition();
      expect(position).toEqual({ x: 2, y: 2, direction: Direction.SOUTH });
    });

    it('should turn robot from SOUTH to WEST', async () => {
      // Place robot
      await new PlaceCommand(robot, 2, 2, Direction.SOUTH).execute();
      
      // Turn robot right
      const command = new RightCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Robot turned right, now facing WEST');
      }
      
      const position = robot.getPosition();
      expect(position).toEqual({ x: 2, y: 2, direction: Direction.WEST });
    });

    it('should turn robot from WEST to NORTH', async () => {
      // Place robot
      await new PlaceCommand(robot, 2, 2, Direction.WEST).execute();
      
      // Turn robot right
      const command = new RightCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Robot turned right, now facing NORTH');
      }
      
      const position = robot.getPosition();
      expect(position).toEqual({ x: 2, y: 2, direction: Direction.NORTH });
    });

    it('should complete a full 360-degree rotation', async () => {
      // Place robot
      await new PlaceCommand(robot, 2, 2, Direction.NORTH).execute();
      
      const command = new RightCommand(robot);
      
      // First turn: NORTH -> EAST
      await command.execute();
      expect(robot.getPosition()?.direction).toBe(Direction.EAST);
      
      // Second turn: EAST -> SOUTH
      await command.execute();
      expect(robot.getPosition()?.direction).toBe(Direction.SOUTH);
      
      // Third turn: SOUTH -> WEST
      await command.execute();
      expect(robot.getPosition()?.direction).toBe(Direction.WEST);
      
      // Fourth turn: WEST -> NORTH (back to original)
      await command.execute();
      expect(robot.getPosition()?.direction).toBe(Direction.NORTH);
    });
  });
});