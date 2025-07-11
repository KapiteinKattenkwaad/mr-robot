import { ROWS, COLS, Direction, PLACE_ERROR, IN_GRID_ERROR, DIRECTIONS } from "../constants";
import { logOutput } from "./log";

export let position = { row: 4, col: 0, direction: 'NORTH' };

export const printGrid = (): void => {
    for (let r = 0; r < ROWS; r++) {
        let line = '';
        for (let c = 0; c < COLS; c++) {
            line += (r === position.row && c === position.col) ? '[X]' : '[ ]';
        }
        console.log(line);
    }
    console.log(`You are at (${position.row}, ${position.col})`);
}

export const moveLeft = (): void => {
    switch (position.direction) {
        case 'NORTH':
            position = { row: position.row, col: position.col, direction: 'WEST' }
            break;
        case 'EAST':
            position = { row: position.row, col: position.col, direction: 'NORTH' }
            break;
        case 'SOUTH':
            position = { row: position.row, col: position.col, direction: 'EAST' }
            break;
        case 'WEST':
            position = { row: position.row, col: position.col, direction: 'SOUTH' }
            break;
        default:
            position.direction = 'NORTH'
    }

    logOutput(position.direction, 'green')

}

export const moveRight = (): void => {

    switch (position.direction) {
        case 'NORTH':
            position = { row: position.row, col: position.col, direction: 'EAST' }
            break;
        case 'EAST':
            position = { row: position.row, col: position.col, direction: 'SOUTH' }
            break;
        case 'SOUTH':
            position = { row: position.row, col: position.col, direction: 'WEST' }
            break;
        case 'WEST':
            position = { row: position.row, col: position.col, direction: 'NORTH' }
            break;
        default:
            position.direction = 'NORTH'
    }

    logOutput(position.direction, 'green')
}

const moveInDirection = () => {
    switch (position.direction) {
        case 'NORTH':
            position = { row: position.row -1, col: position.col, direction: position.direction }
            break;
        case 'EAST':
            position = { row: position.row, col: position.col + 1, direction: position.direction }
            break;
        case 'SOUTH':
            position = { row: position.row + 1, col: position.col, direction: position.direction }
            break;
        case 'WEST':
            position = { row: position.row, col: position.col - 1, direction: position.direction }
            break;
        default:
            position = { row: position.row, col: position.col, direction: position.direction }    
    }
}

export const moveUp = (): void => {
    if (isInsideGrid(position.row, position.col)) {
        moveInDirection()
        logOutput(position.direction, 'green')

    } else {
        logOutput(IN_GRID_ERROR, 'red');
    }
}

export const isInsideGrid = (row: number, col: number): boolean => {
    console.log(row >= 0 && col >= 0)
    return row >= 0 && row < ROWS && col >= 0 && col < COLS;
}

export const findPlaceCoordinates = (text: string) => {
    // Regex explanation:
    // ^\s*         : Start of string, optional whitespace
    // (\w+)        : First word 
    // \s+          : One or more spaces
    // (\d+),(\d+)  : Two numbers separated by a comma (coordinates)
    // \s+          : One or more spaces
    // (\w+)        : Last word (direction)
    const match = text.match(/^\s*(\w+)\s+(\d+),(\d+)\s+(\w+)/);

    if (match) {
        const row = parseInt(match[2]); // 0
        const col = parseInt(match[3]); // 0
        const direction = match[4];   // "north"

        if (isInsideGrid(row, col)) {
            position = { row, col, direction }
        } else {
            logOutput(IN_GRID_ERROR, 'red')
        }
    } else {
        logOutput(PLACE_ERROR, 'red');
    }
}

export const placeOnGrid = (row: number, col: number, direction: Direction) => {
    position = { row, col, direction }
}

