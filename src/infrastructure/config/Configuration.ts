export interface TableBounds {
  readonly width: number;
  readonly height: number;
}

export interface LoggingConfiguration {
  readonly level: 'debug' | 'info' | 'warn' | 'error';
  readonly format: 'text' | 'json';
}

export interface OutputConfiguration {
  readonly format: 'console' | 'json';
  readonly colors: boolean;
}

export interface Configuration {
  readonly table: TableBounds;
  readonly logging: LoggingConfiguration;
  readonly output: OutputConfiguration;
}

export interface ConfigurationProvider {
  getConfiguration(): Configuration;
}