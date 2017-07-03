declare const BINDI_DEBUG: boolean;

export interface Logger {
  log(...args: any[]): void;
}

class NullLogger implements Logger {
  log(...args: any[]): void {
    //do nothing
  }
}

const nullLogger = new NullLogger();

export class ConsoleLogger implements Logger {
  constructor(private name: string) { }

  log(...args: any[]): void {
    // tslint:disable-next-line:no-string-literal
    if (typeof window['console'] !== 'undefined') {
      return console.log(`[bindi:${this.name}]`, ...args);
    }
  }
}

export default function (name: string): Logger {
  return BINDI_DEBUG ? new ConsoleLogger(name) : nullLogger;
}



