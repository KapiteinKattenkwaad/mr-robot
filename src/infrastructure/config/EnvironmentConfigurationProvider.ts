import { Configuration, ConfigurationProvider, TableBounds, LoggingConfiguration, OutputConfiguration } from './Configuration';

export class EnvironmentConfigurationProvider implements ConfigurationProvider {
  getConfiguration(): Configuration {
    return {
      table: this.getTableConfiguration(),
      logging: this.getLoggingConfiguration(),
      output: this.getOutputConfiguration()
    };
  }

  private getTableConfiguration(): TableBounds {
    const width = this.parsePositiveInteger(process.env.TABLE_WIDTH, 5, 'TABLE_WIDTH');
    const height = this.parsePositiveInteger(process.env.TABLE_HEIGHT, 5, 'TABLE_HEIGHT');
    
    return { width, height };
  }

  private getLoggingConfiguration(): LoggingConfiguration {
    const level = this.parseLogLevel(process.env.LOG_LEVEL, 'info');
    const format = this.parseLogFormat(process.env.LOG_FORMAT, 'text');
    
    return { level, format };
  }

  private getOutputConfiguration(): OutputConfiguration {
    const format = this.parseOutputFormat(process.env.OUTPUT_FORMAT, 'console');
    const colors = this.parseBoolean(process.env.OUTPUT_COLORS, true);
    
    return { format, colors };
  }

  private parsePositiveInteger(value: string | undefined, defaultValue: number, fieldName: string): number {
    if (!value) {
      return defaultValue;
    }

    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed <= 0) {
      throw new Error(`Invalid ${fieldName}: must be a positive integer, got "${value}"`);
    }

    return parsed;
  }

  private parseLogLevel(value: string | undefined, defaultValue: 'debug' | 'info' | 'warn' | 'error'): 'debug' | 'info' | 'warn' | 'error' {
    if (!value) {
      return defaultValue;
    }

    const validLevels = ['debug', 'info', 'warn', 'error'] as const;
    const lowercaseValue = value.toLowerCase();
    
    if (!validLevels.includes(lowercaseValue as any)) {
      throw new Error(`Invalid LOG_LEVEL: must be one of ${validLevels.join(', ')}, got "${value}"`);
    }

    return lowercaseValue as 'debug' | 'info' | 'warn' | 'error';
  }

  private parseLogFormat(value: string | undefined, defaultValue: 'text' | 'json'): 'text' | 'json' {
    if (!value) {
      return defaultValue;
    }

    const validFormats = ['text', 'json'] as const;
    const lowercaseValue = value.toLowerCase();
    
    if (!validFormats.includes(lowercaseValue as any)) {
      throw new Error(`Invalid LOG_FORMAT: must be one of ${validFormats.join(', ')}, got "${value}"`);
    }

    return lowercaseValue as 'text' | 'json';
  }

  private parseOutputFormat(value: string | undefined, defaultValue: 'console' | 'json'): 'console' | 'json' {
    if (!value) {
      return defaultValue;
    }

    const validFormats = ['console', 'json'] as const;
    const lowercaseValue = value.toLowerCase();
    
    if (!validFormats.includes(lowercaseValue as any)) {
      throw new Error(`Invalid OUTPUT_FORMAT: must be one of ${validFormats.join(', ')}, got "${value}"`);
    }

    return lowercaseValue as 'console' | 'json';
  }

  private parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
    if (!value) {
      return defaultValue;
    }

    const lowercaseValue = value.toLowerCase();
    
    if (lowercaseValue === 'true' || lowercaseValue === '1' || lowercaseValue === 'yes') {
      return true;
    }
    
    if (lowercaseValue === 'false' || lowercaseValue === '0' || lowercaseValue === 'no') {
      return false;
    }

    throw new Error(`Invalid boolean value: must be true/false, 1/0, or yes/no, got "${value}"`);
  }
}