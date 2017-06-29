import * as merge from 'lodash/merge';
import * as models from './models';

export type RegisterTarget = (m: ParseModel[], e: string, opts: RegisterOpts) => string;


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
  expression: string;
  targets: Target[];
}

/**
 * Find an existing model or create one
 * @param models
 * @param expression
 */
const getOrCreateModel = (models: ParseModel[], expression: Expression): ParseModel => {
  const existing = models.find(m => m.expression === expression.prop);

  if (existing) {
    return existing;
  } else {

    const newModel = {
      expression: expression.prop,
      targets: []
    };

    models.push(newModel);
    return newModel;
  }
};

export type Expression = {
  prop: string;
  event?: string;
};

const toExpression = (s: string): Expression => {
  console.log('[toExpression]', s);
  if (s.indexOf('::') !== -1) {
    const [prop, event] = s.split('::');
    return { prop, event };
  } else {
    return { prop: s };
  }
};

/**
 * Find a matching expression model and add a target within that model for the node
 * @param models the models
 * @param expression the binding expression
 * @param opts the registration opts
 * @return string the uid for the binding
 */
const registerTarget = (models: ParseModel[], expression: Expression, opts: RegisterOpts): string => {
  const em = getOrCreateModel(models, expression);
  const baseName = expression.event ? `${expression.prop}_${expression.event}` : expression.prop;
  const t: Target = merge({}, opts, {
    id: `${baseName}_${em.targets.length}`,
    event: expression.event
  });
  em.targets.push(t);
  return t.id;
};
enum NodeType {
  TEXT_NODE = 3
}

const walk = (node: Node, outNode: HTMLElement, acc: ParseModel[]): ParseModel[] => {

  if (node) {
    const { childNodes } = node;

    if (childNodes.length === 0) {
      return acc;
    } else {

      return [].reduce.call(childNodes, (acc: ParseModel[], n) => {
        if (n.nodeType === NodeType.TEXT_NODE) {
          const out = n.textContent.replace(/\[\[(.*?)\]\]/g, function (match, raw: string) {
            const expression = toExpression(raw);
            const targetId = registerTarget(acc, expression, { type: 'text', bind: BindType.ONE_WAY });
            return `<span bindi-id="${targetId}"></span>`;
          });
          outNode.innerHTML += out;
          return acc;
        } else {
          const nn = n.cloneNode(false);

          for (var i = 0; i < nn.attributes.length; i++) {
            var a = nn.attributes[i];
            if (a.value.indexOf('{{') === 0 && a.value.indexOf('}}') === a.value.length - 2) {
              const raw: string = a.value.match(/^{{(.*?)}}$/)[1];
              const expression = toExpression(raw);
              const targetId = registerTarget(acc, expression, { type: 'prop', propName: a.name, bind: BindType.TWO_WAY });
              nn.removeAttribute(a.name);
              nn.setAttribute('bindi-id', targetId);
            }
          }
          outNode.appendChild(nn);
          return walk(n, nn, acc);
        }
      }, acc);
    }
  } else {
    return acc;
  }
};

const parser = new DOMParser();

export default function (raw: string): { models: ParseModel[], markup: string } {
  /**
   * note: we use the DOMParser so when parsing we're not instantiating the custom element definitions.
   */
  const doc = parser.parseFromString(`<div id="bindi-root">${raw}</div>`, 'text/html');
  const out = parser.parseFromString('', 'text/html');

  const root = doc.querySelector('#bindi-root');
  const outRoot = out.querySelector('body');
  const models = walk(root, outRoot, []);

  return {
    markup: outRoot.innerHTML,
    models
  };
}
