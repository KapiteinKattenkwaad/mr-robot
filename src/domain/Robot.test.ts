import { Robot } from './Robot';
import { Direction, TableBounds } from './types';

describe('Robot', () => {
  let robot: Robot;
  let tableBounds: TableBounds;

  beforeEach(() => {
    tableBounds = { width: 5, height: 5 };
    robot = new Robot(tableBounds);
  });

  describe('constructor', () => {
    it('should create a robot with the specified table bounds', () => {
      const bounds = robot.getTableBounds();
      expect(bounds).toEqual(tableBounds);
    });

    it('should create a robot that is not initially placed', () => {
      expect(robot.isPlaced()).toBe(false);
      expect(robot.getPosition()).toBeNull();
    });
  });

  describe('place', () => {
    it('should place robot at valid position', () => {
      const result = robot.place(1, 1, Direction.NORTH);
      
      expect(result.success).toBe(true);
      expect(robot.isPlaced()).toBe(true);
      expect(robot.getPosition()).toEqual({
        x: 1,
        y: 1,
        direction: Direction.NORTH
      });
    });

    it('should place robot at table boundaries', () => {
      // Test all corners
      const corners = [
        { x: 0, y: 0, direction: Direction.NORTH },
        { x: 4, y: 0, direction: Direction.EAST },
        { x: 4, y: 4, direction: Direction.SOUTH },
        { x: 0, y: 4, direction: Direction.WEST }
      ];

      corners.forEach(({ x, y, direction }) => {
        const result = robot.place(x, y, direction);
        expect(result.success).toBe(true);
        expect(robot.getPosition()).toEqual({ x, y, direction });
      });
    });

    it('should reject placement outside table bounds', () => {
      const invalidPositions = [
        { x: -1, y: 0 },
        { x: 0, y: -1 },
        { x: 5, y: 0 },
        { x: 0, y: 5 },
        { x: -1, y: -1 },
        { x: 5, y: 5 }
      ];

      invalidPositions.forEach(({ x, y }) => {
        const result = robot.place(x, y, Direction.NORTH);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toContain('outside the table bounds');
        }
        expect(robot.isPlaced()).toBe(false);
      });
    });

    it('should allow re-placing robot at different position', () => {
      robot.place(1, 1, Direction.NORTH);
      const result = robot.place(3, 3, Direction.SOUTH);
      
      expect(result.success).toBe(true);
      expect(robot.getPosition()).toEqual({
        x: 3,
        y: 3,
        direction: Direction.SOUTH
      });
    });
  });

  describe('move', () => {
    it('should not move robot that is not placed', () => {
      const result = robot.move();
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Robot must be placed');
      }
      expect(robot.isPlaced()).toBe(false);
    });

    it('should move robot north', () => {
      robot.place(2, 2, Direction.NORTH);
      const result = robot.move();
      
      expect(result.success).toBe(true);
      expect(robot.getPosition()).toEqual({
        x: 2,
        y: 3,
        direction: Direction.NORTH
      });
    });

    it('should move robot east', () => {
      robot.place(2, 2, Direction.EAST);
      const result = robot.move();
      
      expect(result.success).toBe(true);
      expect(robot.getPosition()).toEqual({
        x: 3,
        y: 2,
        direction: Direction.EAST
      });
    });

    it('should move robot south', () => {
      robot.place(2, 2, Direction.SOUTH);
      const result = robot.move();
      
      expect(result.success).toBe(true);
      expect(robot.getPosition()).toEqual({
        x: 2,
        y: 1,
        direction: Direction.SOUTH
      });
    });

    it('should move robot west', () => {
      robot.place(2, 2, Direction.WEST);
      const result = robot.move();
      
      expect(result.success).toBe(true);
      expect(robot.getPosition()).toEqual({
        x: 1,
        y: 2,
        direction: Direction.WEST
      });
    });

    it('should prevent movement outside table bounds', () => {
      const boundaryTests = [
        { x: 0, y: 4, direction: Direction.NORTH }, // Top edge
        { x: 4, y: 0, direction: Direction.EAST },  // Right edge
        { x: 0, y: 0, direction: Direction.SOUTH }, // Bottom edge
        { x: 0, y: 0, direction: Direction.WEST }   // Left edge
      ];

      boundaryTests.forEach(({ x, y, direction }) => {
        robot.place(x, y, direction);
        const result = robot.move();
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toContain('outside table bounds');
        }
        // Robot should remain at original position
        expect(robot.getPosition()).toEqual({ x, y, direction });
      });
    });

    it('should allow multiple moves within bounds', () => {
      robot.place(0, 0, Direction.NORTH);
      
      // Move north 4 times (should succeed)
      for (let i = 1; i <= 4; i++) {
        const result = robot.move();
        expect(result.success).toBe(true);
        expect(robot.getPosition()?.y).toBe(i);
      }
      
      // Fifth move should fail (would go to y=5, outside bounds)
      const finalResult = robot.move();
      expect(finalResult.success).toBe(false);
      expect(robot.getPosition()?.y).toBe(4); // Should remain at y=4
    });
  });

  describe('turnLeft', () => {
    it('should not turn robot that is not placed', () => {
      const result = robot.turnLeft();
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Robot must be placed');
      }
    });

    it('should turn left from all directions', () => {
      const turnTests = [
        { from: Direction.NORTH, to: Direction.WEST },
        { from: Direction.WEST, to: Direction.SOUTH },
        { from: Direction.SOUTH, to: Direction.EAST },
        { from: Direction.EAST, to: Direction.NORTH }
      ];

      turnTests.forEach(({ from, to }) => {
        robot.place(2, 2, from);
        const result = robot.turnLeft();
        
        expect(result.success).toBe(true);
        expect(robot.getPosition()?.direction).toBe(to);
        expect(robot.getPosition()?.x).toBe(2); // Position should not change
        expect(robot.getPosition()?.y).toBe(2);
      });
    });

    it('should complete full rotation with four left turns', () => {
      robot.place(2, 2, Direction.NORTH);
      
      // Four left turns should return to original direction
      for (let i = 0; i < 4; i++) {
        const result = robot.turnLeft();
        expect(result.success).toBe(true);
      }
      
      expect(robot.getPosition()?.direction).toBe(Direction.NORTH);
    });
  });

  describe('turnRight', () => {
    it('should not turn robot that is not placed', () => {
      const result = robot.turnRight();
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Robot must be placed');
      }
    });

    it('should turn right from all directions', () => {
      const turnTests = [
        { from: Direction.NORTH, to: Direction.EAST },
        { from: Direction.EAST, to: Direction.SOUTH },
        { from: Direction.SOUTH, to: Direction.WEST },
        { from: Direction.WEST, to: Direction.NORTH }
      ];

      turnTests.forEach(({ from, to }) => {
        robot.place(2, 2, from);
        const result = robot.turnRight();
        
        expect(result.success).toBe(true);
        expect(robot.getPosition()?.direction).toBe(to);
        expect(robot.getPosition()?.x).toBe(2); // Position should not change
        expect(robot.getPosition()?.y).toBe(2);
      });
    });

    it('should complete full rotation with four right turns', () => {
      robot.place(2, 2, Direction.NORTH);
      
      // Four right turns should return to original direction
      for (let i = 0; i < 4; i++) {
        const result = robot.turnRight();
        expect(result.success).toBe(true);
      }
      
      expect(robot.getPosition()?.direction).toBe(Direction.NORTH);
    });
  });

  describe('getPosition', () => {
    it('should return null when robot is not placed', () => {
      expect(robot.getPosition()).toBeNull();
    });

    it('should return copy of position when robot is placed', () => {
      robot.place(1, 2, Direction.EAST);
      const position = robot.getPosition();
      
      expect(position).toEqual({
        x: 1,
        y: 2,
        direction: Direction.EAST
      });
      
      // Verify it's a copy, not a reference
      if (position) {
        (position as any).x = 999;
        expect(robot.getPosition()?.x).toBe(1); // Original should be unchanged
      }
    });
  });

  describe('isPlaced', () => {
    it('should return false when robot is not placed', () => {
      expect(robot.isPlaced()).toBe(false);
    });

    it('should return true when robot is placed', () => {
      robot.place(0, 0, Direction.NORTH);
      expect(robot.isPlaced()).toBe(true);
    });
  });

  describe('getTableBounds', () => {
    it('should return copy of table bounds', () => {
      const bounds = robot.getTableBounds();
      
      expect(bounds).toEqual(tableBounds);
      
      // Verify it's a copy, not a reference
      (bounds as any).width = 999;
      expect(robot.getTableBounds().width).toBe(5); // Original should be unchanged
    });
  });

  describe('integration scenarios', () => {
    it('should handle complex movement sequence', () => {
      // Place robot and perform a series of moves
      robot.place(1, 1, Direction.NORTH);
      
      // Move north
      expect(robot.move().success).toBe(true);
      expect(robot.getPosition()).toEqual({ x: 1, y: 2, direction: Direction.NORTH });
      
      // Turn right and move east
      expect(robot.turnRight().success).toBe(true);
      expect(robot.move().success).toBe(true);
      expect(robot.getPosition()).toEqual({ x: 2, y: 2, direction: Direction.EAST });
      
      // Turn right and move south
      expect(robot.turnRight().success).toBe(true);
      expect(robot.move().success).toBe(true);
      expect(robot.getPosition()).toEqual({ x: 2, y: 1, direction: Direction.SOUTH });
      
      // Turn right and move west
      expect(robot.turnRight().success).toBe(true);
      expect(robot.move().success).toBe(true);
      expect(robot.getPosition()).toEqual({ x: 1, y: 1, direction: Direction.WEST });
    });

    it('should handle edge case movements near boundaries', () => {
      // Place robot at corner and test boundary conditions
      robot.place(4, 4, Direction.NORTH);
      
      // Try to move north (should fail)
      expect(robot.move().success).toBe(false);
      expect(robot.getPosition()).toEqual({ x: 4, y: 4, direction: Direction.NORTH });
      
      // Turn and try to move east (should fail)
      robot.turnRight();
      expect(robot.move().success).toBe(false);
      expect(robot.getPosition()).toEqual({ x: 4, y: 4, direction: Direction.EAST });
      
      // Turn to face valid direction and move
      robot.turnRight(); // Now facing south
      expect(robot.move().success).toBe(true);
      expect(robot.getPosition()).toEqual({ x: 4, y: 3, direction: Direction.SOUTH });
    });
  });
});