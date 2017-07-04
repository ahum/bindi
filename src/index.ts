import * as merge from 'lodash/merge';

import { BindingGroup, ExpressionBindings } from './bindings';
import parse, { ParseModel, Target } from './parse';

export default function (
  rawMarkup: string,
  el: HTMLElement,
  props: string[]): { models: ParseModel[], markup: string } {
  return null;

  //1. parse the markup looking for candidates
  //const { models, markup } = parse(rawMarkup);


  //2. convert models into bindings
  // {expression, target}
  // const bindings = models.reduce<BindingGroup[]>((acc, pm: ParseModel) => {
  //   // const { expression, target } = b;
  //   // const eb = new ExpressionBindings(el, expression, targets);
  //   // eb.init();
  //   let group = acc.find(e => e.root === pm.expression.root);
  //   if (!group) {
  //     group = new BindingGroup(el, pm.expression.root);
  //     acc.push(group);
  //   }
  //   group.addBinding(pm.target, pm.expression);
  //   return acc;
  // }, []);

  // bindings.forEach(b => b.init());

  // console.log('bindings: ', bindings);

  // return { markup, models };
}
