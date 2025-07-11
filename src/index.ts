
import readline from 'node:readline';
import chalk from 'chalk';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'type-command> '
});

//initial spot for robot is south west corner (bottom left)

//first prompt has to be PLACE, if not ask until they prompt with PLACE

//MOVE function moves the robot one step forward in the direction it is currently facing

//LEFT and RIGHT will rotate the robot 90 degrees in the specified direction without changing the position of the robot.

//REPORT will announce the X,Y and orientation of the robot.

const logOutput = (text: string, colorText: 'blue' | 'green' | 'red' = 'blue') => {
  console.log(chalk[colorText](text));
}

logOutput('Welcome to the Robot walk!\n Please choose one of the follow commands:\n PLACE X Y F\n MOVE\n LEFT or RIGHT\n REPORT');
rl.prompt();


rl.on('line', (line) => {
  const input = line.trim().toUpperCase();

  switch (input) {
    case 'PLACE':
      logOutput('Hello place');
      break;
    case 'MOVE':
      logOutput('Hello move');
      break;
    case 'LEFT':
      logOutput('Hello left');
      break;
    case 'RIGHT':
      logOutput('Hello right');
      break;
    case 'REPORT':
      logOutput('Hello right');
      break;
    case 'exit':
      rl.close();
      return;
    default:
      logOutput(`Unknown command: "${input}"`, 'red')
      logOutput(`Example command: \n PLACE 1,2,EAST \n MOVE \n LEFT` , 'green')
  }

  rl.prompt();
});

rl.on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});
