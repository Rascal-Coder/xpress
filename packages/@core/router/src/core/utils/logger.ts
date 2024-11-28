/* eslint-disable no-console */
const PREFIX = '[Router]';

export type LogLevel = 'error' | 'info' | 'warn';

export interface LoggerOptions {
  disabled?: boolean;
  level?: LogLevel;
  prefix?: string;
}

class Logger {
  private disabled: boolean;
  private level: LogLevel;
  private prefix: string;

  constructor(options: LoggerOptions = {}) {
    this.prefix = options.prefix || PREFIX;
    this.level = options.level || 'warn';
    this.disabled = options.disabled || false;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  error(message: Error | string, ...args: any[]): void {
    if (this.disabled || !this.shouldLog('error')) return;
    console.error(
      `${this.prefix} ${message instanceof Error ? message.message : message}`,
      ...args,
    );
  }

  info(message: string, ...args: any[]): void {
    if (this.disabled || !this.shouldLog('info')) return;
    console.info(`${this.prefix} ${message}`, ...args);
  }

  setOptions(options: Partial<LoggerOptions>): void {
    if (options.prefix) this.prefix = options.prefix;
    if (options.level) this.level = options.level;
    if (typeof options.disabled === 'boolean') this.disabled = options.disabled;
  }

  warn(message: string, ...args: any[]): void {
    if (this.disabled || !this.shouldLog('warn')) return;
    console.warn(`${this.prefix} ${message}`, ...args);
  }
}

export const logger = new Logger({
  level: import.meta.env.MODE === 'development' ? 'info' : 'error',
  prefix: PREFIX,
});
