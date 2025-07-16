
import readline from 'node:readline';

import { cliLog } from './components/cliLogger';
import { printGrid, moveForward, moveLeft, moveRight, findPlaceCoordinates } from './components/robotLogic';
import { isPlaceInputCorrect } from './util/validatePlaceInput';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'type-command> '
});

let isFirstTime = true

cliLog(' 🤖 Welcome to the Robot challenge! \n Please move the robot around the table without falling off. \n First, place your robot somewhere on the table using the command: \n \n PLACE (+ the location e.g. 1,2,east)');
// cliLog(' 🤖 Welcome to the Robot challenge! \n  \n Please move the robot around the table using the following commands:\n \n PLACE (+ the location e.g. 1,2,east)\n MOVE\n LEFT\n RIGHT\n \n Want to know where you are? Type: \n REPORT');
rl.prompt();


rl.on('line', (line) => {  
  const input = line.trim().toUpperCase();

  if (isFirstTime && !isPlaceInputCorrect(input)) {
    isPlaceInputCorrect(input) ? isFirstTime = false : cliLog('Your first move must be of the command Place. E.g. PLACE 1,2,EAST')
  } else if (isPlaceInputCorrect(input)) {
    isFirstTime = false
    cliLog('Great work! Now, move your robot around the table using the commands: \n \n MOVE\n LEFT\n RIGHT\n PLACE (+ the location e.g. 1,2,east) \n \n Want to know where you are? Type: \n REPORT')
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
    cliLog(`E.g. \n PLACE 1,2,EAST \n MOVE \n LEFT`, 'green')
  }

  rl.prompt();
});

rl.on('close', () => {
  cliLog('Goodbye! 👋')
  process.exit(0);
});
