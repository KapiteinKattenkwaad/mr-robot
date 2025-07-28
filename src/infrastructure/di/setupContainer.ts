import { Container, SimpleContainer } from './Container';

/**
 * Sets up a container with all the services needed for the robot application.
 * @returns A configured container with all services registered
 */
export function setupContainer(): Container {
  const container = new SimpleContainer();
  
  // Register configuration
  container.registerSingleton('configProvider', () => {
    const { EnvironmentConfigurationProvider } = require('../config/EnvironmentConfigurationProvider');
    return new EnvironmentConfigurationProvider();
  });
  
  container.registerSingleton('config', () => {
    const configProvider = container.get<any>('configProvider');
    return configProvider.getConfiguration();
  });
  
  // Register domain services
  container.registerSingleton('robot', () => {
    const { Robot } = require('../../domain/Robot');
    const config = container.get<any>('config');
    return new Robot(config.table);
  });
  
  // Register infrastructure services
  container.registerSingleton('logger', () => {
    const { ConsoleLogger } = require('../logging/Logger');
    const config = container.get<any>('config');
    return new ConsoleLogger(config.logging.level, config.logging.format === 'json');
  });
  
  container.registerSingleton('inputParser', () => {
    const { RegexInputParser } = require('../io/RegexInputParser');
    return new RegexInputParser();
  });
  
  container.registerSingleton('inputReader', () => {
    const { ConsoleInputReader } = require('../io/ConsoleInputReader');
    return new ConsoleInputReader();
  });
  
  container.registerSingleton('outputWriter', () => {
    const { ConsoleOutputWriter } = require('../io/ConsoleOutputWriter');
    return new ConsoleOutputWriter();
  });
  
  container.registerSingleton('outputFormatter', () => {
    const config = container.get<any>('config');
    
    if (config.output.format === 'json') {
      const { JsonOutputFormatter } = require('../io/JsonOutputFormatter');
      return new JsonOutputFormatter();
    } else {
      const { ConsoleOutputFormatter } = require('../io/ConsoleOutputFormatter');
      return new ConsoleOutputFormatter(config.output.colors);
    }
  });
  
  // Register application services
  container.registerSingleton('commandFactory', () => {
    const { DefaultCommandFactory } = require('../../application/commands/CommandFactory');
    const robot = container.get<any>('robot');
    const inputParser = container.get<any>('inputParser');
    return DefaultCommandFactory.createWithDefaultCommands(robot, inputParser);
  });
  
  container.registerSingleton('robotApplicationService', () => {
    const { RobotApplicationServiceImpl } = require('../../application/RobotApplicationService');
    const robot = container.get<any>('robot');
    const commandFactory = container.get<any>('commandFactory');
    const logger = container.get<any>('logger');
    return new RobotApplicationServiceImpl(robot, commandFactory, logger);
  });
  
  // Register presentation services
  container.registerSingleton('cliApplication', () => {
    const { CLIApplication } = require('../../presentation/CLIApplication');
    const inputReader = container.get<any>('inputReader');
    const outputWriter = container.get<any>('outputWriter');
    const outputFormatter = container.get<any>('outputFormatter');
    const robotApplicationService = container.get<any>('robotApplicationService');
    const logger = container.get<any>('logger');
    return new CLIApplication(
      inputReader,
      outputWriter,
      outputFormatter,
      robotApplicationService,
      logger
    );
  });
  
  return container;
}