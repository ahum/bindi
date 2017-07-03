declare const BINDI_DEBUG: boolean;

export interface Logger {
  log(...args: any[]): void;
}

class NullLogger implements Logger {
  log(...args: any[]): void {
    //do nothing
  }
}

const stringToColour = function (str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    // tslint:disable-next-line:no-bitwise
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var z = 0; z < 3; z++) {
    // tslint:disable-next-line:no-bitwise
    var value = (hash >> (z * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
};

const nullLogger = new NullLogger();

export class ConsoleLogger implements Logger {
  constructor(private name: string) { }

  log(...args: any[]): void {
    // tslint:disable-next-line:no-string-literal
    if (typeof window['console'] !== 'undefined') {
      const color = `${stringToColour(`bindi:${this.name}`)}`;
      return console.log(`%c[bindi:${this.name}]`, `color: ${color}; padding: 1px`, ...args);
    }
  }
}

export default function (name: string): Logger {
  return BINDI_DEBUG ? new ConsoleLogger(name) : nullLogger;
}



