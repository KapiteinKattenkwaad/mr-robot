import chalk from 'chalk';

export const cliLog = (text: string, colorText: 'blue' | 'green' | 'red' = 'blue') => {
    console.log(chalk[colorText](text));
}