import { defineConfig } from 'cypress';
import { exec } from 'child_process';

export default defineConfig({
  e2e: {
    supportFile: false,
    setupNodeEvents(on, config) {
      on('task', {
        runCLI({ command }) {
          return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
              if (error) {
                return reject(error);
              }
              resolve({ stdout, stderr });
            });
          });
        },
      });
    },
  },
});