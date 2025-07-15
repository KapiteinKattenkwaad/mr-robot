import { ROWS, COLS, Direction, PLACE_ERROR, IN_GRID_ERROR, PLACE_COORDINATES_REGEX } from "../constants";
import { cliLog } from "./cliLogger";
import { isPlaceInputCorrect } from "../util/testPlace";

export let position = { row: 4, col: 0, direction: 'NORTH' };

export const printGrid = (): void => {
    for (let r = 0; r < ROWS; r++) {
        let line = '';
        for (let c = 0; c < COLS; c++) {
            line += (r === position.row && c === position.col) ? '[X]' : '[ ]';
        }
    }
    cliLog(`You are at (X: ${position.row}, Y: ${position.col}, Direction: ${position.direction})`, 'blue');
}

export const isInsideGrid = (row: number, col: number): boolean => {
    return row >= 0 && row < ROWS && col >= 0 && col < COLS;
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
}

export const moveForward = (): void => {
    let newRow = position.row;
    let newCol = position.col;

    switch (position.direction) {
        case 'NORTH':
            newCol += 1;
            break;
        case 'EAST':
            newRow += 1;
            break;
        case 'SOUTH':
            newCol -= 1;
            break;
        case 'WEST':
            newRow -= 1;
            break;
    }

    if (isInsideGrid(newRow, newCol)) {
        position = { row: newRow, col: newCol, direction: position.direction };
    } else {
        cliLog(IN_GRID_ERROR, 'red');
    }
};

export const findPlaceCoordinates = (text: string) => {
    if (!isPlaceInputCorrect(text)) {
        cliLog(PLACE_ERROR, 'red');
        return;
    }

    const match = text.match(PLACE_COORDINATES_REGEX);
    if (match) {
        const row = parseInt(match[1], 10);
        const col = parseInt(match[2], 10);
        const direction = match[3].toUpperCase();

        if (isInsideGrid(row, col)) {
            position = { row, col, direction };
        } else {
            cliLog(IN_GRID_ERROR, 'red');
        }
    } else {
        cliLog(PLACE_ERROR + ' or turn mr.robot with left or right', 'red');
    }
}

export const placeOnGrid = (row: number, col: number, direction: Direction) => {
    position = { row, col, direction }
}

