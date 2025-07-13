
import readline from 'node:readline';

import { logOutput } from './components/log';
import { printGrid, moveUp, moveLeft, moveRight, findPlaceCoordinates } from './components/grid';
import { isPlaceInputCorrect } from './util/testPlace';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'type-command> '
});

let isFirstTime = true


logOutput('Welcome to the Robot walk!\n Please choose one of the follow commands:\n PLACE X,Y F\n MOVE\n LEFT or RIGHT\n REPORT \nE.g.: \n PLACE 1,2,EAST');
rl.prompt();


rl.on('line', (line) => {
  const input = line.trim().toUpperCase();

  if (isFirstTime && !isPlaceInputCorrect(input)) {
    isPlaceInputCorrect(input) ? isFirstTime = false : logOutput('Your first move must be of the command Place. E.g.: PLACE 1,2,EAST')
  } else if (isPlaceInputCorrect(input)) {
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
