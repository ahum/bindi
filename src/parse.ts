import * as models from './models';

export interface Target {
  type: string;
  id: string;
}

export interface PropTarget extends Target {
  propName: string;
}

export interface ParseModel {
  expression: string;
  targets: Target[];
}

const walk = (registerTarget: models.RegisterTarget, node: Node, outNode: HTMLElement, acc: ParseModel[]): ParseModel[] => {

  if (node) {
    const childNodes = node.childNodes;
    if (childNodes.length === 0) {
      return acc;
    } else {

      return [].reduce.call(childNodes, (acc: ParseModel[], n) => {
        if (n.nodeType === 3) {
          const out = n.textContent.replace(/\[\[(.*?)\]\]/g, function (match, expression) {
            const targetId = registerTarget(acc, expression, { type: 'text' });
            return `<span bindi-id="${targetId}"></span>`;
          });
          outNode.innerHTML += out;
          return acc;
        } else {
          const nn = n.cloneNode(false);

          for (var i = 0; i < nn.attributes.length; i++) {
            var a = nn.attributes[i];
            if (a.value.indexOf('{{') === 0) {
              const expression = a.value.match(/{{(.*?)}}/)[1];
              const targetId = registerTarget(acc, expression, { type: 'prop', propName: a.name });
              nn.removeAttribute(a.name);
              nn.setAttribute('bindi-id', targetId);
            }
          }
          outNode.appendChild(nn);
          return walk(registerTarget, n, nn, acc);
        }
      }, acc);
    }
  } else {
    return acc;
  }
}

export default function (registerTarget: models.RegisterTarget, raw: string): { models: any[], markup: string } {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  div.innerHTML = raw;
  fragment.appendChild(div);

  const destFragment = document.createDocumentFragment();
  const outDiv = document.createElement('div');
  destFragment.appendChild(outDiv);
  const models = walk(registerTarget, fragment.firstChild, outDiv, []);

  return {
    markup: outDiv.innerHTML,
    models
  };
}
