# Robot Challenge CLI

A CLI application to control a robot on a configurable grid. Built with clean architecture principles, dependency injection, and comprehensive error handling.

## Prerequisites

- Node.js (v18 or newer)
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

   This will start the robot CLI with default settings.

3. **Build for production:**

   ```sh
   npm run build
   npm start
   ```

## Configuration

The application supports configuration through environment variables:

### Environment Variables

- `TABLE_WIDTH` - Width of the robot table (default: 5)
- `TABLE_HEIGHT` - Height of the robot table (default: 5)
- `LOG_LEVEL` - Logging level: debug, info, warn, error (default: info)
- `OUTPUT_FORMAT` - Output format: console, json (default: console)

### Example Configuration

Create a `.env` file in the project root:

```env
TABLE_WIDTH=10
TABLE_HEIGHT=8
LOG_LEVEL=debug
OUTPUT_FORMAT=json
```

Or set environment variables directly:

```sh
TABLE_WIDTH=10 TABLE_HEIGHT=8 npm run dev
```

## Usage

The application will display a welcome message and accept commands:

```
Welcome to Robot Simulator!
Type commands to control the robot, or "EXIT" to quit.
```

### Available Commands

- `PLACE X,Y,DIRECTION` - Place the robot at position (X,Y) facing DIRECTION
  - Example: `PLACE 0,0,NORTH`
- `MOVE` - Move the robot one step forward in its current direction
- `LEFT` - Turn the robot 90 degrees to the left
- `RIGHT` - Turn the robot 90 degrees to the right
- `REPORT` - Display the robot's current position and direction
- `EXIT` - Quit the application

### Valid Directions

- `NORTH`
- `EAST`
- `SOUTH`
- `WEST`

### Example Session

```
> PLACE 0,0,NORTH
> MOVE
> MOVE
> LEFT
> MOVE
> REPORT
Robot is at position (1, 2) facing WEST
> EXIT
Goodbye!
```

## Architecture

The application follows clean architecture principles with the following layers:

- **Domain Layer**: Core business logic (Robot entity, types)
- **Application Layer**: Use cases and command handling
- **Infrastructure Layer**: I/O, logging, configuration, dependency injection
- **Presentation Layer**: CLI interface

### Key Features

- **Dependency Injection**: Modular, testable architecture
- **Command Pattern**: Extensible command system
- **Error Handling**: Comprehensive error handling and resilience
- **Configuration Management**: Environment-based configuration
- **Multiple Output Formats**: Console and JSON output support
- **Structured Logging**: Configurable logging with different levels

## Testing

### Unit and Integration Tests

```sh
npm test
```

Watch mode for development:

```sh
npm run test-watch
```

### End-to-End Tests

Run Cypress tests:

```sh
npm run e2e
```

Open Cypress UI:

```sh
npx cypress open
```

### Test Coverage

The application includes comprehensive tests for:

- Domain logic (Robot behavior)
- Application services and commands
- Infrastructure components
- Integration scenarios
- Error handling paths

## Docker Support

Build and run with Docker:

```sh
docker build -t robot-challenge .
docker run -it robot-challenge
```

With custom configuration:

```sh
docker run -it -e TABLE_WIDTH=10 -e TABLE_HEIGHT=8 robot-challenge
```

## Development

### Project Structure

```
src/
├── domain/           # Core business logic
├── application/      # Use cases and commands
├── infrastructure/   # External concerns (I/O, config, DI)
└── presentation/     # CLI interface
```

### Adding New Commands

1. Create a new command class implementing the `Command` interface
2. Register it in the `CommandFactory`
3. Add parsing logic to the `InputParser` if needed
4. Write tests for the new command

### Extending Configuration

1. Add new configuration properties to the `Configuration` interface
2. Update the `EnvironmentConfigurationProvider`
3. Use the configuration in your components via dependency injection
