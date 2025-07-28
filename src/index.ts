import { setupContainer } from './infrastructure/di/setupContainer';

/**
 * Main entry point for the robot application.
 * Sets up the dependency injection container and starts the CLI application.
 */
async function main(): Promise<void> {
  try {
    // Set up the container
    const container = setupContainer();
    
    // Get the CLI application
    const cliApplication = container.get<any>('cliApplication');
    
    // Set up signal handlers for graceful shutdown
    setupSignalHandlers(cliApplication);
    
    // Start the application
    await cliApplication.start();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

/**
 * Sets up signal handlers for graceful shutdown.
 * @param cliApplication - The CLI application to stop on shutdown
 */
function setupSignalHandlers(cliApplication: { stop: () => void }): void {
  // Handle SIGINT (Ctrl+C)
  process.on('SIGINT', () => {
    console.log('\nReceived SIGINT. Shutting down...');
    cliApplication.stop();
  });
  
  // Handle SIGTERM
  process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM. Shutting down...');
    cliApplication.stop();
  });
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('\nUncaught exception:', error);
    cliApplication.stop();
    process.exit(1);
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('\nUnhandled promise rejection:', reason);
    cliApplication.stop();
    process.exit(1);
  });
}

// Run the application
main().catch((error) => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});