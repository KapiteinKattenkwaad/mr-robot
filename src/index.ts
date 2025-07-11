
import readline from 'node:readline';

import { logOutput } from './components/log';
import { PLACE_ERROR } from './constants'
import { printGrid, moveUp, moveLeft, moveRight, findPlaceCoordinates } from './components/grid';
import { testPlace } from './util/testPlace';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'type-command> '
});

let isFirstTime = true

//initial spot for robot is south west corner (bottom left)

//first prompt has to be PLACE, if not ask until they prompt with PLACE

//MOVE function moves the robot one step forward in the direction it is currently facing

//LEFT and RIGHT will rotate the robot 90 degrees in the specified direction without changing the position of the robot.

//REPORT will announce the X,Y and orientation of the robot.

logOutput('Welcome to the Robot walk!\n Please choose one of the follow commands:\n PLACE X,Y F\n MOVE\n LEFT or RIGHT\n REPORT \nE.g.: \n PLACE 1,2,EAST');
rl.prompt();


rl.on('line', (line) => {
  const input = line.trim().toUpperCase();

  if (isFirstTime) {
    if (testPlace(input)) {
      isFirstTime = false
    } else {
      logOutput('Your first move must be of the command Place. E.g.: PLACE 1,2,EAST')
    }
  } else if (testPlace(input)) {

    findPlaceCoordinates(input)
    printGrid()
  } else if (input === 'MOVE') {
    moveUp()
  } else if (input === 'LEFT') {
    moveLeft()
  } else if (input === 'RIGHT') {
    moveRight()
  } else if (input === 'REPORT') {
    printGrid()
  } else if (input === 'EXIT') {
    rl.close();
  } else {
    logOutput(`Unknown command: "${input}"`, 'red')
    logOutput(`E.g.: \n PLACE 1,2,EAST \n MOVE \n LEFT`, 'green')
  }

  rl.prompt();
});

rl.on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});
