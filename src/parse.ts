import * as merge from 'lodash/merge';
import * as models from './models';

import getLogger from './log';

const logger = getLogger('parse');

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
  expression: Expression;
  target: Target;
}


/**
 * models: [ {root: 'foo', targets: [{path: 'foo.bar', }]}]
 */
/**
 * Find an existing model or create one
 * @param models
 * @param expression
 */
// const getOrCreateModel = (models: ParseModel[], expression: Expression): ParseModel => {
//   const existing = models.find(m => m.expression.raw === expression.raw);

//   if (existing) {
//     return existing;
//   } else {

//     const newModel = {
//       expression,
//       targets: []
//     };

//     models.push(newModel);
//     return newModel;
//   }
// };

export class Expression {
  static build(raw: string): Expression {
    const props = (s: string): string[] => s.split('.');
    logger.log('[toExpression]', raw);
    if (raw.indexOf('::') !== -1) {
      const [p, event] = raw.split('::');
      return new Expression(props(p), event);
    } else {
      return new Expression(props(raw));
    }
  }

  get root(): string {
    return this.props[0];
  }

  get rest(): string {
    if (this.nested) {
      return this.raw.replace(`${this.root}.`, '');
    } else {
      return '';
    }
  }

  get raw(): string {
    return this.props.join('.');
  }

  get nested(): boolean {
    return this.props.length > 1;
  }

  domId(index: number): string {
    const propString = this.props.join('_');
    return `${this.event ? `${propString}::${this.event}` : propString}_${index}`;
  }

  mkString(delimiter: string): string {
    return this.props.join(delimiter);
  }

  private constructor(private props: string[], readonly event?: string) {
    if (!props || props.length === 0) {
      throw new Error('props must have a length of at least 1');
    }
  }
}

// export type Expression = {
//   prop: string;
//   event?: string;
// };


/**
 * Find a matching expression model and add a target within that model for the node
 * @param models the models
 * @param expression the binding expression
 * @param opts the registration opts
 * @return string the uid for the binding
 */
const registerTarget = (models: ParseModel[], expression: Expression, opts: RegisterOpts): string => {
  const target: Target = merge({}, opts, {
    id: expression.domId(models.length),
    event: expression.event
  });

  models.push({
    expression,
    target
  });

  return target.id;
};

enum NodeType {
  TEXT_NODE = 3
}

const walk = (node: Node, outNode: HTMLElement, acc: ParseModel[]): ParseModel[] => {

  if (node) {
    const { childNodes } = node;

    logger.log('childNodes:', childNodes);
    if (!childNodes || childNodes.length === 0) {
      return acc;
    } else {

      return [].reduce.call(childNodes, (acc: ParseModel[], n) => {
        if (n.nodeType === NodeType.TEXT_NODE) {
          const out = n.textContent.replace(/\[\[(.*?)\]\]/g, function (match, raw: string) {
            const expression = Expression.build(raw);
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
              const expression = Expression.build(raw);
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
