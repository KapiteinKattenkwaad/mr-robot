
import readline from 'node:readline';

import { cliLog } from './components/cliLogger';
import { printGrid, moveForward, moveLeft, moveRight, findPlaceCoordinates } from './components/robotLogic';
import { isPlaceInputCorrect } from './util/testPlace';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'type-command> '
});

let isFirstTime = true

cliLog('🤖 Welcome to the Robot walk! \n Please choose one of the follow commands:\n PLACE X,Y F\n MOVE\n LEFT or RIGHT\n REPORT \nE.g.: \n PLACE 1,2,EAST');
rl.prompt();


rl.on('line', (line) => {
  const input = line.trim().toUpperCase();

  if (isFirstTime && !isPlaceInputCorrect(input)) {
    isPlaceInputCorrect(input) ? isFirstTime = false : cliLog('Your first move must be of the command Place. E.g.: PLACE 1,2,EAST')
  } else if (isPlaceInputCorrect(input)) {
    isFirstTime = false
    findPlaceCoordinates(input)
  } else if (input === 'MOVE') {
    moveForward()
  } else if (input === 'LEFT') {
    moveLeft()
  } else if (input === 'RIGHT') {
    moveRight()
  } else if (input === 'REPORT') {
    printGrid()
  } else if (input === 'EXIT') {
    rl.close();
  } else {
    cliLog(`Unknown command: "${input}"`, 'red')
    cliLog(`E.g.: \n PLACE 1,2,EAST \n MOVE \n LEFT`, 'green')
  }

  rl.prompt();
});

rl.on('close', () => {
  cliLog('Goodbye! 👋')
  process.exit(0);
});
