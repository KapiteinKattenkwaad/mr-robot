import { MoveCommand } from './MoveCommand';
import { PlaceCommand } from './PlaceCommand';
import { Robot } from '../../domain/Robot';
import { Direction, TableBounds } from '../../domain/types';

describe('MoveCommand', () => {
  let robot: Robot;
  let tableBounds: TableBounds;

  beforeEach(() => {
    tableBounds = { width: 5, height: 5 };
    robot = new Robot(tableBounds);
  });

  describe('execute', () => {
    it('should fail when robot is not placed', async () => {
      const command = new MoveCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Robot must be placed on the table before it can move');
      }
    });

    it('should successfully move robot north', async () => {
      // Place robot
      await new PlaceCommand(robot, 2, 2, Direction.NORTH).execute();
      
      // Move robot
      const command = new MoveCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Robot moved to (2, 3) facing NORTH');
      }
      
      const position = robot.getPosition();
      expect(position).toEqual({ x: 2, y: 3, direction: Direction.NORTH });
    });

    it('should successfully move robot east', async () => {
      // Place robot
      await new PlaceCommand(robot, 2, 2, Direction.EAST).execute();
      
      // Move robot
      const command = new MoveCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Robot moved to (3, 2) facing EAST');
      }
      
      const position = robot.getPosition();
      expect(position).toEqual({ x: 3, y: 2, direction: Direction.EAST });
    });

    it('should successfully move robot south', async () => {
      // Place robot
      await new PlaceCommand(robot, 2, 2, Direction.SOUTH).execute();
      
      // Move robot
      const command = new MoveCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Robot moved to (2, 1) facing SOUTH');
      }
      
      const position = robot.getPosition();
      expect(position).toEqual({ x: 2, y: 1, direction: Direction.SOUTH });
    });

    it('should successfully move robot west', async () => {
      // Place robot
      await new PlaceCommand(robot, 2, 2, Direction.WEST).execute();
      
      // Move robot
      const command = new MoveCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Robot moved to (1, 2) facing WEST');
      }
      
      const position = robot.getPosition();
      expect(position).toEqual({ x: 1, y: 2, direction: Direction.WEST });
    });

    it('should fail when move would place robot outside north boundary', async () => {
      // Place robot at north edge
      await new PlaceCommand(robot, 2, 4, Direction.NORTH).execute();
      
      // Try to move robot
      const command = new MoveCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('outside table bounds');
      }
      
      // Position should remain unchanged
      const position = robot.getPosition();
      expect(position).toEqual({ x: 2, y: 4, direction: Direction.NORTH });
    });

    it('should fail when move would place robot outside east boundary', async () => {
      // Place robot at east edge
      await new PlaceCommand(robot, 4, 2, Direction.EAST).execute();
      
      // Try to move robot
      const command = new MoveCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('outside table bounds');
      }
      
      // Position should remain unchanged
      const position = robot.getPosition();
      expect(position).toEqual({ x: 4, y: 2, direction: Direction.EAST });
    });

    it('should fail when move would place robot outside south boundary', async () => {
      // Place robot at south edge
      await new PlaceCommand(robot, 2, 0, Direction.SOUTH).execute();
      
      // Try to move robot
      const command = new MoveCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('outside table bounds');
      }
      
      // Position should remain unchanged
      const position = robot.getPosition();
      expect(position).toEqual({ x: 2, y: 0, direction: Direction.SOUTH });
    });

    it('should fail when move would place robot outside west boundary', async () => {
      // Place robot at west edge
      await new PlaceCommand(robot, 0, 2, Direction.WEST).execute();
      
      // Try to move robot
      const command = new MoveCommand(robot);
      const result = await command.execute();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('outside table bounds');
      }
      
      // Position should remain unchanged
      const position = robot.getPosition();
      expect(position).toEqual({ x: 0, y: 2, direction: Direction.WEST });
    });
  });
});