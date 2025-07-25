import { RobotApplicationServiceImpl } from './RobotApplicationService';
import { Robot } from '../domain/Robot';
import { DefaultCommandFactory } from './commands/CommandFactory';
import { RegexInputParser } from '../infrastructure/io/RegexInputParser';
import { ConsoleLogger } from '../infrastructure/logging/Logger';
import { Direction, TableBounds } from '../domain/types';

describe('RobotApplicationService Integration Tests', () => {
  let robot: Robot;
  let commandFactory: DefaultCommandFactory;
  let inputParser: RegexInputParser;
  let logger: ConsoleLogger;
  let service: RobotApplicationServiceImpl;
  
  beforeEach(() => {
    const tableBounds: TableBounds = { width: 5, height: 5 };
    robot = new Robot(tableBounds);
    inputParser = new RegexInputParser();
    commandFactory = DefaultCommandFactory.createWithDefaultCommands(robot, inputParser);
    logger = new ConsoleLogger('info', false);
    service = new RobotApplicationServiceImpl(robot, commandFactory, logger);
  });
  
  it('should execute PLACE command successfully', async () => {
    const result = await service.executeCommand('PLACE 2,3,NORTH');
    
    expect(result.success).toBe(true);
    expect(robot.getPosition()).toEqual({ x: 2, y: 3, direction: Direction.NORTH });
  });
  
  it('should execute MOVE command successfully', async () => {
    await service.executeCommand('PLACE 2,2,NORTH');
    const result = await service.executeCommand('MOVE');
    
    expect(result.success).toBe(true);
    expect(robot.getPosition()).toEqual({ x: 2, y: 3, direction: Direction.NORTH });
  });
  
  it('should execute LEFT command successfully', async () => {
    await service.executeCommand('PLACE 2,2,NORTH');
    const result = await service.executeCommand('LEFT');
    
    expect(result.success).toBe(true);
    expect(robot.getPosition()?.direction).toBe(Direction.WEST);
  });
  
  it('should execute RIGHT command successfully', async () => {
    await service.executeCommand('PLACE 2,2,NORTH');
    const result = await service.executeCommand('RIGHT');
    
    expect(result.success).toBe(true);
    expect(robot.getPosition()?.direction).toBe(Direction.EAST);
  });
  
  it('should execute REPORT command successfully', async () => {
    await service.executeCommand('PLACE 2,2,NORTH');
    const result = await service.executeCommand('REPORT');
    
    expect(result.success).toBe(true);
    expect(result.success && result.data).toContain('2');
    expect(result.success && result.data).toContain('NORTH');
  });
  
  it('should handle invalid commands', async () => {
    const result = await service.executeCommand('INVALID');
    
    expect(result.success).toBe(false);
    expect(!result.success && result.error).toContain('Invalid command');
  });
  
  it('should handle commands before robot is placed', async () => {
    const result = await service.executeCommand('MOVE');
    
    expect(result.success).toBe(false);
    expect(!result.success && result.error).toContain('placed');
  });
  
  it('should handle invalid PLACE parameters', async () => {
    const result = await service.executeCommand('PLACE 5,5,NORTH');
    
    expect(result.success).toBe(false);
    expect(!result.success && result.error).toContain('outside');
  });
  
  it('should handle a sequence of commands', async () => {
    await service.executeCommand('PLACE 0,0,NORTH');
    await service.executeCommand('MOVE');
    await service.executeCommand('RIGHT');
    await service.executeCommand('MOVE');
    await service.executeCommand('LEFT');
    const result = await service.executeCommand('REPORT');
    
    expect(result.success).toBe(true);
    expect(robot.getPosition()).toEqual({ x: 1, y: 1, direction: Direction.NORTH });
  });
  
  it('should get robot state correctly', () => {
    // Before placing
    expect(service.getRobotState()).toContain('not been placed');
    
    // After placing
    service.executeCommand('PLACE 2,3,EAST');
    expect(service.getRobotState()).toContain('(2, 3)');
    expect(service.getRobotState()).toContain('EAST');
  });
});