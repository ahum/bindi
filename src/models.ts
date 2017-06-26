export interface Result {
  markup: string;
  bindings: any[];
}

export type RegisterOpts = {
  type: string;
}

export type RegisterTarget = (any, string, RegisterOpts) => string;
