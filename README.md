# Robot Challenge CLI

A CLI app to control a robot on a grid.

## Prerequisites

- Node.js (v18 or newer recommended)
- npm

## Setup

1. **Install dependencies:**

   ```sh
   npm install
   ```
2. **Run the CLI:**

   ```sh
   npm run dev
   ```

   This will start the robot CLI.
3. **Run unit and integration tests:**

   ```sh
   npm test
   ```

   or to watch tests as you code:

   ```sh
   npm run test-watch
   ```
4. **Run E2E tests (Cypress):**

   ```sh
   npm run e2e
   ```

   open the Cypress UI:

   ```sh
   npx cypress open
   ```

## Usage

You will see a prompt:

```
Welcome to the Robot walk!
 Please choose one of the follow commands:
 PLACE X,Y F
 MOVE
 LEFT or RIGHT
 REPORT
```

Your first command should be `Place X,Y,F`

E.g.
```
Place 1,1,NORTH
```
Type commands such as:

- `PLACE 0,0,NORTH`
- `MOVE`
- `LEFT`
- `RIGHT`
- `REPORT`

Type `EXIT` to quit.

## Testing

- **Unit/Integration:** Uses Jest (`src/components/`)
- **E2E:** Uses Cypress (`cypress/e2e/cli.cy.ts`)
