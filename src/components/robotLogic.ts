import { ROWS, COLS, Direction, PLACE_ERROR, IN_GRID_ERROR, PLACE_COORDINATES_REGEX } from "../constants";
import { position } from "../state/STATE";
import { cliLog } from "./cliLogger";
import { isPlaceInputCorrect } from "../util/validatePlaceInput";

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
            position.direction = 'WEST'
            break;
        case 'EAST':
            position.direction = 'NORTH'
            break;
        case 'SOUTH':
            position.direction = 'EAST'
            break;
        case 'WEST':
            position.direction = 'SOUTH'
            break;
        default:
            position.direction = 'NORTH'
    }
}

export const moveRight = (): void => {
    switch (position.direction) {
        case 'NORTH':
            position.direction = 'EAST'
            break;
        case 'EAST':
            position.direction = 'SOUTH'
            break;
        case 'SOUTH':
            position.direction = 'WEST'
            break;
        case 'WEST':
            position.direction = 'NORTH'
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
        position.row = newRow;
        position.col = newCol;
        position.direction = position.direction;
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
        const newRow = parseInt(match[1], 10);
        const newCol = parseInt(match[2], 10);
        const newDirection = match[3].toUpperCase();

        if (isInsideGrid(newRow, newCol)) {
            position.row = newRow;
            position.col = newCol;
            position.direction = newDirection;
        } else {
            cliLog(IN_GRID_ERROR, 'red');
        }
    } else {
        cliLog(PLACE_ERROR + ' or turn mr.robot with left or right', 'red');
    }
}

export const placeOnGrid = (row: number, col: number, direction: Direction) => {
    position.row = row;
    position.col = col;
    position.direction = direction
}

