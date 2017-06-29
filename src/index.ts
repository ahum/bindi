import * as merge from 'lodash/merge';

import parse, { ParseModel, Target } from './parse';

import { ExpressionBindings } from './bindings';

export default function (
  rawMarkup: string,
  el: HTMLElement,
  props: string[]): { models: ParseModel[], markup: string } {

  //1. parse the markup looking for candidates
  const { models, markup } = parse(rawMarkup);


  //2. convert models into bindings
  const bindings = models.map(b => {
    const { expression, targets } = b;
    const eb = new ExpressionBindings(el, expression, targets);
    eb.init();
  });

  return { markup, models };
}
