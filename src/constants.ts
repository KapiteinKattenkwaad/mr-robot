export const ROWS = 5
export const COLS = 5
export type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';
export const DIRECTIONS: Direction[] = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

export const PLACE_ERROR = "You must provide a coordinate and a direction. E.g.: 0,0 NORTH"
export const IN_GRID_ERROR = "You are outise of the grid, make sure your coordinates are between 0 and 4"