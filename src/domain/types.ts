export enum Direction {
  NORTH = 'NORTH',
  EAST = 'EAST',
  SOUTH = 'SOUTH',
  WEST = 'WEST'
}

export interface Position {
  readonly x: number;
  readonly y: number;
  readonly direction: Direction;
}

export interface TableBounds {
  readonly width: number;
  readonly height: number;
}

export type Result<T, E> = 
  | { success: true; data: T }
  | { success: false; error: E };