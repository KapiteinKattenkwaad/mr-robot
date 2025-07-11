import chalk from 'chalk';

export const logOutput = (text: string, colorText: 'blue' | 'green' | 'red' = 'blue') => {
    console.log(chalk[colorText](text));
}