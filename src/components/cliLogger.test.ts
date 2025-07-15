import { cliLog } from './cliLogger';

describe('cliLog', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('logs blue text by default', () => {
    cliLog('Hello, world!');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Hello, world!'));
  });

  it('logs green text when color is green', () => {
    cliLog('Success!', 'green');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Success!'));
  });

  it('logs red text when color is red', () => {
    cliLog('Error!', 'red');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error!'));
  });
});