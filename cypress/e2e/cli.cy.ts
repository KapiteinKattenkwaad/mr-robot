/// <reference types="cypress" />

import { IN_GRID_ERROR } from '../../src/constants'

describe('Robot CLI E2E', () => {
  it('should process PLACE, MOVE, and REPORT', () => {
    const cliCommand = `echo "PLACE 0,0,NORTH\nMOVE\nREPORT\nEXIT\n" | npx ts-node src/index.ts`;
    cy.task('runCLI', { command: cliCommand }).then((result: any) => {
      expect(result.stdout).to.include('You are at (X: 0, Y: 1, Direction: NORTH)');
    });
  });

  it('should show an error for an unknown command', () => {
    const cliCommand = `echo "PLACE 0,0,NORTH\nJUMP\nEXIT\n" | npx ts-node src/index.ts`;
    cy.task('runCLI', { command: cliCommand }).then((result: any) => {
      expect(result.stdout).to.include('Unknown command');
    });
  });

  it('should turn left and report correct direction', () => {
    const cliCommand = `echo "PLACE 1,1,NORTH\nLEFT\nREPORT\nEXIT\n" | npx ts-node src/index.ts`;
    cy.task('runCLI', { command: cliCommand }).then((result: any) => {
      expect(result.stdout).to.include('You are at (X: 1, Y: 1, Direction: WEST)');
    });
  });

  it('should turn right and report correct direction', () => {
    const cliCommand = `echo "PLACE 1,1,NORTH\nRIGHT\nREPORT\nEXIT\n" | npx ts-node src/index.ts`;
    cy.task('runCLI', { command: cliCommand }).then((result: any) => {
      expect(result.stdout).to.include('You are at (X: 1, Y: 1, Direction: EAST)');
    });
  });

  it('should not place robot outside the grid', () => {
    const cliCommand = `echo "PLACE 5,5,NORTH\nREPORT\nEXIT\n" | npx ts-node src/index.ts`;
    cy.task('runCLI', { command: cliCommand }).then((result: any) => {
      expect(result.stdout).to.include(IN_GRID_ERROR);
    });
  });

  it('should handle all commands ', () => {
    const cliCommand = `echo "PLACE 0,0,NORTH\nMOVE\nRIGHT\nMOVE\nLEFT\nREPORT\nEXIT\n" | npx ts-node src/index.ts`;
    cy.task('runCLI', { command: cliCommand }).then((result: any) => {
      expect(result.stdout).to.include('You are at (X: 1, Y: 1, Direction: NORTH)');
    });
  });
}); 