import * as compact from 'lodash/compact';
import * as groupBy from 'lodash/groupBy';

import { Attribute, BindType, Entry, OneWayBinding, PropertyBinding, SelfClosingTag, Tag } from './index';

import getLogger from '../log';

const logger = getLogger('markup');

const isString = (e: Entry): e is string => typeof e === 'string';
const isTag = (e: Entry): e is Tag => (<Tag>e).name !== undefined && e.hasOwnProperty('children');
const isSelfClosingTag = (e: Entry): e is SelfClosingTag => (<SelfClosingTag>e).selfClosing === true;
const isOneWayBinding = (e: Entry): e is OneWayBinding => (<OneWayBinding>e).expr !== undefined;

const mkSimpleAttribute = (a: Attribute): string => `${a.label}="${a.value}"`;

const mkTag = (pn: Tag, model: Model): Model => {

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
  model.markup += `<${pn.name}${attributes}>`;
  markup(pn.children, model);
  model.markup += `</${pn.name}>`;
  return model;
};

const buildModel = (acc: Model, e: Entry): Model => {
  if (isString(e)) {
    acc.markup += e;
    return acc;
  } else if (isTag(e) && e.name === 'dom-repeat') {
    const id = acc.bindings.length.toString();
    const pb = e.propertyBindings.find(b => b.prop === 'items');
    acc.bindings.push({
      id,
      bindings: [pb]
    });
    let m = markup(e.children);
    acc.markup += `<dom-repeat bindi-id="${id}">`;
    acc.markup += m.markup;
    acc.markup += `</dom-repeat>`;
    return acc;
  } else if (isTag(e)) {
    return mkTag(e, acc);
  } else if (isSelfClosingTag(e)) {
    const attributes = e.attributes && e.attributes.length > 0 ? ' ' + e.attributes.map(mkSimpleAttribute).join(' ') : '';
    acc.markup += `<${e.name}${attributes}/>`;
    return acc;
  } else if (isOneWayBinding(e)) {

    const id = acc.bindings.length.toString();
    acc.markup += `<span bindi-id="${id}"></span>`;
    acc.bindings.push({
      id,
      bindings: [
        { prop: 'innerHTML', expr: e.expr, type: BindType.ONE_WAY, event: undefined }
      ]
    });

    return acc;
  } else {
    logger.log('unknown entry: ', e);
    return acc;
  }
};

export type NodeBind = {
  id: string;
  bindings: PropertyBinding[];
};

export type Model = {
  markup: string,
  bindings: NodeBind[]
};

export default function markup(entries: Entry[], model: Model = { markup: '', bindings: [] }): Model {
  return entries.reduce<Model>(buildModel, model);
}
