import * as merge from 'lodash/merge';

import { BindingGroup, ExpressionBindings } from './bindings';
import markup, { NodeBind } from './parse/markup';
import parse, { Entry, Expression, ParseModel, PropertyBinding, Target } from './parse';

export default function (
  rawMarkup: string,
  el: HTMLElement,
  props: string[]): { markup: string, bindings: NodeBind[] } {

  const entries: Entry[] = parse(rawMarkup);
  const model = markup(entries);


  const grouped = model.bindings.reduce<BindingGroup[]>((acc, b: NodeBind) => {

    return b.bindings.reduce<BindingGroup[]>((acc, pb: PropertyBinding) => {

      const expression = Expression.build(pb.expr);

      let group = acc.find(e => e.root === expression.root);
      if (!group) {
        group = new BindingGroup(el, expression.root);
        acc.push(group);
      }

      const target = {
        type: pb.type,
        id: b.id,
        prop: pb.prop,
        event: pb.event
      };

      group.addBinding(target, expression);
      return acc;
    }, acc);
  }, []);

  grouped.forEach(g => g.init());

  return model;

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
