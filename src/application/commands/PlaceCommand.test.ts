import { PlaceCommand } from './PlaceCommand';
import { Robot } from '../../domain/Robot';
import { Direction, TableBounds } from '../../domain/types';

describe('PlaceCommand', () => {
  let robot: Robot;
  let tableBounds: TableBounds;

  beforeEach(() => {
    tableBounds = { width: 5, height: 5 };
    robot = new Robot(tableBounds);
  });

  describe('execute', () => {
    it('should successfully place robot at valid position', async () => {
      const command = new PlaceCommand(robot, 1, 2, Direction.NORTH);
      const result = await command.execute();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Robot placed at (1, 2) facing NORTH');
      }
      
      const position = robot.getPosition();
      expect(position).toEqual({ x: 1, y: 2, direction: Direction.NORTH });
    });

    it('should successfully place robot at origin', async () => {
      const command = new PlaceCommand(robot, 0, 0, Direction.SOUTH);
      const result = await command.execute();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Robot placed at (0, 0) facing SOUTH');
      }
    });

    it('should successfully place robot at maximum valid position', async () => {
      const command = new PlaceCommand(robot, 4, 4, Direction.WEST);
      const result = await command.execute();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Robot placed at (4, 4) facing WEST');
      }
    });

    it('should fail when x coordinate is outside table bounds', async () => {
      const command = new PlaceCommand(robot, 5, 2, Direction.NORTH);
      const result = await command.execute();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Position (5, 2) is outside the table bounds');
      }
    });

    it('should fail when y coordinate is outside table bounds', async () => {
      const command = new PlaceCommand(robot, 2, 5, Direction.NORTH);
      const result = await command.execute();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Position (2, 5) is outside the table bounds');
      }
    });

    it('should fail when both coordinates are outside table bounds', async () => {
      const command = new PlaceCommand(robot, 10, 10, Direction.NORTH);
      const result = await command.execute();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Position (10, 10) is outside the table bounds');
      }
    });

    it('should fail when x coordinate is negative', async () => {
      const command = new PlaceCommand(robot, -1, 2, Direction.NORTH);
      const result = await command.execute();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Coordinates must be non-negative');
      }
    });

    it('should fail when y coordinate is negative', async () => {
      const command = new PlaceCommand(robot, 2, -1, Direction.NORTH);
      const result = await command.execute();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Coordinates must be non-negative');
      }
    });

    it('should fail when x coordinate is not an integer', async () => {
      const command = new PlaceCommand(robot, 1.5, 2, Direction.NORTH);
      const result = await command.execute();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Coordinates must be integers');
      }
    });

    it('should fail when y coordinate is not an integer', async () => {
      const command = new PlaceCommand(robot, 1, 2.7, Direction.NORTH);
      const result = await command.execute();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Coordinates must be integers');
      }
    });

    it('should work with all valid directions', async () => {
      const directions = [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST];
      
      for (const direction of directions) {
        const command = new PlaceCommand(robot, 1, 1, direction);
        const result = await command.execute();

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(`Robot placed at (1, 1) facing ${direction}`);
        }
        
        const position = robot.getPosition();
        expect(position?.direction).toBe(direction);
      }
    });

    it('should allow replacing robot position', async () => {
      // Place robot initially
      const firstCommand = new PlaceCommand(robot, 1, 1, Direction.NORTH);
      await firstCommand.execute();

      // Place robot at new position
      const secondCommand = new PlaceCommand(robot, 3, 3, Direction.SOUTH);
      const result = await secondCommand.execute();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Robot placed at (3, 3) facing SOUTH');
      }
      
      const position = robot.getPosition();
      expect(position).toEqual({ x: 3, y: 3, direction: Direction.SOUTH });
    });
  });
});