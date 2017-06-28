import { ParseModel } from './parse';

export interface Result {
  markup: string;
  bindings: any[];
}

export type RegisterOpts = {
  type: string;
  propName?: string;
};

export type RegisterTarget = (m: ParseModel[], e: string, opts: RegisterOpts) => string;
