import * as compact from 'lodash/compact';
import * as groupBy from 'lodash/groupBy';

import { Attribute, Binding, Entry, ParseNode } from './index';

const isString = (e: Entry): e is string => typeof e === 'string';
const isParseNode = (e: Entry): e is ParseNode => (<ParseNode>e).name !== undefined;
const isBinding = (e: Entry): e is Binding => (<Binding>e).expr !== undefined;

const mkSimpleAttribute = (a: Attribute): string => `${a.label}="${a.value}"`;



/**
 * attributes: [ {label: 'a', value: { expr: 'a'}}] => 
 * - get id for node and add it
 * - add binding to model.bindings
 */
const mkTag = (pn: ParseNode, model: Model): Model => {

  let id = null;

  if (pn.propertyBindings && pn.propertyBindings.length > 0) {
    id = { label: 'bindi-id', value: model.bindings.length.toString() };
    model.bindings.push({
      id: id.value,
      bindings: pn.propertyBindings
    });
  }

  const normal = compact([id].concat(pn.attributes));
  const attributes = normal.length === 0 ? '' : ' ' + normal.map(mkSimpleAttribute);
  const m = markup(pn.children).markup;
  const tag = `<${pn.name}${attributes}>${m}</${pn.name}>`;
  model.markup += tag;
  return model;
};

const buildModel = (acc: Model, e: Entry): Model => {
  if (isString(e)) {
    acc.markup += e;
    return acc;
  } else if (isParseNode(e)) {
    return mkTag(e, acc);
  } else if (isBinding(e)) {

    const id = acc.bindings.length.toString();
    acc.markup += `<span bindi-id="${id}"></span>`;
    acc.bindings.push({
      id,
      bindings: [
        { prop: 'innerHTML', expr: e.expr }
      ]
    });

    return acc;
  } else {
    return acc;
  }
};

export type Model = {
  markup: string,
  bindings: any[]
};

export default function markup(entries: Entry[], model: Model = { markup: '', bindings: [] }): Model {
  return entries.reduce<Model>(buildModel, model);
}
