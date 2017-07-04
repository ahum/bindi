import * as merge from 'lodash/merge';
import * as models from '../models';
import * as mustache from 'mustache';

import getLogger from '../log';

const logger = getLogger('parse');

let pegParser;

//TODO: workaround until build is sorted.
try {
  pegParser = require('./grammar.pegjs');
} catch (e) {
  pegParser = require('./grammar');
}

/**
 * Not really in use at this stage
 */
export enum BindType {
  ONE_WAY = 'one-way',
  TWO_WAY = 'two-way'
}

export type RegisterOpts = {
  type: string;
  propName?: string;
  bind: BindType;
};

export interface Target {
  type: string;
  id: string;
  event?: string;
}

export interface PropTarget extends Target {
  propName: string;
}

export interface ParseModel {
  expression: Expression;
  target: Target;
}

/**
 * Find an existing model or create one
 * @param models
 * @param expression
 */

export class Expression {
  static build(raw: string): Expression {
    const props = (s: string): string[] => s.split('.');
    logger.log('[toExpression]', raw);
    if (raw.indexOf('::') !== -1) {
      const [p, event] = raw.split('::');
      return new Expression(props(p), event);
    } else {
      return new Expression(props(raw));
    }
  }

  get root(): string {
    return this.props[0];
  }

  get rest(): string {
    if (this.nested) {
      return this.raw.replace(`${this.root}.`, '');
    } else {
      return '';
    }
  }

  get raw(): string {
    return this.props.join('.');
  }

  get nested(): boolean {
    return this.props.length > 1;
  }

  domId(index: number): string {
    const propString = this.props.join('_');
    return `${this.event ? `${propString}::${this.event}` : propString}_${index}`;
  }

  mkString(delimiter: string): string {
    return this.props.join(delimiter);
  }

  private constructor(private props: string[], readonly event?: string) {
    if (!props || props.length === 0) {
      throw new Error('props must have a length of at least 1');
    }
  }
}

export type OneWayBinding = {
  expr: string
};

export type Attribute = {
  label: string,
  value: string
};

/**
 * foo="{{bar}}""
 * TODO: add event:
 * <input value="{{bar::input}}"></input>
 */
export type PropertyBinding = {
  prop: string;
  expr: string;
  event?: string;
  type: BindType;
};

export type ParseNode = {
  attributes: Attribute[],
  propertyBindings: PropertyBinding[];
  name: string,
  children: Entry[]
};

export type Entry = string | ParseNode | OneWayBinding;

export default function (raw: string): Entry[] {
  return pegParser.parse(raw);
}
