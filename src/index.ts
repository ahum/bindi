import * as merge from 'lodash/merge';

import parse, { ParseModel, Target } from './parse';

import { ExpressionBindings } from './bindings';
import { RegisterOpts } from './models';

const getExpressionModel = (acc: ParseModel[], expression): ParseModel => {
  const existing = acc.find(m => m.expression === expression);
  if (existing) {
    return existing;
  } else {

    const newModel = {
      expression,
      targets: []
    };

    acc.push(newModel);
    return newModel;
  }
};

const registerTarget = (acc: ParseModel[], expression: string, opts: RegisterOpts): string => {
  const em = getExpressionModel(acc, expression);
  const t: Target = merge({}, opts, {
    id: `${expression}_${em.targets.length}`
  });
  em.targets.push(t);
  return t.id;
};

export default function (rawMarkup: string, el: HTMLElement): { models: any[], markup: string } {
  const { models, markup } = parse(registerTarget, rawMarkup);

  const bindings = models.map(b => {
    const { expression, targets } = b;
    const eb = new ExpressionBindings(el, expression, targets);
    eb.init();
  });

  return { markup, models: [] };
}
