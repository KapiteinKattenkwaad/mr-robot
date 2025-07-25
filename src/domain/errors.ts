export abstract class DomainError extends Error {
  abstract readonly code: string;
}

export class RobotNotPlacedError extends DomainError {
  readonly code = 'ROBOT_NOT_PLACED';
  
  constructor() {
    super('Robot must be placed on the table before it can move');
  }
}

export class InvalidPositionError extends DomainError {
  readonly code = 'INVALID_POSITION';
  
  constructor(x: number, y: number) {
    super(`Position (${x}, ${y}) is outside the table bounds`);
  }
}

export class InvalidCommandError extends DomainError {
  readonly code = 'INVALID_COMMAND';
  
  constructor(command: string) {
    super(`Invalid command: ${command}`);
  }
}