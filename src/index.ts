import * as merge from 'lodash/merge';

import { BindingGroup, EventBind, Initable } from './bindings';
import parse, { BindingModel, ParseModel, Target, isBindingModel, isEventModel } from './parse';

import getLogger from './log';

const logger = getLogger('bindi');

export function prepare(rawMarkup: string): { markup: string, bind: (el: HTMLElement) => void } {
  //1. parse the markup looking for candidates
  const { models, markup } = parse(rawMarkup);

  return {
    markup,
    bind: (el: HTMLElement) => {
      //2. convert models into bindings
      // {expression, target}
      const bindings = models.reduce<Initable[]>((acc, pm: ParseModel) => {
        // const { expression, target } = b;
        // const eb = new ExpressionBindings(el, expression, targets);
        // eb.init();
        if (isBindingModel(pm)) {
          let group: BindingGroup = acc.find(e => (e instanceof BindingGroup && e.root === pm.expression.root)) as BindingGroup;
          if (!group) {
            group = new BindingGroup(el, pm.expression.root);
            acc.push(group);
          }
          group.addBinding(pm.target, pm.expression);
        } else if (isEventModel(pm)) {
          acc.push(new EventBind(el, pm.event, pm.fn, pm.id));
        }
        return acc;
      }, []);

      bindings.forEach(b => {
        logger.log('call init: ', b);
        b.init();
      });

      return { markup, models };
    }
  };
}

export default function (
  rawMarkup: string,
  el: HTMLElement,
  props: string[]): { models: ParseModel[], markup: string } {


  const o = prepare(rawMarkup);

  const b = o.bind(el);
  return {
    markup: o.markup,
    models: []
  };

}
