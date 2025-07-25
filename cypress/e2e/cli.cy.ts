/// <reference types="cypress" />

describe('Robot CLI E2E', () => {
  it('should process PLACE, MOVE, and REPORT', () => {
    const cliCommand = `echo "PLACE 0,0,NORTH\nMOVE\nREPORT\nEXIT\n" | npx ts-node src/index.ts`;
    cy.task('runCLI', { command: cliCommand }).then((result: any) => {
      expect(result.stdout).to.include('0,1,NORTH');
    });
  });

  it('should show an error for an unknown command', () => {
    const cliCommand = `echo "PLACE 0,0,NORTH\nJUMP\nEXIT\n" | npx ts-node src/index.ts`;
    cy.task('runCLI', { command: cliCommand }).then((result: any) => {
      expect(result.stdout).to.include('Invalid command');
    });
  });

  it('should turn left and report correct direction', () => {
    const cliCommand = `echo "PLACE 1,1,NORTH\nLEFT\nREPORT\nEXIT\n" | npx ts-node src/index.ts`;
    cy.task('runCLI', { command: cliCommand }).then((result: any) => {
      expect(result.stdout).to.include('1,1,WEST');
    });
  });

  it('should turn right and report correct direction', () => {
    const cliCommand = `echo "PLACE 1,1,NORTH\nRIGHT\nREPORT\nEXIT\n" | npx ts-node src/index.ts`;
    cy.task('runCLI', { command: cliCommand }).then((result: any) => {
      expect(result.stdout).to.include('1,1,EAST');
    });
  });

  it('should not place robot outside the grid', () => {
    const cliCommand = `echo "PLACE 5,5,NORTH\nREPORT\nEXIT\n" | npx ts-node src/index.ts`;
    cy.task('runCLI', { command: cliCommand }).then((result: any) => {
      expect(result.stdout).to.include('outside');
    });
  });

  it('should handle all commands ', () => {
    const cliCommand = `echo "PLACE 0,0,NORTH\nMOVE\nRIGHT\nMOVE\nLEFT\nREPORT\nEXIT\n" | npx ts-node src/index.ts`;
    cy.task('runCLI', { command: cliCommand }).then((result: any) => {
      expect(result.stdout).to.include('1,1,NORTH');
    });
  });
}); 